import Layout from '@layout/Main.vue'

// 有左侧菜单
export const menuList = []

export default [{
  path: '/Login',
  component: () => import('@views/Login.vue'),
  meta: {
    title: '登录',
  },
}, {
  path: '/form/editor/index',
  component: () => import('@hl/task/src/views/form/editor'),
  meta: {
    title: '表单编辑',
    icon: 'fluent:settings-24-regular',
  },
}, {
  path: '/task/design',
  redirect: '/task/design/base-config',
  component: () => import('@hl/task/src/views/task/design/index'),
  meta: {
    title: '任务编辑',
    icon: 'fluent:settings-24-regular',
  },
  children: [{
    path: 'base-config',
    component: () => import('@hl/task/src/views/task/design/components/base-config/Index.vue'),
    meta: {
      title: '基础配置',
      icon: 'icon-park-outline:log',
    },
  }, {
    path: 'flow',
    component: () => import('@hl/task/src/views/flow/editor'),
    meta: {
      title: '流程配置',
      icon: 'icon-park-outline:log',
    },
  }],
}, {
  path: '/',
  component: Layout,
  name: 'admin',
  children: menuList,
}, {
  path: '/forbidden',
  component: () => import('@views/403.vue'),
}, {
  path: '/:pathMatch(.*)*',
  component: () => import('@views/404.vue'),
}]
