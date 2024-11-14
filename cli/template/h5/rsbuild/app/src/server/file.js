import { post } from '@utils/request'

/**
 *上传
 * @param {FormData} data
 * @param {object} params
 */
function apiUpload(data, params = {}) {
  if (!data) {
    return Promise.reject(new Error('文件不合法'))
  }

  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: params.timeout || (24 * 3600 * 1000),
  }

  // 上传进度配置
  if (params.onProgress && typeof params.onProgress === 'function') {
    config.onUploadProgress = params.onProgress
  }

  return post(params.url || hl.api.upload, data, config)
}

/**
 * 上传文件
 * @param {File|Array} files File类型的数组或File对象
 * @returns Array
 */
export async function uploadFile(files, params = {}) {
  // 一个文件转成统一的数组
  if (files instanceof File) {
    files = [files]
  }

  // 文件格式错误
  if (!(Array.isArray(files))) {
    throw new TypeError('上传文件格式错误222')
  }

  // 没有文件
  if (files.length === 0) {
    return []
  }

  // 批量保存文件
  const data = new FormData()
  for (const item of files) {
    data.append('file', item)
  }

  const result = await apiUpload(data, params)

  return result.data.map((item) => {
    return {
      id: item.id,
      name: item.org_name || item.name,
      path: item.path,
    }
  })
}

/**
 * 上传
 * @param {Array<FileObject>|FileObject} medias
 *
 * FileObject:{
 *  file：如果是File类型表示需要重新上传，如果是字符串或数字表示不需要上传
 * }
 * @returns Array
 */
export async function uploadObject(medias, params = {}) {
  if (!(Array.isArray(medias))) {
    medias = [medias.file]
  } else {
    medias = medias.map(media => media.file)
  }

  // 需要上传的文件
  const files = medias.filter(item => item instanceof File)

  // 上传
  const new_ids = await uploadFile(files, params).catch((e) => {
    throw e
  })

  if (new_ids.length === 0) {
    return []
  }

  // 不需要上传的文件
  const ids = medias.filter(item => !(item instanceof File))

  return new_ids.concat(ids)
}
