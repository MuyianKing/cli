<script setup>
import { uploadFile } from '@server/file'
import { getIcons } from '@server/icon'
import { downloadFile, previewFileUrl } from '@utils/file'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const customConfig = {
  uploadFile,
  previewFileUrl,
  downloadFile,
  getIcons,
}

const user = computed(() => {
  const _user = useUserStore()
  return {
    name: _user.name,
    police_id: _user.police_id,
  }
})
</script>

<template>
  <hl-config-provider :locale="zhCn" :custom-config>
    <el-watermark :content="[user.name, user.police_id]" class="w-full h-full" :z-index="9999">
      <router-view />
    </el-watermark>
  </hl-config-provider>
</template>

<style lang="scss">
@import '@style/custome.scss';
@import '@style/main.scss';
@import '@style/utils.scss';
</style>
