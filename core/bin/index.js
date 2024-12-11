#!/usr/bin/env node

import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import inquirerH5Prompt from './command/inquirer.h5.js'
import inquirerHtmlPrompt from './command/inquirer.html.js'
import inquirerPrompt from './command/inquirer.js'
import inquirerWebPrompt from './command/inquirer.web.js'

// // 无操作提示
inquirerPrompt()

yargs(hideBin(process.argv)).command('web', '新建一个项目', (argv) => {
  inquirerWebPrompt(argv)
}).command('h5', '新建一个项目', (argv) => {
  inquirerH5Prompt(argv)
}).command(['html'], '新建一个普通项目', (argv) => {
  inquirerHtmlPrompt(argv)
}).argv
