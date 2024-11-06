import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  ignores: ['**/public/**'],
}, {
  rules: {
    'no-console': 0,
    'no-eval': 0,
    'no-use-before-define': 0,
    'ts/no-use-before-define': 0,
    'no-new-func': 0,
    'no-new': 0,
    // http://eslint.cn/docs/rules/curly
    'curly': 0,
    // https://eslint.cn/docs/rules/brace-style
    'brace-style': ['error', '1tbs'],
    'style/brace-style': 0,
    'no-template-curly-in-string': 0,
  
  },
  languageOptions: {
    globals: {
      
    },
  },
})
