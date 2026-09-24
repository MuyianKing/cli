import { existsSync, readdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { readJsonSync } from 'fs-extra/esm'
import inquirer from 'inquirer'
import ora from 'ora'
import download from '../utils/download.js'

// 文件名不允许的字符，按 Windows 的规则来
const ILLEGAL_NAME = /[<>:"/\\|?*]/

// inquirer 的按键提示文案是英文且写死在 @inquirer/select 里，用 theme 换掉它渲染出来的文字
const LIST_THEME = {
  style: {
    help: text => (text.includes('reveal more choices') ? '（更多选项请用方向键翻看）' : '（↑↓ 选择，回车确认）'),
  },
}

/**
 * 校验项目名：不能为空、不能是路径、不能含非法字符、目录不能已存在
 * @param {string} val 用户输入
 * @returns {true | string} 通过返回 true，否则返回提示文案
 */
function validateName(val) {
  const name = val.trim()

  if (!name) {
    return '请输入项目名称'
  }
  if (name === '.' || name === '..') {
    return '项目名不能是 . 或 ..'
  }
  if (ILLEGAL_NAME.test(name)) {
    return '项目名不能包含 < > : " / \\ | ? * 等字符'
  }
  if (existsSync(path.resolve(process.cwd(), name))) {
    return `${name} 文件夹已经存在`
  }

  return true
}

/**
 * 模板自带 lockfile 时按其包管理器提示，否则用 pnpm（本 CLI 的推荐）
 * @param {string} project_path 项目目录
 */
function detectPackageManager(project_path) {
  if (existsSync(path.join(project_path, 'pnpm-lock.yaml')) || existsSync(path.join(project_path, 'pnpm-workspace.yaml'))) {
    return 'pnpm'
  }
  if (existsSync(path.join(project_path, 'yarn.lock'))) {
    return 'yarn'
  }
  if (existsSync(path.join(project_path, 'package-lock.json'))) {
    return 'npm'
  }

  return 'pnpm'
}

/**
 * 创建完成后告诉用户怎么跑起来，命令按模板的 package.json 生成
 * @param {string} project_path 项目目录
 * @param {string} project_name 项目名称
 */
function printNextSteps(project_path, project_name) {
  let package_config = {}

  try {
    package_config = readJsonSync(path.join(project_path, 'package.json'))
  } catch {
    package_config = {}
  }

  const scripts = Object.keys(package_config.scripts ?? {})
  const dependencies = Object.keys(package_config.dependencies ?? {})
  const dev_dependencies = Object.keys(package_config.devDependencies ?? {})
  const package_manager = detectPackageManager(project_path)
  const start = scripts.includes('dev') ? 'dev' : scripts[0]

  console.log('\n下一步：')
  console.log(`  cd ${project_name}`)

  if (dependencies.length > 0 || dev_dependencies.length > 0) {
    console.log(`  ${package_manager} install`)
  }

  if (start) {
    console.log(`  ${package_manager} run ${start}`)
  } else if (existsSync(path.join(project_path, 'index.html'))) {
    console.log('  用浏览器打开 index.html')
  }

  console.log('')
}

/**
 * 创建项目：下载模板并报告结果
 * @param {object} answers 项目名称与构建工具
 * @param {string} type 命令类型，同时是模板的一级目录名
 * @returns {Promise<'created' | 'exists' | 'failed'>} 创建结果，供调用方决定退出码
 */
export async function handler(answers, type) {
  const name = answers.name.trim()
  const build_type = answers.build_type

  if (existsSync(path.resolve(process.cwd(), name))) {
    ora().warn(`${name} 文件夹已经存在`)
    return 'exists'
  }

  // 整个创建过程只留这一个 spinner：download 内部不再自带，两个 spinner 并发会互相覆盖输出
  const spinner = ora(`正在创建项目：${name}`).start()

  let project_path
  try {
    // 下载文件
    project_path = await download(name, [type, build_type])
  } catch (error) {
    // 失败时必须停掉 spinner，否则它会让进程一直不退出
    spinner.fail('创建失败：无法获取模板')
    console.error(`  ${error.message}`)
    console.error('  请检查网络连接后重试')
    return 'failed'
  }

  // degit 遇到不存在的模板目录不报错，只会留下一个空目录
  if (readdirSync(project_path).length === 0) {
    rmSync(project_path, { recursive: true, force: true })
    spinner.fail(`创建失败：模板不存在（${type}/${build_type}）`)
    return 'failed'
  }

  spinner.succeed(`创建成功：${name}`)
  printNextSteps(project_path, name)

  return 'created'
}

/**
 * 生成一个命令的交互提示：先问项目名称，再问构建工具/框架
 * @param {object} command 命令配置，见同目录下的 inquirer.*.js
 * @param {string} command.type 命令类型，透传给 handler
 * @param {string} command.message 第二问的提示文案
 * @param {Array<string>} command.choices 第二问的选项
 * @param {object} [command.buildTypes] 选项到模板目录名的映射，默认与选项同名
 */
export function createPrompt({ type, message, choices, buildTypes = {} }) {
  return async function (argv) {
    const preset_build = argv.build

    if (preset_build && !choices.includes(preset_build)) {
      console.error(`不支持的选项：${preset_build}（可选：${choices.join(' / ')}）`)
      return 'invalid'
    }

    let name = argv.name?.trim()
    let build_type = preset_build

    // -y 时全部用默认值，不再交互
    if (!argv.yes) {
      const questions = []

      if (!name) {
        questions.push({
          type: 'input',
          name: 'name',
          message: '项目名称',
          default: 'my-app',
          validate: validateName,
        })
      }

      // 只有一个选项时没必要问
      if (!build_type && choices.length > 1) {
        questions.push({
          type: 'list',
          name: 'build_type',
          message,
          choices,
          theme: LIST_THEME,
        })
      }

      if (questions.length > 0) {
        const answers = await inquirer.prompt(questions)
        name = answers.name ?? name
        build_type = answers.build_type ?? build_type
      }
    }

    name = (name ?? '').trim() || 'my-app'
    build_type = build_type ?? choices[0]

    // 非交互（-y 或直接传参）时也要拦住非法项目名
    const invalid = validateName(name)
    if (invalid !== true) {
      console.error(invalid)
      return 'invalid'
    }

    return handler({
      name,
      // 选项名与模板目录名不一致时（如 Vue组件 对应 vue-comp）在此转换
      build_type: buildTypes[build_type] ?? build_type,
    }, type)
  }
}
