import process from 'node:process'
import ora from 'ora'

export default function () {
  const cmd = ['web', 'h5', 'html']

  const spinner = ora().start()

  if (process.argv.length === 2) {
    spinner.fail(`缺少执行命令：mu <command>`)
  } else if (process.argv.length === 3 && !cmd.includes(process.argv[2])) {
    spinner.fail(`找不到命令：mu <command>`)
  } else {
    return
  }

  spinner.succeed(`Usage:
    
  mu web  创建一个web项目
  mu h5  创建一个h5项目
  mu html      创建普通项目（没有打包工具）
      `)
}
