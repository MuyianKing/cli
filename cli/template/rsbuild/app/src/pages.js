/**
 * 定义所有路由path与组件的映射关系
 * key：和统一用户定义的组件路径一致
 * value: 动态引入组件方法
 */
export default {
  // '/task/common-task-page/index': () => import('@hl/task/src/views/task/common-task-page/Index.vue'),
  'task/manage/index': () => import('@hl/task/src/views/task/manage/Index.vue'),
  'task/mould/index': () => import('@hl/task/src/views/task/mould/Index.vue'),
  'task/group/index': () => import('@hl/task/src/views/task/group/Index.vue'),
  'task/center/index': () => import('@hl/task/src/views/task/center/Index.vue'),
}
