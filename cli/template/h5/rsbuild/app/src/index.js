import api from '@/api'
import App from '@/App.vue'
import pinia from '@/pinia'
import router from '@/router'
import * as message from '@hl/h5/src/utils/message'
import * as common from '@hl/utils/es/common'
import * as file from '@hl/utils/es/file'
import storage from '@hl/utils/es/storage'
import useIcon from '@utils/icon'
import dayjs from 'dayjs'
import { Lazyload } from 'vant'
import { createApp } from 'vue'
import { VuePageStackPlugin } from 'vue-page-stack'
import '@style/main.scss'
import '@style/util.scss'

// 使用图标
useIcon()

// 全局属性
window.dayjs = dayjs
window.hl = {
  storage,
  file,
  common,
  api,
  message,
}

function initApp() {
  const app = createApp(App)
  app.use(Lazyload, {
    lazyComponent: true,
  })
    .use(pinia)
    .use(router)
    .use(VuePageStackPlugin, { router })
    .mount('#app')
}

initApp()
