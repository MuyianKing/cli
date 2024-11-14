<script setup>
import { getDateFormat } from '../hooks'

const props = defineProps({
  format: {
    type: String,
    default: 'YYYY-MM-DD',
  },
})

const model = defineModel()

const columns_type = computed(() => {
  const { year, month, day } = getDateFormat(props.format)
  const _type = []
  year && _type.push('year')
  month && _type.push('month')
  day && _type.push('day')
  return _type
})

function handleChange(val) {
  model.value = dayjs(val.selectedValues.join('')).format(props.format)
}

const date_value = computed(() => {
  const { year, month, day } = getDateFormat(model.value)
  return [year, month, day].filter(item => item)
})
</script>

<template>
  <van-date-picker :model-value="date_value" :columns-type="columns_type" @confirm="handleChange" />
</template>

<style lang='scss' scoped></style>
