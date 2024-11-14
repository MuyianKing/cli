import Layout from '@layout/Main.vue'

export default [{
  path: '/Login',
  component: () => import('@views/Login.vue'),
  meta: {
    title: '登录',
  },
}, {
  path: '/',
  component: Layout,
  name: 'admin',
  redirect: '/home',
  children: [],
}, {
  path: '/forbidden',
  component: () => import('@views/403.vue'),
}, {
  path: '/:pathMatch(.*)*',
  component: () => import('@views/404.vue'),
}]
