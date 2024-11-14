<script setup>
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
    <van-tabbar-item v-for="tabbar in list" :key="tabbar.path" :name="tabbar.path" replace :to="tabbar.path">
      <span>{{ tabbar.name }}</span>
      <template #icon="props">
        <img :src="props.active ? tabbar.active : tabbar.inactive">
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss" scoped></style>
