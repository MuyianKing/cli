import { WEB_NAME } from '@app'
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
  if (to.path !== '/login' && to.path !== '/register' && !token) {
    // 跳转到非登录界面如果没有登录信息，跳转到登录界面
    next({ path: '/login' })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
