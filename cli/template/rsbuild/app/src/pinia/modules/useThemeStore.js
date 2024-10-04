import { colors_config } from '@/layout/theme/inner.theme'
import { isLight, mix, set16ToRgb } from '@hl/utils'
import variables from '@style/theme.module.scss'
import { defineStore } from 'pinia'

export default defineStore('theme', {
  state: () => ({
    // 主题
    theme: null,

    // 主题类型 数字表示取第几个内置主题  self表示自定义主题
    theme_type: 0,
  }),
  getters: {
    themeStyle() {
      const theme = this.theme

      if (theme) {
        // 白色混合色
        const mixWhite = '#ffffff'

        // 黑色混合色
        const mixBlack = '#000000'

        const theme_style = []
        for (const key in theme) {
          theme_style.push(`--${key}:${theme[key]}`)

          // 更新 theme.module.scss
          variables[key] = theme[key]
        }

        colors_config.forEach((item) => {
          const pre = `--el-${item.key.replace(/_/g, '-')}`
          if (theme[item.key]) {
            const color = theme[item.key]
            theme_style.push(`${pre}:${color}`)

            // 设置辅色
            for (let i = 1; i < 10; i += 1) {
              theme_style.push(`${pre}-light-${i}:${mix(color, mixWhite, i * 0.1)}`)
              theme_style.push(`${pre}-dark-${i}:${mix(color, mixBlack, i * 0.1)}`)
            }
          }
        })

        // 左边菜单栏背景色
        theme_style.push(`--el-menu-bg-color:${theme['side-bg']}`)
        // 左边菜单栏的字体颜色：根据背景色的深浅自动设置黑色或白色字体
        theme_style.push(`--el-menu-text-color:${isLight(set16ToRgb(theme['side-bg'])) ? '#333' : '#eee'}`)
        // 顶部文本颜色
        theme_style.push(`--el-bar-text-color:${isLight(set16ToRgb(theme['tab-bg'])) ? '#333' : '#eee'}`)

        return theme_style.join(';')
      }
      return ''
    },
  },
  actions: {
    initTheme() {
      // 先剔除已经废弃的变量
      let theme = this.theme || {}

      // 判断默认主题是否更新
      if (this.theme_type === 0 && theme.version !== variables.version) {
        theme = variables
      }

      // 先剔除已经废弃的变量
      const keys = Object.keys(variables)
      for (const key in theme) {
        if (!keys.includes(key)) {
          delete theme[key]
        }
      }

      // 加入新变量
      for (const key in variables) {
        if (!theme[key]) {
          theme[key] = variables[key]
        }
      }

      this.theme = theme
      document.documentElement.style = this.themeStyle
    },
  },
  persist: {
    enabled: true,
  },
})
