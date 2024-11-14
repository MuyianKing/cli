<script setup>
const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  fullPath: {
    type: String,
    default: '',
  },
  preview: {
    type: Array,
    default() {
      return []
    },
  },
  notPreview: {
    type: Boolean,
    default: false,
  },
  fit: {
    type: String,
    default: 'contain',
  },
  height: {
    type: String,
    default: '100px',
  },
  width: {
    type: String,
    default: '100px',
  },
})

const { previewFileUrl } = inject('GLOBAL_CUSTOM_CONFIG', null)

// 查看地址
const prev_src = computed(() => {
  if (props.fullPath) {
    return props.fullPath
  }
  if (props.src) {
    return previewFileUrl ? previewFileUrl(props.src) : props.src
  }
  return ''
})

// 预览地址
const previewList = computed(() => {
  if (props.notPreview) {
    return []
  }
  return props.preview && props.preview.length > 0 ? props.preview : [prev_src.value]
})

const start = computed(() => previewList.value.findIndex(v => v === prev_src.value))

// 点击预览
const showPreview = ref(false)

function handleClickPreview() {
  showPreview.value = true
}
</script>

<template>
  <div class="hl-preview-img">
    <van-image v-if="prev_src" v-bind="$attrs" class="w-full h-full" :src="prev_src" :fit="fit" @click="handleClickPreview">
      <template #loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>

    <van-image-preview v-if="!notPreview" v-model:show="showPreview" :show-index="previewList.length > 1" :start-position="start" show-indicators teleport="body" :images="previewList" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.hl-preview-img {
  height: v-bind(height);
  width: v-bind(width);
  position: relative;
}
</style>
