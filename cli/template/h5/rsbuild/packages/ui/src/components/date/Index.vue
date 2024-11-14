<script setup>
import { useCustomFieldValue } from '@vant/use'
import DateComp from './components/Date.vue'
import TimeComp from './components/Time.vue'
import { getFormat } from './hooks'

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['change'])

const show = ref(false)

const date = ref(dayjs().format('YYYY-MM-DD'))
const time = ref(dayjs().format('HH:mm:ss'))

const modelValue = defineModel({
  type: String,
})

useCustomFieldValue(() => modelValue.value)

// 初始化组件的配置参数
let date_format = 'YYYY-MM-DD'
let time_format = 'HH:mm:ss'
const tabs = []
function init() {
  const format = getFormat(props.format)

  // 日期格式
  date_format = [format.year, format.month, format.day].filter(item => item).join('-')
  date.value = dayjs().format(date_format)

  // 时间格式
  time_format = [format.hour, format.minute, format.second].filter(item => item).join(':')
  time.value = dayjs().format(time_format)

  // picker组
  if (date_format) {
    tabs.push('选择日期')
  }
  if (time_format) {
    tabs.push('选择时间')
  }
}

function handleInput() {
  if (!props.disabled) {
    show.value = true
  }
}

// 确定
const active_tab = ref(0)
function handleConfirm() {
  nextTick(() => {
    modelValue.value = dayjs(date.value + time.value).format(props.format)
    active_tab.value = 0
    emits('change', dayjs(date.value + time.value).format(props.format))
    show.value = false
  })
}

init()
</script>

<template>
  <div class="w-full flex items-center">
    <van-field :model-value="modelValue" :placeholder="placeholder || '请选择'" class="p-0 w-full" readonly clearable @click="handleInput">
      <template v-if="!disabled" #right-icon>
        <van-icon v-if="modelValue" size="14" name="close" @click.stop="modelValue = ''" />
        <van-icon v-else size="14" name="arrow-down" :class="{ active: show }" class="icon" />
      </template>
    </van-field>
    <van-popup v-model:show="show" round position="bottom" teleport="body">
      <van-picker-group v-model:active-tab="active_tab" :title="title" next-step-text="下一步" :tabs @confirm="handleConfirm" @cancel="show = false">
        <date-comp v-if="date_format" v-model="date" :format="date_format" />
        <time-comp v-if="time_format" v-model="time" :format="time_format" />
      </van-picker-group>
    </van-popup>
  </div>
</template>

<style lang='scss' scoped>
.icon {
  transition: all 0.5s;
}

.active {
  transform: rotate(-180deg);
}
</style>
