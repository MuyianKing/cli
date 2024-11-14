<script setup name="HlTableColumn">
import { guid } from '@hl/utils'
import { storage } from '@hl/utils'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  prop: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  index: {
    type: [String, Number, Function],
    default: '',
  },
  width: {
    type: [String, Number],
    default: '',
  },
  minWidth: {
    type: [String, Number],
    default: '',
  },
  align: {
    type: String,
    default: '',
  },
  style: {
    type: [String, Object],
    default: '',
  },
  className: {
    type: String,
    default: '',
  },
  // 表头标签样式
  labelStyle: {
    type: [String, Object],
    default: '',
  },
})

// 唯一id
const uuid = guid()

// 没有插槽的渲染函数
const DEFAULT_RENDER_CELL = function ({ row, index }) {
  // 索引
  if (props.type === 'index') {
    // 函数
    if (typeof props.index === 'function') {
      return props.index(index)
    }
    return props.index === '' ? index + 1 : props.index
  }
  return row[props.prop] === undefined || row[props.prop] === null ? '' : row[props.prop]
}

// 插槽
const slots = useSlots()
const store = inject('hlTableStore')
const instance = getCurrentInstance()

// 渲染函数
const renderCell = slots.default || DEFAULT_RENDER_CELL
// 渲染方法
function renderRow(data) {
  return renderCell(data)
}

onBeforeMount(() => {
  const parent = instance.parent

  // 最小宽度
  let minWidth = props.minWidth
  if (minWidth && !Number.isNaN(+minWidth)) {
    minWidth += 'px'
  } else {
    const label = props.label || (props.type === 'index' ? '序号' : '')
    // 没有设置最小宽度默认设置为可以完全放下标签：仅非自定义表头有用
    minWidth = `calc(${label.length}em + 20px)`
  }

  // 宽度
  let width = props.width
  if (width && !Number.isNaN(+width)) {
    width += 'px'
  }

  // 对其方式
  const textAlign = props.align || parent.props.align || 'left'
  const style = {
    textAlign,
    minWidth,
    width,
  }

  console.log(parent)

  // 判断父组件是否是hl-table
  if ((parent.type.name) !== 'HlTable') {
    throw new Error('请将hl-table-column放在hl-table中')
  }

  const config = storage.get(store.value.storageKey) || []

  // 插入列
  parent.provides.hlTableStore.value.insertColumn({
    uuid,
    ...props,
    label: props.label || (props.type === 'index' ? '序号' : ''),
    className: props.className,
    style,
    tdStyle: {
      ...props.style,
      ...style,
      // 渲染过程中会把width覆盖掉，需要缓存
      orgWidth: width,
    },
    thStyle: {},
    labelStyle: props.labelStyle,
    render: renderRow,
    renderHeader: slots.header || null,
    show: !props.prop || config.length === 0 || config.includes(props.prop),
  })
})
</script>

<template>
  <div :id="uuid" />
</template>
