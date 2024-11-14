<script setup>
import { provide } from 'vue'

const props = defineProps({
  customConfig: {
    type: Object,
    required: true,
  },
})

/**
 * 提供全局配置
 * @param {object} customConfig
 * @param {Function} customConfig.uploadFile : 上传文件方法,
 * @param {Function} customConfig.downloadFile : 下载文件方法,
 * @param {Function} customConfig.previewFileUrl ：生成预览地址方法
 * @param {Function} customConfig.backFun ：hl-top 后退方法
 */
function provideGlobalConfig(customConfig) {
  provide('GLOBAL_CUSTOM_CONFIG', customConfig)
}

provideGlobalConfig(props.customConfig)
</script>

<template>
  <van-config-provider class="h-full">
    <slot />
  </van-config-provider>
</template>

<style lang='scss' scoped></style>
