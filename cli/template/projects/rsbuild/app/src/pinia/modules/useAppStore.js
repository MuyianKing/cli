import { defineStore } from 'pinia'

export default defineStore('appinfo', {
  state: () => ({
    // 页面是否全屏
    full_page: false,
    app_name: '系统名称',
  }),
  actions: {
    initData(data) {
      if (data) {
        this.$patch(data)
      }
    },
    clear() {
      this.$reset()
    },
  },
  persist: {
    enabled: true,
  },
})
