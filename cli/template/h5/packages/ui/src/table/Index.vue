<script setup>
import TableBody from './table-body'
import TableHead from './table-head'
import TableStore from './table-store'

defineOptions({
  name: 'HlTable',
})

const props = defineProps({
  data: {
    type: Array,
    default() {
      return []
    },
  },
  // 表格的最大高度：不包括表头
  maxHeight: {
    type: String,
    default: '',
  },
  // 内容不换行
  nowrap: {
    type: Boolean,
    default: false,
  },
  // 对齐方式
  align: {
    type: String,
    default: 'center',
  },
  // 鼠标放到行样式
  hover: {
    type: String,
    default: 'default',
  },
  // 是否高亮选中行
  hightLight: {
    type: Boolean,
    default: false,
  },
  // 默认高亮的行
  lightLine: {
    type: Number,
    default: 0,
  },
  // 是否根据高亮的行滚动表格让当前的高亮行始终可见
  scrollWhenLight: {
    type: Boolean,
    default: false,
  },
  // 没有数据时显示的文字
  emptyText: {
    type: String,
    default: '没有数据',
  },
  // 是否显示边框
  border: {
    type: Boolean,
    default: true,
  },
  // 边框颜色
  borderColor: {
    type: String,
    default: '#dfdfdf',
  },
  borderWidth: {
    type: String,
    default: '1px',
  },
  rowClass: {
    type: Function,
    default() {
      return ''
    },
  },
  tooltipEffect: {
    type: String,
    default: 'light',
  },
  tooltopMaxWidth: {
    type: String,
    default: '90vw',
  },
})

const emits = defineEmits(['update:edit-header', 'row-click', 'span-click', 'update:lightLine'])

const tableId = Number.parseInt(Math.random() * 100000000, 10)

const slots = useSlots()

const store = ref(new TableStore())
provide('hlTableStore', store)

/**
 * 设置不换行后，内容会把td全部撑开，导致width、min-width失效，所以在执行doLayout之前应该取消不换行，
 * 在table自己适应宽度并且成功设置了width、min-width后才设置不换行
 */
const refresh_layout = ref(false)
// doLayout应该在mounted并且nextTick后才执行
let ready = false
watch(
  () => props.data,
  () => {
    store.value.setData(props.data)
    store.value.setStorageKey(props.storageKey)
    // 取消不换行
    refresh_layout.value = true
    // 重新布局
    nextTick(() => {
      if (ready) {
        doLayout()
      }
    })
  },
  {
    immediate: true,
  },
)

// 根据tbody设置thead
function doLayout() {
  resizeObserver.disconnect()
  const table = document.getElementById(tableId)
  if (!table) {
    return
  }

  // 清除样式
  clearStyle()

  // 清除table的宽度
  const tbodyer = table.querySelector('.body-wrapper')
  tbodyer.style.width = ''

  // 没有数据只需要把表头和表体的宽度设为一致即可
  if (props.data.length === 0) {
    const theader = table.querySelector('.hl-table-header')
    nextTick(() => {
      tbodyer.style.width = `${theader.clientWidth}px`
      sortColumns()
    })
    return
  }

  // 清除样式等待表格重新渲染
  nextTick(() => {
    // 获取第一行tr
    const tbody = table.getElementsByClassName('hl-table-body')
    if (!tbody || tbody.length === 0) {
      return
    }

    const trs = tbody[0].getElementsByClassName('hl-table-tr')

    if (trs && trs.length > 0) {
      // 获取thead的th
      const body_tds = trs[0].getElementsByClassName('hl-table-td')

      // 设置宽度
      const columns = [...store.value.columns]
      for (let i = 0, len = body_tds.length; i < len; i++) {
        // 根据uuid获取对应的配置项
        const uuid = body_tds[i].getAttribute('data-uuid')
        const column = columns.find(item => item.uuid === uuid)
        const width = `${body_tds[i].getBoundingClientRect().width}px`

        // tbody 不设置maxWidth，数据会撑开td
        column.tdStyle.maxWidth = width
        column.tdStyle.width = width

        // thead
        column.thStyle.minWidth = width
        column.thStyle.width = width
        column.thStyle.maxWidth = width
      }

      store.value.setColumns(columns)

      sortColumns()

      nextTick(() => {
        startObserve()
      })
    }
    refresh_layout.value = false
  })
}

// 清空doLayout方法中设置的样式，否则会影响计算
function clearStyle() {
  const table = document.getElementById(tableId)

  if (!table) {
    return
  }

  const tbody = table.getElementsByClassName('hl-table-body')
  if (!tbody || tbody.length === 0) {
    return
  }

  // 设置宽度
  const columns = [...store.value.columns]

  columns.forEach((col) => {
    // tbody
    col.tdStyle.maxWidth = ''
    col.tdStyle.width = col.tdStyle.orgWidth

    // thead
    col.thStyle.width = col.tdStyle.orgWidth
    col.thStyle.minWidth = col.tdStyle.minWidth
    col.thStyle.maxWidth = ''
  })
  store.value.setColumns(columns)
}

const activeIndex = ref()
// 行点击事件
function handleRowClick(row, index) {
  if (props.hightLight) {
    if (activeIndex.value === index) {
      activeIndex.value = -1
    } else {
      activeIndex.value = index
    }
    emits('update:lightLine', activeIndex.value)
  }

  emits('row-click', row, index)
}

// 监听高亮，设置滚动
watch(activeIndex, () => {
  if (!props.scrollWhenLight) {
    return
  }

  setBodyerScroll()
})

// 根据activeIndex设置滚动
function setBodyerScroll() {
  nextTick(() => {
    const table = document.getElementById(tableId)
    if (!table) {
      return
    }

    const tbody = table.getElementsByClassName('hl-table-body')
    if (!tbody || tbody.length === 0) {
      return
    }

    const trs = tbody[0].getElementsByClassName('hl-table-tr')

    const val = props.lightLine

    let height = 0
    for (let i = 0; i < val && i < trs.length; i++) {
      height += trs[i].clientHeight
    }

    const tbodyer = table.querySelector('.body-wrapper')
    tbodyer.scrollTop = height
  })
}

function handleSpanClick(column, index) {
  emits('span-click', column, index)
}

// 显示滚动条
const scroll_bar_active = ref(false)

const hasEmptySlot = computed(() => !!slots.empty)

watch(
  () => props.lightLine,
  (val) => {
    if (props.hightLight) {
      activeIndex.value = val
    }
  },
  {
    immediate: true,
  },
)

// 对列按照hl-table-column的顺序排序
function sortColumns() {
  const table = document.getElementById(tableId)

  if (!table) {
    return
  }

  const trs = table.querySelector('.hidden-columns').querySelectorAll('div')
  if (trs && trs.length > 0) {
    const column_map = {}
    store.value.columns.forEach((item) => {
      column_map[item.uuid] = item
    })

    const new_columns = []
    trs.forEach((tr) => {
      const id = tr.getAttribute('id')
      if (column_map[id]) {
        new_columns.push(column_map[id])
      }
    })

    store.value.setColumns(new_columns)
  }
}

// 监听表格容器变化，重新布局
const resize = useDebounceFn(() => {
  // 取消不换行
  refresh_layout.value = true
  doLayout()
}, 10)

let resizeObserver = null
function watchTableResize() {
  useEventListener(window, 'resize', resize)

  resizeObserver = new MutationObserver(resize)
}

// 开始监听
function startObserve() {
  // 每一次数据变化都需要重新渲染列表
  const table = document.getElementById(tableId)
  if (table instanceof Element) {
    resizeObserver.observe(table, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    })
  }
}

onMounted(() => {
  watchTableResize()
  nextTick(() => {
    doLayout()
    ready = true
  })
})

defineExpose({
  doLayout,
  setBodyerScroll,
})
</script>

<template>
  <div :id="tableId" class="hl-table" :class="{ 'hl-table-border': border, 'nowrap': nowrap && !refresh_layout }" :style="{ height: data.length === 0 ? '100%' : '' }">
    <!-- 隐藏列: slot里容纳table-column -->
    <div class="hidden-columns">
      <slot />
    </div>

    <table-head v-if="store.columns.filter((column) => column.label).length > 0" @span-click="handleSpanClick" />

    <div class="body-wrapper" :style="{ maxHeight }" @mouseenter="scroll_bar_active = data.length > 0 && true" @mouseleave="scroll_bar_active = fasle">
      <table-body v-show="!(data.length === 0 && hasEmptySlot)" :hover="hover" :active-index="activeIndex" :empty-text="emptyText" :row-class="rowClass" :tooltip-effect="tooltipEffect" @row-click="handleRowClick">
        <template v-if="slots.extend" #extend="{ row }">
          <slot name="extend" :row="row" />
        </template>
      </table-body>

      <div v-show="data.length === 0 && hasEmptySlot" class="w-full h-full">
        <slot name="empty" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use './scss/table.scss';
@use './scss/tbody.scss';
@use './scss/thead.scss';

.hl-table {
  max-height: 100%;
  overflow-x: auto;
  height: 100%;
}

.hidden-columns {
  visibility: hidden;
  position: absolute;
  z-index: -1;
}

.body-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
  width: fit-content;
  min-width: 100%;
  position: relative;
  scrollbar-width: none;
  max-height: calc(100% - 41px);
}

.body-wrapper::-webkit-scrollbar {
  width: 0px;
  height: 7px;
}

.body-wrapper::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 20px;
}

.body-wrapper:hover::-webkit-scrollbar-thumb {
  background: rgba(185, 186, 189, 0.6);
}

.nowrap {
  ::v-deep(.hl-table-td) {
    white-space: nowrap;
  }
}

.hl-table-border {
  ::v-deep(.hl-table-header) {
    border-top: v-bind(borderWidth) solid v-bind(borderColor);
  }

  ::v-deep(table) {
    border-left: v-bind(borderWidth) solid v-bind(borderColor);

    tbody td,
    thead th {
      border-bottom: v-bind(borderWidth) solid v-bind(borderColor);
      border-right: v-bind(borderWidth) solid v-bind(borderColor);
    }
  }

  .hl-table-no-data {
    border-bottom: v-bind(borderWidth) solid v-bind(borderColor);
  }
}
</style>
