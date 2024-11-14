<script setup>
import { getType } from '@hl/utils'
import AudioPlayer from '../audio/Index.vue'

const { downloadFile } = inject('GLOBAL_CUSTOM_CONFIG', null)

const props = defineProps({
  file: {
    type: Object,
    default() {
      return null
    },
  },
  noDownload: {
    type: Boolean,
    default: false,
  },
})

const wavesurfer_src = ref('')
function handleDownload() {
  if (props.noDownload || !props.file) {
    return
  }

  downloadFile && downloadFile(props.file)
}
</script>

<template>
  <audio-player v-if="file && getType(file.fileName || file.name) === 'audio'" v-model="wavesurfer_src" :file v-bind="$attrs" />
  <span v-else v-bind="$attrs" class="file-item" @click="handleDownload">
    {{ file?.name }}
  </span>
</template>

<style lang="scss" scoped>
.file-item {
  color: var(--van-primary-color);
}
</style>
