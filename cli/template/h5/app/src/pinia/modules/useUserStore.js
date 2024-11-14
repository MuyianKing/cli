import { defineStore } from 'pinia'

export default defineStore('user', {
  state: () => ({
    token: '',
  }),
  actions: {
    initUser(data) {
      this.$patch(data)
    },
    clearUser() {
      this.$reset()
    },
  },
  persist: true,
})
