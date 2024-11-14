<script setup>
import { getSuffix, getType } from '@hl/utils'
import HlIcon from '../../icon/Index.vue'

const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
})

const emits = defineEmits(['delete', 're-upload'])

const icon_map = {
  image: 'icon-park:pic',
  video: 'icon-park:video-conference',
  audio: 'icon-park:audio-file',
  xls: 'icon-park:excel',
  xlsx: 'icon-park:excel',
  ppt: 'icon-park:ppt',
  pptx: 'icon-park:ppt',
  file: 'icon-park:file-word',
}

const icon_comp = computed(() => {
  return icon_map[getSuffix(props.file?.name)] || icon_map[getType(props.file?.name)]
})

// 删除
function handleDel() {
  emits('delete')
}

// 重新上传
function handleReupload() {
  emits('re-upload')
}
</script>

<template>
  <div v-if="file" class="file-item">
    <div class="flex items-center flex-1" @click="handleReupload">
      <hl-icon :icon="icon_comp" :size="22" />
      <span class="ml-1 line-clamp-1">{{ file.name }}</span>
    </div>

    <div class="flex items-center pr-2">
      <hl-icon icon="material-symbols-light:close" @click="handleDel" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.file-item {
  display: flex;
  align-items: center;

  svg {
    font-size: 22px !important;
  }

  .icon-close {
    display: none;
    color: gray;
  }

  .icon-loading {
    color: var(--color-warning);
  }
}

.file-item:hover {
  background-color: rgb(238, 239, 255);
  color: var(--color-primary);
  cursor: pointer;

  .icon-success {
    display: none;
  }

  .icon-close {
    display: inherit;
  }
}

.hidden {
  display: none !important;
}
</style>
