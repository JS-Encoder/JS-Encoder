/**
 * 存储cookie
 * @param String _id
 * @param mixed value
 * @param Number days
 * @param String path
 */
function setCookie (name, value, days, path = '/') {
  name = escape(name)
  value = escape(value)
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 3600000 * 24)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=${path}`
}
/**
 * 获取cookie中的id，用于自动登陆
 * @return String
 */
function getCookieValue (name) {
  name = escape(name)
  let allCookies = document.cookie
  name += '='
  const pos = allCookies.indexOf(name)
  //如果找到了具有该名字的cookie，那么提取并使用它的值
  if (pos > -1) {
    const start = pos + name.length
    let end = allCookies.indexOf(";", start)
    if (end === -1) end = allCookies.length
    const value = allCookies.substring(start, end)
    return unescape(value)
  } else {
    return ''
  }
}
/**
 * 删除cookie
 * @param String name 
 * @param String path 
 */
function deleteCookie (name, path='/') {
  name = escape(name)
  const expires = new Date(0)
  document.cookie = `${name}= ;expires=${expires.toUTCString()};path=${path}`
}

export default {
  setCookie,
  getCookieValue,
  deleteCookie
}