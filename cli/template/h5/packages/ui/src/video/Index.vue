<script setup>
import { openFullScreen } from '@hl/utils'

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  height: {
    type: String,
    default: 'auto',
  },
  width: {
    type: String,
    default: '350px',
  },
  // 是否显示控制条
  controls: {
    type: Boolean,
    default: false,
  },
  // 设置视频缩放模式
  fit: {
    type: String,
    default: 'contain',
  },
})

const { previewFileUrl } = inject('GLOBAL_CUSTOM_CONFIG', null)

const video_ref = ref()
function handleClick() {
  if (video_ref.value) {
    openFullScreen(video_ref.value)
    video_ref.value.play()
  }
}

// 查看地址
const prev_src = computed(() => {
  if (props.src && previewFileUrl) {
    return previewFileUrl(props.src)
  }
  return ''
})
</script>

<template>
  <div v-if="prev_src" class="hl-preview-video" @click="handleClick">
    <video ref="video_ref" class="w-full h-full" :controls="false" :src="prev_src" :style="{ objectFit: fit }" />
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.hl-preview-video {
  height: v-bind(height);
  width: v-bind(width);
  position: relative;
  background-color: black;
}
</style>
