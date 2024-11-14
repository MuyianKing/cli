<script setup>
import { getType } from '@hl/utils'
import HlFile from '../file/Index.vue'
import HlImage from '../image/Index.vue'
import HlVideo from '../video/Index.vue'

const props = defineProps({
  files: {
    type: [Array, Object],
    default: null,
  },
  height: {
    type: String,
    default: '100px',
  },
  width: {
    type: String,
    default: 'auto',
  },
})

const _files = computed(() => {
  if (!props.files) {
    return []
  }
  const files = Array.isArray(props.files) ? props.files : typeof props.files === 'object' ? [props.files] : [{ path: props.files }]

  return files.map((item) => {
    item.type = getType(item.path) || getType(item.name)
    return item
  })
})

const _image_video = ref([])
const _not_image_video = ref([])
watch(_files, (val) => {
  _image_video.value = []
  _not_image_video.value = []

  val.forEach((item) => {
    if (item.type === 'image' || item.type === 'video') {
      _image_video.value.push(item)
    } else {
      _not_image_video.value.push(item)
    }
  })
}, {
  immediate: true,
})
</script>

<template>
  <div class="file-preview-wrapper">
    <template v-for="item in _image_video" :key="item.id">
      <hl-image v-if="item.type === 'image'" :height="height" :width="height" :src="item.path" fit="cover" class="m-1" />
      <hl-video v-else :src="item.path" :height="height" :width="width" class="m-1" controls style="min-width: 200px;" />
    </template>

    <template v-for="item in _not_image_video" :key="item.id">
      <hl-file :file="item" class="m-1 w-full" />
    </template>
  </div>
</template>

<style lang='scss' scoped>
.file-preview-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
