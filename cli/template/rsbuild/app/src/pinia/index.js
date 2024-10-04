import { storage } from '@hl/utils'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(createPersistedState({
  key: id => `${id.toString().split().map(item => item.toUpperCase()).join()}_STORAGE`,
  storage: {
    getItem: (key) => {
      const value = storage.get(key)
      return JSON.stringify(value)
    },
    setItem: (key, value) => storage.set(key, value),
  },
}))

export default pinia
