import antfu from '@antfu/eslint-config'
import { base } from '@muyianking/config/eslint.config.js'

export default antfu({
  formatters: true,
  ignores: ['**/public/**'],
}, {
  rules: {
    ...base,
    'no-unused-expressions': 0,
  },
  languageOptions: {
    globals: {

    },
  },
})
