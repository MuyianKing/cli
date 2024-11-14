<script setup>
import { getAcceptType } from '../hooks/index'
import HlIcon from "../../icon/Index"

const props = defineProps({
  config: {
    type: Object,
    default() {
      return {}
    },
  },
})

const emits = defineEmits(['select-file'])

const slots = useSlots()

// 已选文件数组
const files_comp = computed(() => {
  const files = props.config.files
  if (files) {
    return Array.isArray(files) ? files : [files]
  }

  return []
})

// 是否显示添加按钮
const show_add = computed(() => {
  const config = props.config
  // 单选已选
  if (!config.multiple && files_comp.value.length > 0) {
    return false
  }

  // 多选超过范围
  if (files_comp.value.length > config.maxCount) {
    return false
  }

  return true
})

// 触发上传
const file_input_ref = ref()
function triggerAdd() {
  if (props.config.disabled) {
    return
  }
  file_input_ref.value.click()
}

// 选择文件
function selectMedia(e) {
  emits('select-file', e.target.files[0])
  file_input_ref.value.value = null
}

const is_only_video_image = inject('is_only_video_image')

// 文件类型
const accept_type = computed(() => getAcceptType(props.config.type, props.config.suffix))

defineExpose({
  triggerAdd,
})
</script>

<template>
  <div v-if="show_add" v-bind="$attrs" class="cursor-pointer normal-trigger" :class="{ 'trigger-item': is_only_video_image }" @click="triggerAdd">
    <slot name="trigger" />

    <template v-if="!slots.trigger">
      <div v-if="is_only_video_image">
        <hl-icon icon="icon-park-outline:upload-picture" size="28" color="#dcdee0" />
      </div>
      <div v-else class="upload-icon">
        <hl-icon icon="icon-park-outline:folder-upload" size="20" color="#333" />
        <span class="ml-1 ">点击上传附件</span>
      </div>
    </template>
  </div>
  <input ref="file_input_ref" type="file" style="display:none" :accept="accept_type" @change="selectMedia">
</template>

<style lang='scss' scoped>
.trigger-item {
  width: 100px !important;
  height: 100px;
  background-color: #e9eff9;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
}

.normal-trigger {
  width: fit-content;
}

.upload-icon {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.upload-icon:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
</style>
