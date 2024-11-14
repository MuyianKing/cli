/**
 * 定义所有路由path与组件的映射关系
 * key：和统一用户定义的组件路径一致
 * value: 动态引入组件方法
 */
export default {
  '/home/index': () => import('@views/home/Index.vue'),
}
