import http from '@http'

/**
 * 上传文件
 * @param {File|Array} files File类型的数组或File对象
 */
export async function uploadFile(files, params = {}) {
  // 一个文件转成统一的数组
  if (files instanceof File) {
    files = [files]
  }

  // 文件格式错误
  if (!(Array.isArray(files))) {
    throw new TypeError('上传文件格式错误')
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

  const result = await upload(data, params)
  return result.data
}

/**
 *上传
 * @param {FormData} data
 * @param {object} params
 */
function upload(data, params = {}) {
  if (!data) {
    return Promise.reject(new Error('上传文件为空'))
  }

  const config = {
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: params.timeout || (24 * 3600 * 1000),
  }

  // 上传进度配置
  if (params.onProgress && typeof params.onProgress === 'function') {
    config.onUploadProgress = params.onProgress
  }

  return http.instance.post(params.url || hl.api.upload, data, config)
}

/**
 * 上传
 * @param {Array | object} medias
 *
 * Object{
 *  file：如果是File类型表示需要重新上传，如果是字符串或数字表示不需要上传
 * }
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
  const new_ids = await uploadFile(files, params)

  if (new_ids.length === 0) {
    return []
  }

  // 不需要上传的文件
  const ids = medias.filter(item => !(item instanceof File))
  return new_ids.concat(ids)
}
