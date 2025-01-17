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
      message: '组件类型',
      choices: ['Vue组件'],
      filter(value) {
        return {
          Vue组件: 'vue-comp',
        }[value]
      },
    },
  ])
}

export default function (argv) {
  inquirerPrompt(argv).then(async (answers) => {
    handler(answers, 'lib')
  })
}
