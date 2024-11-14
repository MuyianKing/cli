import api from '@/api'
import App from '@/App.vue'
import pinia from '@/pinia'
import router from '@/router'
import { ICONIFY_API } from '@app'
import * as common from '@hl/utils/es/common'
import * as file from '@hl/utils/es/file'
import storage from '@hl/utils/es/storage'
import { addAPIProvider, disableCache, enableCache } from '@iconify/vue'
import dayjs from 'dayjs'
import { Lazyload } from 'vant'
import { createApp } from 'vue'
import { VuePageStackPlugin } from 'vue-page-stack'
import '@style/main.scss'
import '@style/util.scss'

addAPIProvider('', {
  resources: [ICONIFY_API],
})

disableCache('local')
enableCache('session')

// 全局属性
window.dayjs = dayjs
window.hl = {
  storage,
  file,
  common,
  api,
}

function initApp() {
  const app = createApp(App)
  app.use(Lazyload, {
    lazyComponent: true,
  })

  app.use(pinia)
    .use(router)
    .use(VuePageStackPlugin, { router })
    .mount('#app')
}


initApp()