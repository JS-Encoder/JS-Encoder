/* eslint-disable */
import qs from 'qs'

function spliceUrl(path, params) {
  // 拼接url
  if (!params) return path
  return path + '?' + Object.keys(params).map(k => {
    return [k, params[k]].join('=')
  }).join('&')
}

function getUrlParams(url) {
  const num = url.indexOf('?')
  if (num < 0) return
  const paramObj = qs.parse(url.substr(num + 1))
  return paramObj
}

export {
  spliceUrl,
  getUrlParams
}