<script setup>
const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  isExt: {
    type: Boolean,
    default: false,
  },
})

const type = computed(() => {
  if (props.isExt) {
    return 'a'
  }
  return 'router-link'
})

function linkProps() {
  if (props.isExt) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: props.to,
  }
}
</script>

<template>
  <component :is="type" v-bind="linkProps()">
    <slot />
  </component>
</template>
