import path from 'node:path'
import process from 'node:process'
import inquirer from 'inquirer'
import ora from 'ora'
import { checkMkdirExists } from '../utils/copy.js'
import download from '../utils/download.js'

function inquirerPrompt(argv) {
  const { name } = argv
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '项目名称',
        default: name,
        validate(val) {
          if (!val) {
            return '请输入项目名称：'
          }
          return true
        },
      },
      {
        type: 'list',
        name: 'build_type',
        message: '组件类型',
        choices: ['Vue组件'],
        filter(value) {
          return {
            Vue组件: 'vue-comp',
          }[value]
        },
      },
    ]).then((answers) => {
      resolve(answers)
    }).catch((error) => {
      reject(error)
    })
  })
}

export default function (argv) {
  inquirerPrompt(argv).then(async (answers) => {
    const { name, build_type } = answers
    const isMkdirExists = checkMkdirExists(
      path.resolve(process.cwd(), `./${name}`),
    )

    const spinner = ora().start()

    if (isMkdirExists) {
      spinner.warning(`${name}文件夹已经存在`)
    } else {
      const _path = ['lib', build_type]

      // 下载文件
      await download(name, _path)

      spinner.succeed(`created successfully`)
    }
  })
}
