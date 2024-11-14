/**
 * 以对象形式返回格式
 * @param {string} format  格式
 * @returns {object} format
 */
export function getFormat(format) {
  const format_reg = /(?<year>[Y|\d]{0,4}).?(?<month>[M\d]{0,2}).?(?<day>[D\d]{0,2}).?(?<hour>[H\d]{0,2}).?(?<minute>[m\d]{0,2}).?(?<second>[s\d]{0,2})/
  return format_reg.exec(format)?.groups || {}
}

/**
 * 以对象形式返回格式
 * @param {string} format  格式
 * @returns {object} format
 */
export function getDateFormat(format) {
  const format_reg = /(?<year>[Y\d]{0,4}).?(?<month>[M\d]{0,2}).?(?<day>[D\d]{0,2})/
  return format_reg.exec(format)?.groups || {}
}

/**
 * 以对象形式返回格式
 * @param {string} format  格式
 * @returns {object} format
 */
export function getTimeFormat(format) {
  const format_reg = /(?<hour>[H\d]{0,2}).?(?<minute>[m\d]{0,2}).?(?<second>[s\d]{0,2})/
  return format_reg.exec(format)?.groups || {}
}
