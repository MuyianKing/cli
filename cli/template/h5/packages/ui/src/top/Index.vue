<script setup>
const props = defineProps({
  // 标题
  title: {
    type: String,
    default: '',
  },
  noBack: {
    type: Boolean,
    default: false,
  },
  bgc: {
    type: String,
    default: '',
  },
})

const { backFun } = inject('GLOBAL_CUSTOM_CONFIG', null)

function handleBack() {
  if (props.noBack) {
    return
  }

  if (backFun && typeof backFun === 'function') {
    backFun()
    return
  }

  hl.jumper.back()
}
</script>

<template>
  <div class="van-nav-bar">
    <div class="hl-top-empty" safe-area-inset-top />
    <van-nav-bar v-if="!$slots.default" :left-text="title" :left-arrow="!noBack" class="line-clamp-1" @click-left="handleBack" />
    <div @click="handleBack">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-nav-bar {
  background-color: var(--van-primary-color);
  width: 100%;

  :deep(.van-nav-bar__content) {
    .van-nav-bar__arrow,
    .van-nav-bar__text {
      color: white;
    }
  }

  :deep(.van-nav-bar__text) {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    -webkit-line-clamp: 1;
  }
}

.hl-top-empty {
  width: 100vw;
  display: block;
}
</style>
