<script setup>
const props = defineProps({
  // 不显示骨架屏
  noSkeleton: {
    type: Boolean,
    default: false,
  },
  status: {
    /**
     * @type {PropType<{count: number, loading: boolean}>}
     */
    type: Object,
    default() {
      return {
        // 数据总条数
        count: 0,
        // 加载状态
        loading: false,
      }
    },
  },
  // 当前数据
  data: {
    type: Array,
    default() {
      return []
    },
  },
  emptyText: {
    type: String,
    default: '没有数据',
  },
  emptyImage: {
    type: String,
    default: 'default',
  },
})

const emits = defineEmits(['load'])

// 下拉加载更多
const loading_type = ref('more')
const onLoad = useDebounceFn((type = 'more') => {
  loading_type.value = type
  emits('load', type)
}, 20)

// 下拉刷新是否处于loading状态
const pull_loading = computed(() => loading_type.value === 'pull' ? props.status.loading : false)

// 加载更多是否属于loading状态
const list_loading = computed(() => loading_type.value === 'more' ? props.status.loading : false)

// 是否还需要加载更多
const finished = computed(() => props.data.length === 0 || props.data.length >= props.status.count)

let scrollTop = 0
const handleScroll = useDebounceFn((e) => {
  scrollTop = e.target.scrollTop
}, 200)

const pull_ref = ref()
onActivated(() => {
  nextTick(() => {
    pull_ref.value.$el.scrollTop = scrollTop
  })
})
</script>

<template>
  <van-pull-refresh ref="pull_ref" class="list-wrapper" :model-value="pull_loading" @refresh="onLoad('pull')" @scroll="handleScroll">
    <van-list class="h-full" :loading="list_loading && noSkeleton" :finished="finished" :finished-text="data.length === 0 ? '' : '到底了'" :immediate-check="false" :offset="500" @load="onLoad">
      <slot />
      <template v-if="status.loading && !noSkeleton">
        <van-skeleton v-for="index in 6" :key="index" title :row="3" class="py-4 mb-4 bg-white" />
      </template>

      <slot name="empty">
        <van-empty v-if="data.length === 0" :description="emptyText" class="h-full" :image="emptyImage" />
      </slot>
    </van-list>
  </van-pull-refresh>
</template>

<style lang="scss" scoped>
.list-wrapper {
  height: 100%;
  overflow-y: auto;
}
</style>
