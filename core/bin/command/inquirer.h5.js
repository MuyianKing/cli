import inquirer from 'inquirer'
import { handler } from './inquirer.utils.js'

function inquirerPrompt(argv) {
  const { name } = argv
  return inquirer.prompt([
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
      message: '构建工具',
      choices: ['rsbuild', 'vite'],
      filter(value) {
        return {
          rsbuild: 'rsbuild',
          vite: 'vite',
        }[value]
      },
    },
  ])
}

export default function (argv) {
  inquirerPrompt(argv).then(async (answers) => {
    handler(answers, 'h5')
  })
}
