import { generateApis } from '@hl/utils'
import { globImport } from '@utils/build'

/**
 * 生成所有的请求路径
 */
function generate() {
  // 引入api文件
  const context = import.meta.webpackContext('./apis', {
    // 是否搜索子目录
    recursive: false,
    regExp: /\.js$/,
  })

  const api = generateApis(globImport(context))
  return api
}

export default generate()
