import { copyFile, readFileSync } from 'node:fs'

/**
 * 将json文件读取为对象
 * @param {string} path 文件路径
 * @returns
 */
export function getObjectFromJson(path) {
  const data = readFileSync(path)
  return JSON.parse(data)
}

/**
 * 拷贝文件
 * @param {string} src 源文件
 * @param {string} dest 目标文件
 * @returns
 */
export function copy(src, dest) {
  return new Promise((resolve, reject) => {
    copyFile(src, dest, (e) => {
      if (e) {
        reject(e)
      } else {
        resolve('success')
      }
    })
  })
}
