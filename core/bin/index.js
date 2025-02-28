#!/usr/bin/env node

import process from 'node:process'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import inquirerH5Prompt from './command/inquirer.h5.js'
import inquirerHtmlPrompt from './command/inquirer.html.js'
import inquirerPrompt from './command/inquirer.js'
import inquirerLibPrompt from './command/inquirer.lib.js'
import inquirerWebPrompt from './command/inquirer.web.js'

// 无操作提示
inquirerPrompt().then(() => {
  yargs(hideBin(process.argv))
    .command('web', '新建一个WEB项目', (argv) => {
      inquirerWebPrompt(argv)
    })
    .command('h5', '新建一个H5项目', (argv) => {
      inquirerH5Prompt(argv)
    })
    .command(['lib'], '新建一个Lib项目', (argv) => {
      inquirerLibPrompt(argv)
    })
    .command(['html'], '新建一个HTML项目', (argv) => {
      inquirerHtmlPrompt(argv)
    })
    .argv

})

