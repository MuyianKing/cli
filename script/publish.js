import process from 'node:process'
import fsExtra from 'fs-extra'
import { copy, getObjectFromJson } from './utils/file.js'
import { exec, getParams } from './utils/tools.js'

const root = process.cwd()

// 读取版本
function getVersion() {
  // 先从控制台读取
  const { v } = getParams()
  if (v) {
    return {
      version: v,
      from: 'cmd',
    }
  }

  // 没有再从package.json读取
  const package_path = `${root}/package.json`
  const _config = getObjectFromJson(package_path)
  return {
    version: _config.version,
    from: 'package',
  }
}

/**
 * 覆写版本号
 * @param {string} package_path 重写的package.json路径
 * @param {string} version 版本号
 */
function reWriteVersion(package_path, version) {
  const _config = getObjectFromJson(package_path)
  _config.version = version
  const fileStr = JSON.stringify(_config, '', '\t')
  fsExtra.outputFile(
    package_path,
    fileStr,
    'utf-8',
  )
}

// 发布入口
async function main() {
  // 将README.md拷贝到包中
  await copy('./README.md', `${root}/core/README.md`)

  // 将LICENSE拷贝到包中
  await copy('./LICENSE', `${root}/core/LICENSE`)

  // 修改package.json版本号
  const { version, from } = getVersion()

  // 从命令行读取的版本需要回写package.json
  if (from !== 'package') {
    reWriteVersion(`${root}/package.json`, version)
  }

  // 回写core的package.json
  reWriteVersion(`${root}/core/package.json`, version)

  // 生成changelog.md
  await exec('pnpm log')

  const _version = `v${version}`

  // git commit
  await exec('git add .')
  await exec(`git commit -m"release: :package: ${_version}"`)

  // git提交并生成版本tag
  await exec(`git push && git tag ${_version} && git push origin ${_version}`)
}

main()
