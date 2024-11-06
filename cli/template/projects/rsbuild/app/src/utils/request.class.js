import { isTruth, readBlobAsJSON } from '@hl/utils'

import axios from 'axios'

class RespError extends Error {
  constructor(error) {
    super(error.error)
    this.error = error.error || ''
    this.errno = error.errno || ''
  }
}

export class Http {
  constructor(baseURL, params = {}) {
    this.instance = axios.create()

    /* 默认超时时间 */
    this.instance.defaults.timeout = params.timeout || 60000 * 5

    // 根路径
    this.instance.defaults.baseURL = baseURL

    // 过滤器
    this.interceptors = params.interceptors || {}

    this.setInterceptors()
  }

  setInterceptors() {
    // 添加响应拦截器
    this.instance.interceptors.response.use(async (response) => {
      let data = null

      // 响应类型是blob类型吧却是json，需要转为json
      if (response.data instanceof Blob && response.data.type === 'application/json') {
        data = await readBlobAsJSON(response.data)
      } else {
        data = response.data
      }

      if (typeof this.interceptors.response?.success === 'function') {
        return this.interceptors.response.success(data)
      }

      if (data.errno !== undefined && data.errno !== 200) {
        return Promise.reject(data)
      } else {
        if (response.config.keepHeader) {
          return Promise.resolve({
            data,
            headers: response.headers,
          })
        } else {
          return Promise.resolve(data)
        }
      }
    }, async (error) => {
      if (typeof this.interceptors.response?.error === 'function') {
        return this.interceptors.response.error(error)
      }

      let resp_error = null

      if (error.response && error.response.data) {
        let data = null

        // 响应类型是blob
        if (error.response.data instanceof Blob) {
          data = await readBlobAsJSON(error.response.data)
        } else {
          data = error.response.data
        }

        resp_error = new RespError({
          errno: data.status || data.errno,
          error: data.error,
        })
      } else {
        resp_error = new RespError({
          errno: error?.response?.status || 999,
          error: error?.response?.statusText || error?.message || '程序出错或网络连接失败',
        })
      }

      // 认证失败：直接跳到登录
      if (+resp_error.errno === 401) {
        if (!window.location.href.includes('#/login')) {
          let url = `#/login?msg=${encodeURIComponent(resp_error.error)}`
          const user = useUserStore()
          // 八小时内未操作直接跳到登录不提示登录过期：这里解决的是关闭页面
          if (!user || (Date.now() - user.token_expire > 4 * 60 * 60 * 1000)) {
            url = `#/login`
          }

          window.location.href = url
          setTimeout(() => {
            window.location.reload()
          }, 500)
        }
      }
      return Promise.reject(resp_error)
    })

    // 添加请求拦截器
    this.instance.interceptors.request.use((config) => {
      if (typeof this.interceptors.request === 'function') {
        return this.interceptors.request(config)
      }

      const user = useUserStore()
      if (isTruth(user.token)) {
        config.headers.token = user.token
      }
      return config
    })
  }

  post(url, params, options) {
    params = params || {}
    options = options || {}
    options.headers = options.headers || {}

    const _headers = {
      'Content-Type': 'application/json',
    }
    for (const key in options.headers) {
      _headers[key] = options.headers[key]
    }
    options.headers = _headers

    // json需要转一下
    if (options.headers['Content-Type'].startsWith('application/json')) {
      params = JSON.stringify(params)
    }

    return this.instance.post(url, params, options)
  }

  get(url, params = {}, options = { headers: {} }) {
    return this.instance({
      method: 'get',
      url,
      params,
      ...options,
    })
  }

  /**
   * 上传
   * @param {FormData} data
   * @param {object} params
   */
  upload(data, params = {}) {
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

    return this.instance.post(params.url || hl.api.upload, data, config)
  }

  /**
   * 下载文件
   * @param {string} url 下载地址
   * @param {object} params 参数
   * @param {string} method 请求方式
   * @param {object} options axios配置参数
   */
  async download(url, params, method, options) {
    method = (method || 'POST').toLowerCase()

    let result = null
    if (method === 'get') {
      result = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 60000,
        ...options,
        params,
        responseType: 'blob',
      })
    } else {
      result = await this.instance.post(url, params, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'blob',
        keepHeader: true,
      })
    }

    const blobFile = new Blob([result.data])
    const download_url = URL.createObjectURL(blobFile)

    let file_name = decodeURI(result.headers['content-disposition'])?.split('filename=')
    file_name = file_name[file_name.length - 1]

    return {
      url: download_url,
      file_name,
    }
  }
}

export default Http
