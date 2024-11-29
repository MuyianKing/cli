import { ENV_MODE } from '@app'
import { logout as logoutServer } from '@hl/tyyh'

/**
 * 退出登录
 */
export async function logout(router) {
  try {
    await logoutServer()
    clearUserData(router)
  } catch (error) {
    console.log(error)
  } finally {
    let url = `${window.location.origin}${window.location.pathname}#/login`
    if (ENV_MODE === 'dev') {
      url += '?hl=!@#'
    }

    window.location.href = url
  }
}

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

/**
 * 根据token获取用户信息
 */
export function getUserInfoByToken() {
  return null
}
