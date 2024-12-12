import fs from 'node:fs'

export function copy(src, dest) {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, (e) => {
      if (e) {
        reject(e)
      } else {
        resolve('success')
      }
    })
  })
}
