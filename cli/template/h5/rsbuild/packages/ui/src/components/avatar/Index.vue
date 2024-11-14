<script setup>
import multiavatar from '@multiavatar/multiavatar/esm'

const props = defineProps({
  size: {
    type: Number,
    default: 80,
  },
  src: {
    type: String,
    default: '',
  },
})

const user = useUserStore()
const svgCode = multiavatar(user.name || '用户')

const error = ref(false)
function handleError() {
  error.value = true
}

const _style = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
  }
})
</script>

<template>
  <van-image v-if="!error && src" v-bind="$attrs" :src="src" :style="_style" round @error="handleError" />
  <div v-else v-bind="$attrs" :style="_style" v-html="svgCode" />
</template>

<style lang="scss" scoped>
.svg-avatar {
  width: 100%;
  height: 100%;
}
</style>
