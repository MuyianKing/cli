import path from 'node:path'
import process from 'node:process'
import degit from 'degit'

// 模板代码仓库地址：仓库必须是public
const GITHUB_TEMPLATE_URL = 'https://github.com/MuyianKing/template.git/'

/**
 * 下载指定项目类型的代码
 * 只负责下载，进度提示由调用方（handler）的 spinner 统一输出
 * @param {string} project_name 项目名称：会以此名称创建项目目录
 * @param {Array} build_type 项目类型:['web','rsbuild']
 */
export default async function (project_name, build_type) {
  const temp_path = path.join(process.cwd(), project_name)

  // 必须以库的方式调用：degit 的 bin 只会链接到本包自己的 node_modules/.bin 下，不在 PATH 上
  await degit(GITHUB_TEMPLATE_URL + build_type.join('/')).clone(temp_path)

  return temp_path
}
