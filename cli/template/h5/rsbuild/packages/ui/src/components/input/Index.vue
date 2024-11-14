<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  rows: {
    type: Number,
    default: 2,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['update:modelValue', 'on-change'])
function handleInput(val) {
  emits('update:modelValue', val.target.value)
  emits('on-change', val.target.value)
}

const placeHolder_str = ref('')
onMounted(() => {
  const instance = getCurrentInstance()
  placeHolder_str.value = props.placeholder || `请输入${instance.parent?.parent?.props?.label || ''}`
})
</script>

<template>
  <div class="relative w-full">
    <van-field v-if="type === 'textarea'" type="textarea" class="input" :clearable="clearable" :disabled="disabled" :model-value="modelValue" :placeholder="placeHolder_str" rows="2" show-word-limit maxlength="50" @input="handleInput" />
    <template v-else>
      <div class="flex items-center w-full h-full">
        <input class="input" :value="modelValue" :readonly="disabled" :placeholder="placeHolder_str" :type="type" @input="handleInput">
        <van-icon v-if="clearable && modelValue" name="close" class="close" @click="$emit('update:modelValue', '')" />
      </div>
    </template>

    <div class="absolute suffix">
      <slot name="suffix" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.close {
  display: flex;
  padding-right: 4px;
  color: #c0c4cc;
}

.input {
  border: none;
  border-radius: 4px;
  width: 100%;
  height: 100%;
}

.input::placeholder {
  color: #c8c9cc;
}

.suffix {
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
}

.van-cell {
  padding: 0;
}

.van-cell:after {
  border: 0;
}

:deep(.van-field__value) {
  margin-top: 0 !important;
}
</style>
