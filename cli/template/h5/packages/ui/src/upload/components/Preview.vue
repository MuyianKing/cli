<script setup>
import { getType } from '@hl/utils'
import HlIcon from '../../icon/Index.vue'
import HlImage from '../../image/Index.vue'
import HlVideo from '../../video/Index.vue'
import PreviewItem from './PreviewItem.vue'

const props = defineProps({
  file: {
    type: [Array, String, Object],
    default: '',
  },
})

const emits = defineEmits(['delete', 're-upload'])

// 删除
function handleDel(row) {
  emits('delete', row)
}

// 重新上传
function handleChange(row) {
  emits('re-upload', row)
}

const _files = computed(() => {
  if (!props.file) {
    return []
  }
  const files = Array.isArray(props.file) ? props.file : typeof props.file === 'object' ? [props.file] : [{ path: props.file }]

  return files.map((item) => {
    return {
      ...item,
      type: getType(item.path) || getType(item.name),
    }
  })
})

const is_only_video_image = inject('is_only_video_image')
</script>

<template>
  <div v-for="_file in _files" :key="_file.id" class="preview-wrapper">
    <preview-item v-if="!is_only_video_image" :file="_file" class="py-1" @delete="handleDel(_file)" @re-upload="handleChange(_file)" />

    <template v-else>
      <hl-image v-if="_file.type === 'image'" :src="_file.path" height="100px" width="100px" fit="cover" @click="handleChange(_file)" />
      <hl-video v-else :src="_file.path" height="100px" width="100px" @click="handleChange(_file)" />
      <div class="delete-wrapper">
        <hl-icon class="icon-close" icon="icon-park-outline:close-small" color="#fff" :size="16" @click="handleDel(_file)" />
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.preview-wrapper {
  position: relative;
  border-radius: 5px;
  position: relative;

  .loading-item {
    position: absolute;
    z-index: 99;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.delete-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  width: 20px;
  height: 20px;
  border-radius: 0 0 0 100%;

  .icon-close {
    position: relative;
    top: 0;
    right: -3px;
  }
}

.preview-wrapper:hover {
  .delete-wrapper {
    display: flex;
  }
}

:deep(img) {
  border-radius: 5px;
}

:deep(.hl-preview-video) {
  border-radius: 5px;
}
</style>
