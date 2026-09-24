import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { exec } from '@muyianking/build'
import { readJsonSync } from 'fs-extra/esm'

const package_path = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../package.json')

/**
 * 当前安装的版本
 */
export function getLocalVersion() {
  return readJsonSync(package_path).version
}

/**
 * 查询最新版本，查不到（离线、私有源等）返回 null
 */
export async function getLatestVersion() {
  try {
    return (await exec('npm view @muyianking/cli version')).trim()
  } catch {
    return null
  }
}
