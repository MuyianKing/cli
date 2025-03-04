import { getParams } from '@muyianking/build'
import { readJsonSync, writeJsonSync } from 'fs-extra/esm'

/**
 * 覆写版本号
 * @param {string} package_path 重写的package.json路径
 * @param {string} version 版本号
 */
export function reWriteVersion(package_path, version) {
  const _config = readJsonSync(package_path)
  _config.version = version

  writeJsonSync(package_path, _config, {
    spaces: 2,
  })
}

// 读取版本
export function getVersion(package_path) {
  // 先从控制台读取
  const { v } = getParams()
  if (v) {
    return {
      version: v,
      from: 'cmd',
    }
  }

  // 从package.json读
  const _config = readJsonSync(package_path)

  return {
    version: _config.version,
    from: 'package',
  }
}
