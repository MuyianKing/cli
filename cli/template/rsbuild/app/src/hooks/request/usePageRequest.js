import { error } from '@hl/utils'
import useRequest from './useRequest'

/**
 * 页面查询
 * 1、返回的数据是响应式的
 * 2、组件挂载后立即执行：可传入manual=true时禁止
 * @param {Function} server
 * @param {object} options
 * @param {boolean} options.manual 禁止立即执行
 * @param {string} options.errMsg 请求出错提示信息
 */
export default function (server, options) {
  options = options || {}
  const { manual, errMsg } = options

  const { request, loading } = useRequest(server)

  // 响应式数据
  const _data = ref([])
  async function _request() {
    const data = await request()
    _data.value = data?.data || {}
  }

  // 是否需要页面挂载后立即执行
  if (!manual) {
    onMounted(() => {
      try {
        _request()
      } catch (e) {
        error(e, errMsg || '获取数据出错')
      }
    })
  }

  return {
    loading,
    request: _request,
    data: _data,
  }
}
