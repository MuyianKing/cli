import { closeToast, showConfirmDialog, showDialog, showFailToast, showLoadingToast, showNotify, showSuccessToast } from 'vant'
import 'vant/es/toast/style'
import 'vant/es/notify/style'
import 'vant/es/dialog/style'

/**
 * loading提示
 * @param {string} message 提示信息
 * @param {object} params 相关配置
 */
export function loading(message, params) {
  return showLoadingToast({
    message: message || '加载中...',
    forbidClick: true,
    duration: 0,
    ...params,
  })
}

export function closeLoading() {
  closeToast()
}

/**
 * 错误提示
 * @param {Error} e
 * @param {string} msg 错误信息
 */
export function error(e, msg) {
  const error_message = e ? (e.error || e.message || '') : ''

  console.log(e)

  showFailToast({
    forbidClick: true,
    message: `${msg ? `${msg}` : ''}${msg && error_message ? '：' : ''}${error_message ? `${error_message}` : ''}`,
  })
}

/**
 * 成功提示
 * @param {*} msg
 * @param {import('vant').ToastOptions & {back: boolean}} params
 */
export function success(msg, params = {}) {
  const duration = params.duration || 2000
  return showSuccessToast({
    message: msg,
    forbidClick: true,
    duration,
    onClose: () => {
      if (params.back) {
        hl.jumper.back()
      }
    },
    ...params,
  })
}

/**
 * 警告提示
 * @param {*} msg
 * @param {import('vant').NotifyOptions} [params]
 */
export function warning(msg, params = {}) {
  return showNotify({
    type: 'warning',
    message: msg,
    forbidClick: true,
    ...params,
  })
}

/**
 * 提示弹窗
 * @param {string} message 提示信息
 * @param {import('vant').DialogOptions & {onClose: () => void}} options
 */
export async function confirmDialog(message, options = {}) {
  showDialog({
    title: '提示',
    message,
    theme: 'round-button',
    ...options,
  }).then(() => {
    // on close
    options.onClose && options.onClose()
  })
}

/**
 * 确认提示
 * @param {string} msg 提示信息
 * @param {import('vant').DialogOptions} params
 */
export async function confirm(msg, params = {}) {
  try {
    await showConfirmDialog({
      message: msg,
      theme: 'round-button',
      ...params,
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
