import { BASE_URL } from '@app'
import { isTruth } from '@hl/utils'
import axios from 'axios'

class CustomError extends Error {
  constructor(error) {
    super(error.error)
    this.error = error.error || ''
    this.errno = error.errno || ''
  }
}

/* 默认超时时间 */
axios.defaults.timeout = 60000 * 5

/** 设置请求基地址 */
axios.defaults.baseURL = BASE_URL

// 添加响应拦截器
axios.interceptors.response.use(
  (response) => {
    if (response.data.errno !== undefined && response.data.errno !== 0 && response.data.errno !== 200) {
      return Promise.reject(response.data)
    } else {
      return Promise.resolve(response.data)
    }
  },
  (error) => {
    let resp_error = null
    if (error.response && error.response.data) {
      const { data } = error.response
      resp_error = new CustomError({
        errno: data.status || data.errno,
        error: data.error,
      })
    } else {
      resp_error = new CustomError({
        errno: error?.response?.status || 999,
        error: error?.response?.statusText || error?.message || '程序出错或网络连接失败',
      })
    }

    // 认证失败：直接跳到登录
    if (+resp_error.errno === 401) {
      // 清空token
      useUserStore().clearUser()
      if (!location.hash.startsWith('#/login')) {
        window.location.href = `#/login?msg=${encodeURIComponent(resp_error.error)}`
        window.location.reload()
      }
    }

    return Promise.reject(resp_error)
  },
)

// 添加请求拦截器
axios.interceptors.request.use((config) => {
  const user = useUserStore()
  if (isTruth(user.token)) {
    config.headers.token = user.token
  }
  return config
})

export function post(url, params, options) {
  params = params || {}
  options = options || {}
  options.headers = options.headers || {}
  options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json;charset=UTF-8'

  // json需要转一下
  if (options.headers['Content-Type'].startsWith('application/json')) {
    params = JSON.stringify(params)
  }

  return axios.post(url, params, options)
}

export function get(url, params = {}, options = { }) {
  return axios({
    method: 'get',
    url,
    params,
    ...options,
  })
}

export function download(url, options = {}) {
  return axios.request({
    url,
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'withCredentials': true,
      ...options,
    },
  })
}
