<script setup>
import { HlConfigProvider } from '@hl/h5'
import { uploadFile } from '@server/file'
import variables from '@style/theme.module.scss'
import { downloadFile, previewFileUrl } from '@utils/file'

// ui配置
const customConfig = {
  previewFileUrl,
  downloadFile,
  uploadFile,
}

// 主题
const themeVars = reactive({
  blue: variables['color-primary'],
  green: variables['color-success'],
  red: variables['color-danger'],
  orange: variables['color-warning'],
})
</script>

<template>
  <hl-config-provider class="config-provider" :custom-config :theme-vars theme-vars-scope="global">
    <router-view v-slot="{ Component, route }">
      <vue-page-stack>
        <component :is="Component" :key="route.path" />
      </vue-page-stack>
    </router-view>
  </hl-config-provider>
</template>

<style lang="scss">
.config-provider {
  height: 100%;
  background-color: var(--van-gray-1);
}
</style>
