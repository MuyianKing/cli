<script setup name="HlIcon">
import { getCanUseValue } from '@hl/utils'
import { Icon } from '@iconify/vue'

const props = defineProps({
  size: {
    type: [Number, String],
    default: '18px',
  },
  color: {
    type: String,
    default: '',
  },
})

const _size = computed(() => {
  return getCanUseValue(props.size)
})
</script>

<template>
  <icon class="hl-icon" />
</template>

<style lang="scss" scoped>
.hl-icon {
  font-size: v-bind(_size);
  color: v-bind(color);
}
</style>
