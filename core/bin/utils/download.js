import path from 'node:path'
import process from 'node:process'
import ora from 'ora'
import { exec } from "@muyianking/build"

/**
 * 从github仓库下载代码
 * @param {string} url 仓库地址
 * @param {string} save_path 保存路径
 */
async function download(url, save_path) {
  await exec(`degit ${url} ${save_path}`)
}

// 模板代码仓库地址：仓库必须是public
const GITHUB_TEMPLATE_URL = 'https://github.com/MuyianKing/template.git/'

/**
 * 下载指定项目类型的代码
 * @param {string} project_name 项目名称：会以此名称创建项目目录
 * @param {Array} build_type 项目类型:['web','rsbuild']
 */
export default async function (project_name, build_type) {
  const spinner = ora(`downloading`).start()

  const temp_path = path.join(process.cwd(), project_name)

  await download(GITHUB_TEMPLATE_URL + build_type.join("/"), temp_path, {
    // 过滤指定的代码
    filter(file) {
      return file.path.includes(build_type.join('\\'))
    },
  })

  spinner.succeed('downloaded successfully')
  return temp_path
}