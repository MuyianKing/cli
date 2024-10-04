/**
 * 分页列表查询
 * @param server
 * @returns {{list_data: *, loading}}
 */
export function usePageRequest(server) {
  const loading = ref(false)
  const list_data = reactive({
    count: 0,
    data: [],
  })

  async function getList(params, options = {}) {
    options = options || {}

    // 是否将当前从接口中获取的数据累加到data中
    const append = options.append || false

    // 默认data中只会包含data和count，这里配置需要获取的接口中的其他字段
    const data_extend_keys = options.data_extend_keys || []

    try {
      loading.value = true
      const data = await server(params)

      // 生成序号
      data.data.forEach((item, index) => {
        if (typeof item === 'object') {
          item.index = params.limit * (params.page - 1) + index + 1
        }
      })

      // 累加
      if (append) {
        data.data.forEach((item) => {
          list_data.data.push(item)
        })
      } else {
        list_data.data = data.data
      }

      // 额外字段
      data_extend_keys.forEach((key) => {
        if (data[key] !== undefined)
          list_data[key] = data[key]
      })

      list_data.count = data.count
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    list_data,
    getList,
  }
}
