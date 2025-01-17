import { existsSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import ora from 'ora'
import download from '../utils/download.js'

export async function handler(answers, type) {
  const { name, build_type } = answers
  const isMkdirExists = existsSync(path.resolve(process.cwd(), `./${name}`))

  const spinner = ora().start()

  if (isMkdirExists) {
    spinner.warning(`${name}文件夹已经存在`)
  } else {
    const _path = [type, build_type]

    // 下载文件
    await download(name, _path)

    spinner.succeed(`created successfully`)
  }
}
