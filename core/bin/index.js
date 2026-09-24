#!/usr/bin/env node

import process from 'node:process'
import ora from 'ora'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import h5 from './command/inquirer.h5.js'
import html from './command/inquirer.html.js'
import lib from './command/inquirer.lib.js'
import web from './command/inquirer.web.js'
import { printHelp } from './utils/help.js'
import { getLatestVersion, getLocalVersion } from './utils/version.js'

const commands = [web, h5, lib, html]

const VERSION_ARGS = ['v', 'version', '-v', '--version']
const UPGRADE_HINT = 'npm i -g @muyianking/cli'

// 各命令的异步异常不会被捕获，这里统一兜底，避免直接抛堆栈
process.on('unhandledRejection', (error) => {
  console.error(error?.message ?? error)
  process.exit(1)
})

// 版本检查只是提示，取不到或不是最新都不影响继续使用
async function checkVersion() {
  const spinner = ora('正在检查版本...').start()
  const latest = await getLatestVersion()

  if (latest === null) {
    spinner.stop()
    return
  }

  const current = getLocalVersion()

  if (latest === current) {
    spinner.stop()
    return
  }

  spinner.warn(`发现新版本 ${latest}（当前 ${current}），升级：${UPGRADE_HINT}`)
}

// mu version / -v
async function printVersion() {
  const current = getLocalVersion()

  console.log(`v${current}`)

  const spinner = ora('正在检查最新版本...').start()
  const latest = await getLatestVersion()

  if (latest === null) {
    spinner.warn('无法获取最新版本（离线或私有源）')
  } else if (latest === current) {
    spinner.succeed('已是最新版本')
  } else {
    spinner.warn(`发现新版本 ${latest}，升级：${UPGRADE_HINT}`)
  }
}

async function runCommand(command, argv) {
  // 按需加载：inquirer / degit 只在真正创建项目时才需要，
  // 帮助和版本命令不该为它们付出启动时间
  const { createPrompt } = await import('./command/inquirer.utils.js')
  const result = await createPrompt(command)(argv)

  // 只有真正创建成功才算成功，方便脚本判断
  if (result !== 'created') {
    process.exitCode = 1
  }
}

async function main() {
  const args = hideBin(process.argv)
  const input = args[0]

  // 帮助：无参数、help、-h、--help（写在命令后面也认）
  if (!input || input === 'help' || args.includes('-h') || args.includes('--help')) {
    printHelp(commands)
    return
  }

  if (VERSION_ARGS.includes(input)) {
    await printVersion()
    return
  }

  if (!commands.some(command => command.type === input)) {
    console.error(`未知命令：${input}`)
    console.error(`可用命令：${commands.map(command => command.type).join(' / ')} / help / version`)
    console.error('执行 mu help 查看完整帮助')
    process.exitCode = 1
    return
  }

  // 只有真正要创建项目时才联网检查版本
  await checkVersion()

  const cli = yargs(args)
    .help(false)
    .version(false)
    .strict()
    .fail((msg, error) => {
      console.error(msg ?? error?.message)
      console.error('执行 mu help 查看可用参数')
      process.exit(1)
    })

  for (const command of commands) {
    cli.command({
      command: `${command.type} [name]`,
      describe: command.describe,
      builder: y => y
        .positional('name', { type: 'string', describe: '项目名称' })
        .option('build', { alias: 'b', type: 'string', describe: command.message })
        .option('yes', { alias: 'y', type: 'boolean', describe: '全部使用默认值' }),
      handler: argv => runCommand(command, argv),
    })
  }

  await cli.parseAsync()
}

main()
