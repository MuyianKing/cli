import { download } from '@hl/utils'
import { BASE_URL } from './app'

/**
 * 获取文件预览地址
 * @param {string} path 文件路径
 * @param {*} prefix = ''
 * @returns {string} url
 */
export function previewFileUrl(path, prefix = '') {
  if (!hl.common.isTruth(path)) {
    return ''
  }

  if (path.startsWith('blob')) {
    return path
  }

  const user = useUserStore()
  const token = user.token

  if (!path.startsWith('http')) {
    path = `${BASE_URL}${prefix.startsWith('/') ? '' : '/'}${prefix || 'preview'}${path.startsWith('/') ? path : `/${path}`}`
  }

  path = path + (path.includes('?') ? `&token=${token}&behind=token` : `?token=${token}&behind=token`)

  return path
}

// 下载文件
export async function downloadFile(file, name) {
  download(previewFileUrl(file.path), name || file.name)
}
