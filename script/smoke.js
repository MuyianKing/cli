import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const core = path.join(root, 'core')

// 放在 core 下，副本才能复用 core/node_modules 里的依赖；
// test-temp-* 已被 .gitignore 和 core/.npmignore 忽略
const fake_package = path.join(core, 'test-temp-smoke')
const fake_cli = path.join(fake_package, 'bin/index.js')
const work = path.join(os.tmpdir(), `mu-smoke-${Date.now()}`)

// 命令里能选到的模板路径，必须和 inquirer.*.js 里的选项保持一致
const template_paths = [
  ['web', 'rsbuild'],
  ['web', 'vite'],
  ['h5', 'rsbuild'],
  ['lib', 'vue-comp'],
  ['html', 'vue'],
  // TODO: 模板仓库里还没有 h5/vite 目录，补上后取消注释
  // ['h5', 'vite'],
]

const failures = []

function check(message, ok) {
  console.log(`  ${ok ? '✔' : '✖'} ${message}`)
  if (!ok) {
    failures.push(message)
  }
}

function runCli(args) {
  const result = spawnSync(process.execPath, [fake_cli, ...args], { encoding: 'utf8', cwd: work })
  return { status: result.status, output: `${result.stdout}${result.stderr}` }
}

// 准备一份版本号必然与 npm 上不一致的副本，用来验证版本提示
function prepareFakePackage() {
  rmSync(fake_package, { recursive: true, force: true })
  cpSync(path.join(core, 'bin'), path.join(fake_package, 'bin'), { recursive: true })
  writeFileSync(
    path.join(fake_package, 'package.json'),
    JSON.stringify({ name: '@muyianking/cli', type: 'module', version: '0.0.0-smoke' }, null, 2),
  )
}

// 1. 每个模板都要能真实下载到文件
async function checkDownload() {
  const { default: download } = await import('../core/bin/utils/download.js')

  for (const build_type of template_paths) {
    const name = `smoke-${build_type.join('-')}`
    let ok = false
    try {
      await download(name, build_type)
      ok = readdirSync(path.join(work, name)).length > 0
    } catch (error) {
      console.log(`    下载 ${build_type.join('/')} 失败：${error.message}`)
    }
    check(`下载模板 ${build_type.join('/')}`, ok)
  }
}

// 2. 目录已存在只提示；模板目录不存在时必须报错，而不是留下空目录
async function checkHandler() {
  const { handler } = await import('../core/bin/command/inquirer.utils.js')
  const [type, build_type] = template_paths[0]
  const name = `smoke-${template_paths[0].join('-')}`

  try {
    check('目录已存在时返回 exists', (await handler({ name, build_type }, type)) === 'exists')
  } catch (error) {
    console.log(`    抛出异常：${error.message}`)
    check('目录已存在时返回 exists', false)
  }

  const missing = 'smoke-missing-template'
  try {
    // degit 对不存在的模板目录不会报错，必须由 handler 兜住
    check('模板不存在时返回 failed', (await handler({ name: missing, build_type: '__nonexistent__' }, 'web')) === 'failed')
    check('模板不存在时不留空目录', !existsSync(path.join(work, missing)))
  } catch (error) {
    console.log(`    抛出异常：${error.message}`)
    check('模板不存在时返回 failed', false)
  }
}

// 3. 命令行界面：帮助、未知命令、非法选项的退出码
function checkInterface() {
  const help = runCli(['help'])
  check('mu help 退出码为 0', help.status === 0)
  check('mu help 输出用法', help.output.includes('用法'))

  check('mu 无参数退出码为 0', runCli([]).status === 0)

  const unknown = runCli(['foo'])
  check('mu foo 退出码为 1', unknown.status === 1)
  check('mu foo 提示未知命令', unknown.output.includes('未知命令'))

  const bad_build = runCli(['html', 'smoke-bad-build', '--build', 'bogus', '-y'])
  check('非法 --build 退出码为 1', bad_build.status === 1)
  check('非法 --build 给出提示', bad_build.output.includes('不支持的选项'))
}

// 4. 版本不一致时只提示，不崩栈、不阻断
function checkVersion() {
  const { status, output } = runCli(['version'])
  check('mu version 退出码为 0', status === 0)
  check('mu version 输出版本号', output.includes('v0.0.0-smoke'))
  check('mu version 没有抛异常', !output.includes('TypeError'))
  check('版本不一致时提示升级', output.includes('发现新版本') || output.includes('无法获取最新版本'))
}

// 5. 端到端：非交互创建（覆盖 index.js -> yargs -> createPrompt -> handler -> download）
function checkEndToEnd() {
  const with_yes = runCli(['html', 'smoke-e2e-yes', '-y'])
  check('mu html -y 退出码为 0', with_yes.status === 0)
  check('mu html -y 生成项目文件', existsSync(path.join(work, 'smoke-e2e-yes/index.html')))
  check('mu html -y 打印下一步', with_yes.output.includes('下一步'))

  const with_build = runCli(['web', 'smoke-e2e-build', '-b', 'vite', '-y'])
  check('mu web -b vite -y 退出码为 0', with_build.status === 0)
  check('mu web -b vite -y 生成项目文件', existsSync(path.join(work, 'smoke-e2e-build/package.json')))

  // 版本号不一致也要能正常创建，不能被版本检查拦住
  check('版本不一致不阻断创建', with_yes.status === 0 && with_build.status === 0)
}

async function main() {
  try {
    mkdirSync(work, { recursive: true })
    process.chdir(work)
    prepareFakePackage()

    console.log('1/5 下载模板')
    await checkDownload()

    console.log('2/5 目录已存在 / 模板不存在')
    await checkHandler()

    console.log('3/5 命令行界面')
    checkInterface()

    console.log('4/5 版本校验')
    checkVersion()

    console.log('5/5 端到端创建')
    checkEndToEnd()
  } finally {
    // Windows 下不能删除进程的当前目录，先切回去
    process.chdir(root)
    try {
      rmSync(fake_package, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
      rmSync(work, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 })
    } catch (error) {
      // 清理失败不该让测试结果失真，残留目录已被 git/npm 忽略
      console.warn(`清理临时目录失败：${error.message}`)
    }
  }

  if (failures.length > 0) {
    console.error(`\n冒烟测试失败 ${failures.length} 项：`)
    failures.forEach(failure => console.error(`  - ${failure}`))
    process.exit(1)
  }

  console.log('\n冒烟测试全部通过')
}

main()
