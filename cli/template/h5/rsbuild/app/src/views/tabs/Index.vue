<script setup>
const tabbar_list = ref([
  {
    name: '首页',
    path: '/tabs/home/index',
    inactive: 'ant-design:home-outlined',
  },
  {
    name: '我的',
    path: '/tabs/mine/index',
    inactive: 'icon-park-solid:user',
  },
])
</script>

<template>
  <div class="tabbar-wrapper">
    <div class="content-body">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>

    <hl-tabbar class="tabbar-bottom" :list="tabbar_list" />
  </div>
</template>

<style lang="scss" scoped>
.tabbar-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;

  .content-body {
    flex: 1;
    min-height: 0;
  }

  .tabbar-bottom {
    position: initial;
  }
}
</style>
