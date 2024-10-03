const inquirer = require('inquirer');

function inquirerPrompt(argv) {
  const { name } = argv;
  return new Promise((resolve, reject) => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '项目名称',
        default: name,
        validate: function (val) {
          if (!val) {
            return "请输入项目名称：";
          }
          return true;
        },
      },
      {
        type: 'list',
        name: 'build_type',
        message: '构建工具',
        choices: ['rsbuild', 'vite'],
        filter: function (value) {
          return {
            'rsbuild': "rsbuild",
            'vite': "vite",
          }[value];
        },
      },
    ]).then(answers => {
      resolve(answers)
    }).catch(error => {
      reject(error)
    })
  })

}

exports.inquirerPrompt = inquirerPrompt;
