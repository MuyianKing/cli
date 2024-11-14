<script setup>
import HlTop from '../top/Index.vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  noBack: {
    type: Boolean,
    default: false,
  },
  noTop: {
    type: Boolean,
    default: false,
  },
  bodyWrapperClass: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="main-body">
    <hl-top v-if="!noTop" :title="title" :no-back="noBack" />
    <div class="main-body-wrapper" :class="bodyWrapperClass" safe-area-inset-bottom>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-body {
  height: 100%;
  display: flex;
  flex-direction: column;

  .main-body-wrapper {
    flex: 1;
    min-height: 0;
  }
}
</style>
