import path from 'node:path'
import process from 'node:process'
import downloadGitRepo from 'download-git-repo'
import { removeSync } from 'fs-extra/esm'
import ora from 'ora'
import { copyDir } from '/copy.js'

const url = 'direct:https://github.com/MuyianKing/template/archive/refs/heads/main.zip'

function download(url, save_path, options = {}) {
  return new Promise((resolve, reject) => {
    downloadGitRepo(url, save_path, options, (err) => {
      if (!err) {
        resolve('success')
      } else {
        reject(err)
      }
    })
  })
}

export default async function (project_name, build_type) {
  const spinner = ora(`downloading`).start()

  const temp_path = path.join(process.cwd(), project_name)
  await download(url, temp_path, {
    filter: (file) => {
      return file.path.includes(build_type.join('\\'))
    },
  })

  spinner.succeed('downloaded successfully')

  // 拷贝文件
  copyDir(
    `${temp_path}/${build_type.join('/')}`,
    temp_path,
  )

  // 删除文件
  removeSync(`${temp_path}/${build_type[0]}`)

  return temp_path
}
