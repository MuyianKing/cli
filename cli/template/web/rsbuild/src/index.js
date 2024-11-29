import App from '@/App.vue'
import pinia from '@/pinia'
import router from '@/router'
import api from '@api'
import { ICONIFY_API, PROJECT_PREFIX, WEB_NAME } from '@app'
import * as message from '@hl/ui/src/utils/message'
import * as common from '@hl/utils/es/common'
import http from '@http'
import { addAPIProvider, disableCache, enableCache } from '@iconify/vue'
import variables from '@style/theme.module.scss'
import dayjs from 'dayjs'
import { createApp } from 'vue'
import useEcharts from '../src/utils/echarts'

useEcharts()

addAPIProvider('', {
  resources: [ICONIFY_API],
})
disableCache('local')
enableCache('session')

// 全局属性
window.dayjs = dayjs
window.hl = {
  message,
  common,
  api,
  http,
  PROJECT_PREFIX,
  getUserInfo() {
    return useUserStore()
  },
  getAppInfo() {
    return {
      app_name: WEB_NAME,
    }
  },
  // 变量备份
  variables: { ...variables },
}

const app = createApp(App)

app.use(pinia)

useDynamicRoutesStore().initDynamicRoutes(router).finally(() => {
  app
    .use(router)
    .mount('#app')

  const theme = useThemeStore()
  theme.initTheme()
})
