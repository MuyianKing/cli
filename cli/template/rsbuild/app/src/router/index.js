import { WEB_NAME } from '@app'
import { hasResource } from '@server/user'
import NProgress from 'nprogress'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './menu/index'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const router = createRouter({
  history: createWebHashHistory(),
  strict: true,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  NProgress.start()

  const title = useTitle()
  if (to.meta.title) {
    title.value = `${WEB_NAME} - ${to.meta.title || ''}`
  }

  const user = useUserStore()
  const token = user.token

  // 跳到登录页
  if (to.path === '/login' || to.path === '/register' || to.path === '/forbidden') {
    next()
  } else if (!token) {
    // 跳转到非登录界面如果没有登录信息，跳转到登录界面
    next({ path: '/login' })
  } else {
    if (canJump(to)) {
      // 初始化动态路由
      const dynamicRouterStore = useDynamicRoutesStore()
      if (dynamicRouterStore.list.length === 0 && to.path !== '/login') {
        dynamicRouterStore.initDynamicRoutes(router).then(() => {
          if (from.path === '/login') {
            const first_path = dynamicRouterStore.getFirstRoute()
            if (first_path) {
              next({ path: first_path.path })
            } else {
              next({ path: '/forbidden' })
            }
          } else {
            next()
          }
        })
      } else if (to.path === '/') {
        const first_path = dynamicRouterStore.getFirstRoute()
        next({ path: first_path.path })
      } else {
        next()
      }
    } else {
      next({
        path: '/forbidden',
      })
    }
  }
})

// 根据资源判断路由是否可以跳转
function canJump(to) {
  if (hasResource(to.meta.resource)) {
    return true
  }
  return false
}

router.afterEach(() => {
  NProgress.done()
})

export default router
