<script setup>
const props = defineProps({
  model: {
    type: Object,
    default: null,
  },
})

const _model = computed(() => props.model)
provide('model', _model)

const formRef = ref(null)
defineExpose({
  async validate() {
    try {
      await formRef.value.validate()
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  },
  resetValidation: () => formRef.value.resetValidation(),
})

const $attrs = useAttrs()
</script>

<template>
  <van-form ref="formRef" label-width="100px">
    <slot />
  </van-form>
</template>

<style lang="scss" scoped>
:deep(.van-field__label) {
  width: calc(1px * v-bind('$attrs.labelWidth'));
}
</style>
