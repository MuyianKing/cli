import { BASE_URL } from '@app'
import { download, getBlobFromUrl } from '@hl/utils'

/**
 * 获取文件预览地址
 * @param {string} path 文件路径
 * @param {string} prefix 前缀
 * @returns {string} url
 */
export function previewFileUrl(path, prefix = '') {
  if (!hl.common.isTruth(path)) {
    return ''
  }

  // blob的地址
  if (path.startsWith('blob')) {
    return path
  }

  const user = useUserStore()
  const token = user.token

  if (!path.startsWith('http')) {
    path = `${BASE_URL}${prefix.startsWith('/') ? '' : '/'}${prefix || 'preview'}${path.startsWith('/') ? path : `/${path}`}`
  }

  path = path + (path.includes('?') ? `&token=${token}` : `?token=${token}`)
  return path
}

// 根据ID下载文件
export async function downloadFile(file, name) {
  const blob = await getBlobFromUrl(previewFileUrl(file.path, file.prefix))
  download(URL.createObjectURL(blob), name || file.name)
}
