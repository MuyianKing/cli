<script setup>
import * as v from '@hl/utils/es/validator'
import { get } from 'lodash-es'

const props = defineProps({
  prop: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  // 必填
  required: {
    type: Boolean,
    default: false,
  },
  // 身份证号
  idCard: {
    type: Boolean,
    default: false,
  },
  // 整型
  integer: {
    type: Boolean,
    default: false,
  },
  // 手机号
  phone: {
    type: Boolean,
    default: false,
  },
  // 车牌号
  carNum: {
    type: Boolean,
    default: false,
  },
  // IP地址
  ip: {
    type: Boolean,
    default: false,
  },
  // 端口
  port: {
    type: Boolean,
    default: false,
  },
  // 最大长度
  maxLength: {
    type: [Number, String],
    default: '',
  },
  // 最小长度
  minLength: {
    type: [Number, String],
    default: 0,
  },
  // 校验触发方式
  trigger: {
    type: String,
    default: 'change',
  },
  // 是否显示字数统计
  showWordLimit: {
    type: Boolean,
    default: false,
  },
  // 自定义校验规则
  rules: {
    type: [Object, Array],
    default() {
      return null
    },
  },
  labelWidth: {
    type: [String, Number],
    default: '',
  },
})

const trigger_map = {
  blur: 'onChange',
  change: 'onChange',
  submit: 'obSubmit',
}

// 验证最大长度
function vMaxLPass(value) {
  const maxLength = Number.parseFloat(props.maxLength)
  if (value.toString().length > maxLength) {
    return `最大长度为${maxLength}`
  }
  return true
}

// 验证最小长度
function vMinLPass(value) {
  const minLength = Number.parseFloat(props.minLength)
  if (value.toString().length < minLength) {
    return `最小长度为${minLength}`
  }
  return true
}

const rules_comp = computed(() => {
  let rules_list = []

  // 自定义的校验规则
  if (props.rules) {
    rules_list = Array.isArray(props.rules) ? props.rules : [props.rules]
  }

  const message = `请填写${_label.value}`
  const trigger = trigger_map[props.trigger || 'blur']

  // 必填
  if (props.required) {
    rules_list.push({ required: true, message, trigger })
  }

  if (props.idCard) {
    rules_list.push({ validator: v.v_id_num, trigger })
  }

  // 手机号
  if (props.phone) {
    rules_list.push({ validator: v.v_phone, trigger })
  }

  // 车牌
  if (props.carNum) {
    rules_list.push({ validator: v.v_carnum, trigger })
  }

  // 整型
  if (props.integer) {
    rules_list.push({ validator: v.v_int, trigger })
  }

  // IP
  if (props.ip) {
    rules_list.push({ validator: v.v_ip, trigger })
  }

  // 端口
  if (props.port) {
    rules_list.push({ validator: v.v_port, trigger })
  }

  // 最小长度
  if (props.minLength) {
    rules_list.push({ validator: vMinLPass, trigger })
  }

  // 最大长度
  if (props.maxLength) {
    rules_list.push({ validator: vMaxLPass, trigger })
  }

  return rules_list
})

// 监听属性变化，检验
const modelValue = ref('')
const field_ref = ref()

const model = inject('model')
watch(() => get(model.value, props.prop), (val) => {
  if (Array.isArray(val)) {
    // vant输入框时不支持数组类型的绑定
    modelValue.value = JSON.stringify(val)
  } else {
    modelValue.value = val
  }

  if (val) {
    field_ref.value?.validate()
  }
}, {
  deep: true,
})

const _label = computed(() => {
  return props.label.replace(/[:：]/g, '')
})
</script>

<template>
  <van-field v-if="labelWidth !== ''" v-bind="$attrs" ref="field_ref" :name="prop" :label="label" :rules="rules_comp" :model-value="modelValue" required="auto" :show-word-limit="showWordLimit" :label-width label-align="right">
    <template v-if="$slots.default" #input>
      <slot />
    </template>
  </van-field>
  <van-field v-else v-bind="$attrs" ref="field_ref" :name="prop" :label="label" :rules="rules_comp" :model-value="modelValue" required="auto" :show-word-limit="showWordLimit" label-align="right">
    <template v-if="$slots.default" #input>
      <slot />
    </template>
  </van-field>
</template>

<style lang="scss" scoped>
.van-field {
  align-items: baseline;
}
</style>
