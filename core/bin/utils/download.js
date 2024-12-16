import path from 'node:path'
import process from 'node:process'
import downloadGitRepo from 'download-git-repo'
import { removeSync } from 'fs-extra/esm'
import ora from 'ora'
import { copyDir } from './copy.js'

/**
 * 从github仓库下载代码
 * @param {string} url 仓库地址
 * @param {string} save_path 保存路径
 * @param {object} options download-git-repo参数
 */
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

// 模板代码仓库地址：仓库必须是public
const GITHUB_TEMPLATE_URL = 'direct:https://github.com/MuyianKing/template/archive/refs/heads/main.zip'

/**
 * 下载指定项目类型的代码
 * @param {string} project_name 项目名称：会以此名称创建项目目录
 * @param {Array} build_type 项目类型:['web','rsbuild']
 */
export default async function (project_name, build_type) {
  const spinner = ora(`downloading`).start()

  const temp_path = path.join(process.cwd(), project_name)
  await download(GITHUB_TEMPLATE_URL, temp_path, {
    // 过滤指定的代码
    filter(file) {
      return file.path.includes(build_type.join('\\'))
    },
  })

  spinner.succeed('downloaded successfully')

  // 将文件拷贝到项目根目录
  copyDir(`${temp_path}/${build_type.join('/')}`, temp_path)

  // 删除源文件
  removeSync(`${temp_path}/${build_type[0]}`)

  return temp_path
}
