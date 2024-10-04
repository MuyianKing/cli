import { defineStore } from 'pinia'

export default defineStore('iframe', {
  state: () => ({
    // 打开的iframe
    iframe_url_list: [],
  }),
})
