<script setup>
import { compact } from 'lodash-es'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Array],
    default: '',
  },
  options: {
    type: Array,
    default() {
      return []
    },
  },
  // 排列方式（默认横向） 'vertical' || 'horizontal'
  direction: {
    type: String,
    default: 'horizontal',
  },
  // 图标大小
  iconSize: {
    type: [String, Number],
    default: '20px',
  },
})
const emit = defineEmits(['change', 'update:modelValue'])

// 复选框的值
const checkBoxValue = computed({
  get: () => {
    if (typeof props.modelValue === 'string') {
      return props.modelValue.split(',')
    }
    return props.modelValue
  },
  set: (val) => {
    if (typeof props.modelValue === 'string') {
      return emit('update:modelValue', compact(val).join(','))
    }
    emit('update:modelValue', val)
  },
})
/**
 * 内容发生变化时调用
 * @param {Array} val
 */
function handleChange(val) {
  if (typeof props.modelValue === 'string') {
    return emit('change', val.join(','))
  }
  emit('change', val)
}

/**
 * @type {import('vue').Ref<import('vant').CheckboxGroupInstance>}
 */
const hlCheckBoxRef = ref('')

defineExpose({
  /**
   * 全选 不选 反选
   * @param {boolean | undefined} val
   */
  toggleAll: val => hlCheckBoxRef.value.toggleAll(val),
})
</script>

<template>
  <van-checkbox-group ref="hlCheckBoxRef" v-model="checkBoxValue" :direction="direction" :icon-size="iconSize" shape="square" v-bind="$attrs" @change="handleChange">
    <van-checkbox v-for="item in options" :key="item.value" :name="item.value" class="m-2">
      {{ item.label }}
    </van-checkbox>
  </van-checkbox-group>
</template>

<style lang="scss" scoped>

</style>
