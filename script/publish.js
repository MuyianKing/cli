import process from 'node:process'
import { exec } from '@muyianking/build'
import { copySync } from 'fs-extra/esm'
import { getVersion, reWriteVersion } from './utils'

const root = process.cwd()

// 发布入口
async function main() {
  // 将README.md拷贝到包中
  copySync('./README.md', `${root}/core/README.md`)

  // 将LICENSE拷贝到包中
  copySync('./LICENSE', `${root}/core/LICENSE`)

  // 读取版本号
  const { version, from } = getVersion(`${root}/package.json`)

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
