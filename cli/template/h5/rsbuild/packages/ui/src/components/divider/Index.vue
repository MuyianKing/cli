<script setup>
const props = defineProps({
  contentPosition: {
    type: String,
    default: '',
  },
  bgc: {
    type: String,
    default: '#fff',
  },
})

const _style = computed(() => ({
  justifyCenter: props.contentPosition || 'center',
  borderTopStyle: props.contentPosition || 'solid',
}))
</script>

<template>
  <div class="divider-item" :style="_style">
    <div class="divider-content">
      <slot />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.divider-item {
  border-top: 1px solid #dcdfe6;
  display: flex;
  width: 100%;
  margin-top: 20px;

  .divider-content {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    background-color: v-bind(bgc);
    padding: 0 10px;
    margin: 0 20px;
  }
}
</style>
