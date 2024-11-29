import { WEB_NAME } from '@app'
import { getUserInfoByToken, hasResource } from '@server/user'
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

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const title = useTitle()
  title.value = `${WEB_NAME} - ${to.meta.title || ''}`

  const userStore = useUserStore()

  const token = hl.common.getUrlParam('token')

  // 判断地址有没有token，有则说明需要是其他项目带token跳转过来的
  if (token) {
    userStore.token = token
    const data = await getUserInfoByToken()

    userStore.initUser({
      ...data.data,
      token: data.token,
    })

    let url = window.location.origin + window.location.pathname
    const hash = window.location.hash.split('?')[0] || ''

    // 调过来的是登录界面：跳转到首页
    if (hash && hash.includes('#/login')) {
      window.location.href = url
    } else {
      // 跳转到指定页面：清除history状态，去掉地址栏token
      url += hash
      window.history.pushState({}, 0, url)
    }
  } else if (to.path === '/login' || to.path === '/register' || to.path === '/forbidden') {
    // 跳到不需要拦截的页面
    next()
  } else if (!userStore.token) {
    // 跳转到其他界面如果没有登录信息，跳转到登录界面
    next({ path: '/login' })
  } else {
    if (canJump(to)) {
      // 初始化动态路由
      const dynamicRouterStore = useDynamicRoutesStore()
      if (dynamicRouterStore.list.length === 0 && to.path !== '/login') {
        await dynamicRouterStore.initDynamicRoutes(router)
        if (from.path === '/login') {
          const first_path = dynamicRouterStore.getFirstRoute()
          if (first_path) {
            next({ path: first_path.path || '/home' })
          } else {
            next({ path: '/forbidden' })
          }
        } else {
          next()
        }
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
