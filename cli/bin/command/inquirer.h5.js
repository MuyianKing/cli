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
    ]).then((answers) => {
      resolve(answers)
    }).catch((error) => {
      reject(error)
    })
  })
}

exports.inquirerH5Prompt = function (argv) {
  inquirerPrompt(argv).then((answers) => {
    const { name, build_type } = answers
    const isMkdirExists = checkMkdirExists(
      path.resolve(process.cwd(), `./${name}`),
    )

    if (isMkdirExists) {
      console.log(`${name}文件夹已经存在`)
    } else {
      console.log('__dirname', __dirname)

      copyDir(
        path.resolve(__dirname, `../../template/h5/${build_type}`),
        path.resolve(process.cwd(), `./${name}`),
      )

      console.log('\x1B[32m%s\x1B[0m', `cd ./${name}`)
    }
  })
}
