import { defineStore } from 'pinia'

export default defineStore('user', {
  state: () => ({
    id: '',
    username: '',
    name: '',
    id_card: '',
    phone: '',
    status: '',
    image: '',
    token: '',
    token_expire: 0,
    role_id: [],
    police_id: '',
    organization: null,
    resources_id: [],
  }),
  actions: {
    initUser(data) {
      if (data) {
        data.organization = data.organization?.[0] || null
        this.$patch(data)
        this.token_expire = Date.now()
      }
    },
    clearUser() {
      this.$reset()
    },
  },
  persist: {
    enabled: true,
  },
})
