<script setup>
defineProps({
  menu: {
    type: Object,
    default() {
      return {}
    },
  },
})

const userStore = useUserStore()

function pathResolve(menuItem, filter_iframe) {
  // 新tab打开的路由，配置了index的情况下，点击菜单左侧空白依旧会跳转，所以返回空字符串不让其跳转
  if (filter_iframe && menuItem.is_frame === 2) {
    return ''
  }

  const path = menuItem.path
  // 2-新tab  1-内部iframe
  if (menuItem.is_frame === 2) {
    return appendToken(path)
  } else if (menuItem.is_frame === 1) {
    return `/iframe__${menuItem.resources_id}`
  }

  return path.startsWith('/') ? path : `/${path}`
}

function appendToken(path) {
  if (path.includes('?')) {
    return `${path}&token=${userStore.token}`
  }

  return `${path}?token=${userStore.token}`
}
</script>

<template>
  <template v-if="!menu.meta?.hide">
    <el-sub-menu v-if="menu.children && menu.children.length > 0" :key="menu.path" :index="pathResolve(menu)">
      <template #title>
        <hl-icon v-if="menu.meta?.icon" :icon="menu.meta.icon" class="top-item-icon" />
        <span class="item-title">{{ menu.meta?.title }}</span>
      </template>
      <sub-menu v-for="item in menu.children" :key="item.path" :menu="item" />
    </el-sub-menu>
    <el-menu-item v-else :index="pathResolve(menu, true)">
      <hl-icon v-if="menu.meta?.icon" :icon="menu.meta.icon" class="top-item-icon" />
      <template #title>
        <a v-if="menu.is_frame === 2" :href="pathResolve(menu)" target="_blank" class="item-title a-item" @click.stop>
          {{ menu.meta?.title }}
        </a>
        <span v-else class="item-title">{{ menu.meta?.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<style lang="scss" scoped>
.top-item-icon {
  width: 25px;
  flex-shrink: 0;
  font-size: 20px !important;
  margin-right: 5px;
}

.item-title {
  height: var(--side-menu-item-height);
  line-height: var(--side-menu-item-height);
  font-size: 13px;
}

.a-item {
  color: inherit;
  flex: 1;
}
</style>
