export default {
  path: '/tabs',
  meta: {
    title: 'tabs',
  },
  component: () => import('@views/tabs/Index.vue'),
  children: [
    {
      path: 'home/index',
      component: () => import('@views/tabs/home/Index.vue'),
    },
  ],
}
