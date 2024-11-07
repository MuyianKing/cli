#!/usr/bin/env node

const yargs = require('yargs')
const { inquirerPrompt } = require('./command/inquirer')
const { inquirerHtmlPrompt } = require('./command/inquirer.html')
const { inquirerProjectPrompt } = require('./command/inquirer.project')

// 无操作提示
inquirerPrompt()

yargs.command(['create', 'c'], '新建一个项目', (argv) => {
  inquirerProjectPrompt(argv)
})

yargs.command(['html'], '新建一个普通项目', (argv) => {
  inquirerHtmlPrompt(argv)
})
