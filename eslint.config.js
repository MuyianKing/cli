import antfu from '@antfu/eslint-config'
import { base } from '@muyianking/config/eslint.config.js'

export default antfu({
  formatters: true,
  ignores: [
    '**/public/**',
    // 贡献者表格由 contributors-readme-action 自动生成，里面的制表符修不掉
    '**/README.md',
  ],
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
