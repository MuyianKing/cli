#!/usr/bin/env node

const yargs = require('yargs')
const { inquirerPrompt } = require('./command/inquirer')
const { inquirerH5Prompt } = require('./command/inquirer.h5')
const { inquirerHtmlPrompt } = require('./command/inquirer.html')
const { inquirerWebPrompt } = require('./command/inquirer.web')

// 无操作提示
inquirerPrompt()

yargs.command('web', '新建一个项目', (argv) => {
  inquirerWebPrompt(argv)
}).command('h5', '新建一个项目', (argv) => {
  inquirerH5Prompt(argv)
}).command(['html'], '新建一个普通项目', (argv) => {
  inquirerHtmlPrompt(argv)
}).argv
