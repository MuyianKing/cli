/**
 * 普通请求：
 * 1、不返回数据
 * 2、不会立即请求
 * @param {Function} server  接口方法
 */
export default function (server) {
  if (!server || typeof server !== 'function') {
    throw new Error('server不是Function')
  }

  const loading = ref(false)

  /**
   * 获取数据
   * @param {object} params
   * @returns {object} 接口原始数据
   */
  async function request(params) {
    loading.value = true

    try {
      const data = await server(params)
      return data
    } finally {
      loading.value = false
    }
  }

  return {
    request,
    loading,
  }
}
