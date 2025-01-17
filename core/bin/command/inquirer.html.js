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
      message: '框架',
      choices: ['vue'],
      filter(value) {
        return {
          vue: 'vue',
        }[value]
      },
    },
  ])
}

export default function (argv) {
  inquirerPrompt(argv).then(async (answers) => {
    handler(answers, 'html')
  })
}
