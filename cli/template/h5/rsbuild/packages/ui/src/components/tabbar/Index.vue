<script setup>
import IconComp from './components/Icon.vue'

defineProps({
  list: {
    type: Array,
    default() {
      return []
    },
  },
})

const active = ref('')
onMounted(() => {
  const route = useRoute()
  active.value = route.fullPath
})
</script>

<template>
  <van-tabbar v-model="active">
    <van-tabbar-item v-for="tabbar in list" :key="tabbar.path" :name="tabbar.path" replace :to="tabbar.path" :badge="tabbar.badge">
      <span>{{ tabbar.name }}</span>
      <template #icon="props">
        <icon-comp :src="props.active ? tabbar.active || tabbar.inactive : tabbar.inactive" :class="{ active: props.active }" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss" scoped>
.active {
  color: var(--color-primary);
}
</style>
