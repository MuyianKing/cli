import { post } from '@utils/request'

/**
 * 登录
 * @param {*} params
 */
export function login(params) {
  return post(hl.api.tyyh.login, params)
}
