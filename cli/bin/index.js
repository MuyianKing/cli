#!/usr/bin/env node

const yargs = require('yargs');
const path = require('path');
const { inquirerPrompt } = require("./inquirer");
const { copyDir, checkMkdirExists } = require("./copy");

yargs.command(
  ['create', 'c'],
  '新建一个模板',
  function (argv) {
    inquirerPrompt(argv).then(answers => {
      const { name, build_type } = answers;
      const isMkdirExists = checkMkdirExists(
        path.resolve(process.cwd(),`./${name}`)
      );

      if (isMkdirExists) {
        console.log(`${name}文件夹已经存在`)
      } else {
        copyDir(
          path.resolve(__dirname, `../template/${build_type}`),
          path.resolve(process.cwd(), `./${name}`)
        )
      }
    })
  }
).argv;
