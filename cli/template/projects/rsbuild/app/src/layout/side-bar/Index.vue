<script name="Sidebar" setup>
import { WEB_NAME } from '@app'
import SubMenu from '@layout/side-bar/components/SubMenu.vue'
import { hasResource } from '@server/user'
import theme from '@style/theme.module.scss'

const route = useRoute()
const onRoutes = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

/**
 * 根据资源配置生成菜单
 * @param {Array} routes 路由
 */
function createMenuList(routes) {
  const new_routes = []

  routes.forEach((route) => {
    if (hasResource(route.meta?.resource)) {
      const new_route = {
        path: route.path,
        meta: route.meta,
        is_frame: route.is_frame,
        resources_id: route.resources_id,
      }

      if (route.children && route.children.length > 0) {
        new_route.children = createMenuList(route.children)
      }

      // 路由包含组件或者有儿子才渲染
      new_routes.push(new_route)
    }
  })

  return new_routes
}

// 菜单折叠
const collapse = defineModel({
  type: Boolean,
  default: false,
})

const width = computed(() => {
  return collapse.value ? 'calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2)' : theme['side-width']
})

// 菜单
const sideMenu = ref([])
function setMenu() {
  const dynamicRouterStore = useDynamicRoutesStore()
  sideMenu.value = createMenuList(dynamicRouterStore.list)
}

setMenu()

onMounted(() => {
  if (document.body.clientWidth < 1000) {
    collapse.value = !collapse.value
  }
})
</script>

<template>
  <div :style="{ width }" class="anchor-index">
    <el-menu :collapse :default-active="onRoutes" class="sidebar-el-menu" unique-opened router>
      <div class="web-name-wrapper">
        <div v-show="!collapse" class="web-name">
          <el-link :underline="false" class="logo" href="/#/">
            {{ WEB_NAME }}
          </el-link>
        </div>
        <hl-icon :icon="collapse ? 'fa:indent' : 'fa:dedent'" class="collapse-btn" @click="collapse = !collapse" />
      </div>
      <template v-for="item in sideMenu" :key="item.path">
        <sub-menu :menu="item" />
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss" scoped>
.anchor-index {
  user-select: none;
  transition: all linear 0.2s;
}

.sidebar-el-menu {
  position: relative;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;

  &::-webkit-scrollbar {
    width: 0 !important;
  }
}

.web-name-wrapper {
  height: var(--tab-height);
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 5px;

  .web-name {
    min-width: 0;
    display: flex;
    align-items: center;
    flex: 1;
    margin-right: 5px;
  }

  .collapse-btn {
    color: var(--side-light-color);
    cursor: pointer;
    margin-left: 5px;
    font-size: 16px !important;
  }

  .logo {
    color: var(--side-light-color);
    font-size: 20px;
    padding-left: 4px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: var(--side-width);
}

:deep(.el-menu-item) {
  height: var(--side-menu-item-height);

  &:hover {
    color: var(--color-primary);
  }
}

:deep(.el-menu-item.is-active) {
  color: var(--side-light-color);
}

:deep(.el-menu) {
  border-right: 0 !important;
}
</style>
