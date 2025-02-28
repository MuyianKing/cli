import process from 'node:process'
import { readJsonSync } from 'fs-extra/esm'
import ora from 'ora'
import { exec } from '@muyianking/build'
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const spinner = ora().start()

export default async function () {
  // 版本不为最新停止
  const _V = await handleVersion()
  if (_V === false) {
    return
  }

  const cmd = ['web', 'h5', 'html', 'lib']
  const argv = process.argv

  // 如果输入三个参数并且最后一个参数不在已定义的命令中，或者输入help
  if ((argv.length === 3 && cmd.includes(argv[2])) || argv[2]?.includes('help')) {
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

// 处理版本号
async function handleVersion() {

  // 获取安装版本
  const package_config = readJsonSync(`${__dirname}/../../package.json`)

  const cur_version = package_config.version

  // 获取最新版本
  const last_version = (await exec("npm view @muyianking/cli version")).trim()
  if (last_version !== cur_version) {
    spinner.warn(`最新版本为${last_version}，当前版本为${cur_version}，请先安装最新版本`)
    return false
  }


  return {
    cur_version,
    last_version
  }
}
