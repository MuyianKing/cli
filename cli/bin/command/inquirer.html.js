const path = require('node:path')
const process = require('node:process')
const inquirer = require('inquirer')
const { copyDir, checkMkdirExists } = require('../copy')

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
    ]).then((answers) => {
      resolve(answers)
    }).catch((error) => {
      reject(error)
    })
  })
}

exports.inquirerHtmlPrompt = function (argv) {
  inquirerPrompt(argv).then((answers) => {
    const { name } = answers
    const isMkdirExists = checkMkdirExists(
      path.resolve(process.cwd(), `./${name}`),
    )

    if (isMkdirExists) {
      console.log(`${name}文件夹已经存在`)
    } else {
      copyDir(
        path.resolve(__dirname, `../../template/html/vue`),
        path.resolve(process.cwd(), `./${name}`),
      )

      console.log('\x1B[32m%s\x1B[0m', `
create successful
cd ./${name} 
pnpm i
live-server
`)
    }
  })
}
