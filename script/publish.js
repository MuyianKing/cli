import child_process from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fsExtra from 'fs-extra'
import getObjectFromJson from './utils/getObjectFromJson.js'

const __dirname = fileURLToPath(import.meta.url)

// 读取版本
function getVersion() {
  const package_path = path.resolve(__dirname, `../../cli/package.json`)
  const _config = getObjectFromJson(package_path)
  return _config.version
}

function publish() {
  // 将README.md拷贝到包中
  fs.copyFile('./README.md', '../cli/cli/README.md', (error) => {
    console.log(error)
  })

  // 修改package.json版本号
  const _path = `../../package.json`
  const package_path = path.resolve(__dirname, _path)
  const _config = getObjectFromJson(package_path)
  _config.version = getVersion()

  const fileStr = JSON.stringify(_config, '', '\t')
  fsExtra.outputFile(
    package_path,
    fileStr,
    'utf-8',
  )

  // 生成changelog.md
  child_process.exec('pnpm log', (error) => {
    if (!error) {
      // 成功
      child_process.exec('git add .', () => {
        const version = `v${_config.version}`

        child_process.exec(`git commit -m"release: :package: ${version}"`, () => {
          child_process.exec(`git push && git tag ${version} && git push origin ${version}`, () => {
            console.log('\x1B[32m%s\x1B[0m', 'publish success')
          })
        })
      })
    } else {
      console.log('生成changelog.md失败', error)
    }
  })
}

publish()
