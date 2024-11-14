/**
 * 导入模块
 * @param {object} context 打包根据的导入上下文
 */
export function globImport(context) {
  const globModules = {}
  for (const path of context.keys()) {
    globModules[path] = context(path)
  }
  return globModules
}
