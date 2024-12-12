import child_process from 'node:child_process'
import process from 'node:process'

// 获取参数
export function getParams() {
  const params = {}
  process.argv.forEach((item) => {
    item = item.split('=')

    if (item.length === 2) {
      params[item[0]] = item[1]
    }
  })

  return params
}

/**
 * 执行指定命令
 * @param {string} cmd 命令
 * @returns
 */
export function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error) => {
      error ? reject(error) : resolve('success')
    })
  })
}
