import { resolve } from 'node:path'

const alias_path = [
  ['@', './src'],
  ['@api', './src/api'],
  ['@comp', './src/components'],
  ['@def', './src/default'],
  ['@server', './src/server'],
  ['@model', './src/model'],
  ['@views', './src/views'],
  ['@hooks', './src/hooks'],
  ['@img', './src/assets/img'],
  ['@pinia', './src/pinia/modules'],
  ['@style', './src/assets/style'],
  ['@layout', './src/layout'],
  ['@directions', './src/directions'],
  ['@tyyh', '@hl/tyyh'],
  ['@app', './src/utils/app'],
  ['@http', './src/utils/request'],
  ['@utils', './src/utils'],
]

export default function useAlias() {
  // 处理成vite需要的格式
  const alias_map = {}
  alias_path.forEach((item) => {
    alias_map[item[0]] = item[1].startsWith('@') ? item[1] : resolve(__dirname, item[1].replace('./', ''))
  })

  return {
    alias_map,
    alias_path,
  }
}
