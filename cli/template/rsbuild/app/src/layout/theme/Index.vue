<script setup name="HlTheme">
import ConfigItem from '@layout/theme/ConfigItem.vue'
import variables from '@style/theme.module.scss'
import { colors_config, innerTheme, side_bg_config, tab_bar_config } from './inner.theme'

const themeStore = useThemeStore()

const show_config = ref(false)
function showConfig() {
  show_config.value = true
}

const form = ref(variables || {})

// 设置内置主题
function handleInnerClick(index) {
  themeStore.theme_type = index
  const colors = innerTheme[index].colors

  colors_config.forEach((item, ind) => {
    themeStore.theme[item.key] = form.value[item.key] = colors[ind]
  })
}

// 初始化主题
function initTheme() {
  const theme = themeStore.theme || {}

  // 先剔除已经废弃的变量
  const keys = Object.keys(variables)
  for (const key in theme) {
    if (!keys.includes(key)) {
      delete theme[key]
    }
  }

  // 加入新加的变量
  for (const key in variables) {
    if (!theme[key]) {
      theme[key] = variables[key]
    }
  }

  themeStore.theme = theme
  form.value = { ...theme }
}

// 自定义主题，选择颜色后
function handleColorChange(key, val) {
  themeStore.theme_type = 'self'
  themeStore.theme[key] = val
  variables[key] = val
}

// 监听主题变化，重新挂载变量
watch(() => themeStore.themeStyle, (val) => {
  document.documentElement.style = val
}, {
  immediate: true,
})

onMounted(() => {
  initTheme()
})
</script>

<template>
  <div class="theme-wrapper">
    <hl-icon icon="icon-park-outline:platte" @click="showConfig" />

    <el-drawer v-model="show_config" title="设置主题" size="440px">
      <template #default>
        <div class="card-wrapper">
          <div class="card-title">
            内置主题
          </div>
          <div v-for="(theme, index) in innerTheme" :key="theme.label" class="inner-theme" :class="{ active: index === +themeStore.theme_type }" @click="handleInnerClick(index)">
            <div class="mr-2">
              {{ theme.label }}
            </div>
            <div class="inner-theme-colors">
              <div v-for="color in theme.colors" :key="color" class="color-block" :style="{ backgroundColor: color }" />
            </div>
          </div>
        </div>

        <div class="card-wrapper self-options" :class="{ active: themeStore.theme_type === 'self' }">
          <div class="card-title">
            自定义主题
          </div>
          <div class="flex flex-wrap">
            <div v-for="color in colors_config" :key="color.key" class="self-colors-item">
              <div class="self-title">
                {{ color.label }}
              </div>
              <el-color-picker v-model="form[color.key]" @change="handleColorChange(color.key, form[color.key])" />
              <div class="ml-2">
                {{ form[color.key] }}
              </div>
            </div>
          </div>
        </div>

        <config-item :config-list="side_bg_config" title="侧边栏" />

        <config-item :config-list="tab_bar_config" title="导航栏" />
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.theme-wrapper {
  display: inline-flex;
  position: relative;

  .card-wrapper {
    background-color: #f7f7f7;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--el-border-color);
    margin-bottom: 10px;
    color: #333;
    font-size: 12px;

    .card-title {
      font-size: 14px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .inner-theme {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 5px;
    margin-bottom: 10px;
    border: 1px solid var(--el-border-color);
    background-color: #fff;
    cursor: pointer;

    .inner-theme-colors {
      display: flex;

      $width: 20px;

      & > div {
        width: $width;
        height: $width;
        border-radius: 3px;
        background-color: var(--color-primary);
        margin-right: 10px;
      }
    }
  }

  .inner-theme.active,
  .self-options.active {
    border-color: var(--color-primary);
  }

  .inner-theme:last-child {
    margin-bottom: 0;
  }

  .self-colors-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding-left: 10px;
    width: 50%;

    .self-title {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .self-colors-item:last-child {
    margin-bottom: 0;
  }
}
</style>
