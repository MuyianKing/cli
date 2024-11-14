<script setup>
import HlIcon from '../../icon/Index.vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
})

const is_image = computed(() => {
  return props.src?.includes('.') || props.src?.startsWith('data:image')
})
</script>

<template>
  <img v-if="is_image" :src="src" v-bind="$attrs">
  <hl-icon v-else :icon="src" :size="24" v-bind="$attrs" />
</template>

<style lang='scss' scoped></style>
