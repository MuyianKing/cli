import { cloneDeep, concat } from 'lodash-es'

export default function (props, emits, apiSelect, config = {}) {
  const select_value = ref('')
  const dataList = ref([])

  const query = reactive({
    limit: 20,
    page: 1,
    id: '',
    ...(config.params || {}),
  })

  async function commonInit() {
    const key = config.key || 'id'
    dataList.value = []
    const params = { ...query }
    const value = props.modelValue

    // value可能是数组
    if (Array.isArray(value)) {
      params[key] = value.join(',')
    } else if (value) {
      params[key] = value
    }

    // 有初始id根据id获取
    if (params[key]) {
      const data = await apiSelect(params)
      if (data && data.data) {
        dataList.value = formatData(data.data)
      }
    }

    const data = await apiSelect(query)
    dataList.value = concat(dataList.value, filterData(formatData(data.data)))
    if (props.multiple) {
      if (Array.isArray(value)) {
        select_value.value = cloneDeep(value)
      } else {
        select_value.value = value ? value.toString().split(',') : []
      }

      select_value.value = select_value.value.map(item => item.toString())
    } else if (Array.isArray(value)) {
      select_value.value = value.join(',')
    } else {
      select_value.value = value.toString()
    }
  }

  function formatData(data) {
    return commonFormatData(data, config.format_config || {})
  }

  // 格式化数据
  function commonFormatData(data, keys = {}) {
    if (!data || data.length === 0) {
      return []
    }
    const id_key = keys.id_key ? keys.id_key : 'id'
    const name_key = keys.name_key ? keys.name_key : 'name'
    const extend_keys = keys.extend_keys ? keys.extend_keys : []

    return data.map((item) => {
      const new_item = {
        id: `${item[id_key].toString()}`,
        name: item[name_key],
      }

      // 额外字段数据
      extend_keys.forEach((key) => {
        new_item[key] = item[key]
      })
      return new_item
    })
  }

  // 去掉已经包含的数据
  function filterData(data) {
    let fData = data
    const ids = dataList.value.map(item => item.id)
    if (ids.length > 0) {
      fData = data.filter(item => !ids.includes(item.id))
    }
    return fData
  }

  // 是否还有更多
  let hasMore = true

  // 搜索
  function search() {
    apiSelect(query).then((data) => {
      hasMore = data.count > query.limit * query.page

      dataList.value = concat(dataList.value, filterData(formatData(data.data)))
    }).catch((e) => {
      hl.message.error(`获取数出错：${e.error}`)
    })
  }

  // 搜索
  function commonFilter() {
    document.getElementsByClassName('el-scrollbar__view el-select-dropdown__list').scrollTop = 0
    dataList.value = []
    query.page = 1
    search()
  }

  // 下拉加载更多
  function loadmore() {
    if (hasMore) {
      query.page++
      search()
    }
  }

  // 下拉框值变化类型：self-自身选择改变不需要做任何操作，outer-外部手动改变
  let value_change_type = 'outer'

  // 下拉事件
  function handleSelChange(val) {
    value_change_type = 'self'
    // 给我什么类型的就返回什么类型的数据
    let return_data = null
    if (props.multiple) {
      return_data = Array.isArray(props.modelValue) ? val : val.join(',')
    } else {
      return_data = Array.isArray(props.modelValue) ? [val] : val
    }

    emits('update:modelValue', return_data)
  }

  watch(() => props.modelValue, () => {
    if (value_change_type !== 'self') {
      commonInit()
    }
    // 默认外部更新数据
    value_change_type = 'outer'
  }, {
    immediate: true,
  })

  return {
    select_value,
    dataList,
    apiSelect,
    query,
    loadmore,
    handleSelChange,
    commonFilter,
  }
}
