import process from 'node:process'
import { figlet } from 'figlet'
import ora from 'ora'

figlet('Hello World!!', (err, data) => {
  if (err) {
    console.log('Something went wrong...')
    console.dir(err)
    return
  }
  console.log(data)
})

export default function () {
  const cmd = ['web', 'h5', 'html', 'lib']

  const spinner = ora().start()

  if (process.argv.length === 2) {
    spinner.fail(`缺少执行命令：mu <command>`)
  } else if (process.argv.length === 3 && !cmd.includes(process.argv[2])) {
    spinner.fail(`找不到命令：mu <command>`)
  } else {
    spinner.stop()
    return
  }

  spinner.succeed(`Usage:
    
    mu web   创建一个web项目
    mu h5    创建一个h5项目
    mu lib   创建一个Lib项目
    mu html  创建普通项目（没有打包工具）
        `)

  spinner.stop()
}
