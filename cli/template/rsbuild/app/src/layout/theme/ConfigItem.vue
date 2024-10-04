<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '标题',
  },
  labelWidth: {
    type: String,
    default: '4em',
  },
  configList: {
    type: Array,
    default() {
      return []
    },
  },
  reset: {
    type: Boolean,
    default: true,
  },
})

const themeStore = useThemeStore()

function handleChange(key, val) {
  themeStore.theme[key] = val
}

// 重置
function handelReset() {
  props.configList.forEach((item) => {
    themeStore.theme[item.key] = hl.variables[item.key]
  })
}
</script>

<template>
  <div class="card-wrapper self-options">
    <div class="card-title">
      <span>{{ title }}</span>
      <hl-icon v-if="reset" icon="ion:refresh-outline" class="cursor-pointer" title="重置" style="font-size: 20px;" @click="handelReset" />
    </div>
    <div class="flex flex-wrap pl-2 justify-between">
      <div v-for="config in configList" :key="config.key" class="inline-config">
        <div class="label-style">
          {{ config.label }}
        </div>
        <el-input v-if="config.type === 'input'" :model-value="themeStore.theme[config.key]" @input="val => handleChange(config.key, val)" />
        <template v-else>
          <el-color-picker :model-value="themeStore.theme[config.key]" @change="val => handleChange(config.key, val)" />
          <div class="ml-2">
            {{ themeStore.theme[config.key] }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.inline-config {
  display: flex;
  align-items: center;
  width: 45%;
  margin: 5px 0;
}

.label-style {
  width: v-bind(labelWidth);
  flex-shrink: 0;
  margin-right: 5px;
}

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
</style>
