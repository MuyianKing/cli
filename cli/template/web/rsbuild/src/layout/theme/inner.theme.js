import variables from '@style/theme.module.scss'

// 主题色配置
export const colors_config = [{
  label: '主色',
  key: 'color-primary',
}, {
  label: '成功',
  key: 'color-success',
}, {
  label: '警告',
  key: 'color-warning',
}, {
  label: '危险',
  key: 'color-danger',
}, {
  label: '信息',
  key: 'color-info',
}]

// 内置主题
export const innerTheme = [{
  label: '默认',
  colors: colors_config.map(item => variables[item.key]),
}, {
  label: '商务',
  colors: ['#133d88', '#26925c', '#d34905', '#ed0d0d', '#818388'],
}]

// 侧边栏
export const side_bg_config = [{
  label: '背景色',
  key: 'side-bg',
}, {
  label: '文字高亮',
  key: 'side-light-color',
}, {
  label: '整体宽度',
  key: 'side-width',
  type: 'input',
}, {
  label: '元素高度',
  key: 'side-menu-item-height',
  type: 'input',
}]

// 导航栏
export const tab_bar_config = [{
  label: '背景色',
  key: 'tab-bg',
}, {
  label: '文字高亮',
  key: 'tab-light-color',
}, {
  label: '高度',
  key: 'tab-height',
  type: 'input',
}]
