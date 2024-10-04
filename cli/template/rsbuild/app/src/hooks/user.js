/**
 * 清除用户数据
 */
export function clearUserData(router) {
  useUserStore().clearUser()
  useTagsStore().clearTags()
  useDynamicRoutesStore().clearData(router)
}

/**
 * 判断当前用户是否拥有指定的资源
 * @param {string} resource_id 资源ID
 */
export function hasResource(resource_id) {
  const resources_id = useUserStore().resources_id
  return (resource_id && resources_id.includes(resource_id)) || !resource_id
}
