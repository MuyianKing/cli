import http from '@http'

/**
 * @param {*} params
 */
export async function getRouters(params = {}) {
  const result = await http.post(hl.api.tyyh.resource, {
    opt: 'resources_menu_ry',
    ...params,
  })

  return result.data || []
}
