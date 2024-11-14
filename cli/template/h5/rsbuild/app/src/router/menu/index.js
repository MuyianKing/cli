import tabs from './tabbar'

/**
 * 路由配置
 * @type {import('vue-router').RouteRecordRaw[]}
 */
export default [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('@views/login/Index.vue'),
    meta: {
      title: '登录',
    },
  },
  tabs,
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@views/404.vue'),
  },
]
