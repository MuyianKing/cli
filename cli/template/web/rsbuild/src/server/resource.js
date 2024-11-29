import { getResourcesByLabel } from '@hl/tyyh'

/**
 * @param {string} label
 */
export async function getRouters(label) {
  if (!useUserStore().token) {
    return []
  }

  return getResourcesByLabel(label)
}
