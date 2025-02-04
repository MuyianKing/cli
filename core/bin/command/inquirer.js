import process from 'node:process'
import ora from 'ora'

export default function () {
  const cmd = ['web', 'h5', 'html', 'lib']

  const spinner = ora().start()

  if ((process.argv.length === 3 && cmd.includes(process.argv[2])) || process.argv[2]?.includes('help')) {
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
