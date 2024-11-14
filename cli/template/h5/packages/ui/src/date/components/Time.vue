<script setup>
import { getTimeFormat } from '../hooks'

const props = defineProps({
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
})
const emits = defineEmits(['confirm'])

const columns_type = computed(() => {
  const { hour, minute, second } = getTimeFormat(props.format)
  const _type = []
  hour && _type.push('hour')
  minute && _type.push('minute')
  second && _type.push('second')
  return _type
})

const model = defineModel()
function handleChange(val) {
  model.value = dayjs(`2020-01-01 ${val.selectedValues.join(':')}`).format(props.format)
  emits('confirm')
}

const time_value = computed(() => {
  const { hour, minute, second } = getTimeFormat(model.value)
  return [hour, minute, second].filter(item => item)
})
</script>

<template>
  <van-time-picker :model-value="time_value" :columns-type="columns_type" @confirm="handleChange" />
</template>

<style lang='scss' scoped></style>
