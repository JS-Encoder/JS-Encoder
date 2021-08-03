/**
 * 该函数集包含常用的工具函数
 */

/**
 * 防抖函数
 * 多次触发事件后，事件处理函数只执行一次，并且是在触发操作结束时执行
 * 对处理函数进行延时操作，若设定的延时到来之前，再次触发事件，则清除上一次的延时操作定时器，重新定时
 * @param {function} func
 * @param {number} delay
 * @return {function}
 */
function debounce (func, delay) {
  let timer = null
  return function (...params) {
    let self = this
    timer && clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(self, params)
    }, delay)
  }
}
/**
 * 节流函数
 * 触发函数事件后，短时间间隔内无法连续调用，只有上一次函数执行后，过了规定的时间间隔，才能进行下一次的函数调用
 * 对处理函数进行延时操作，通过设定时间片，控制事件函数间断性的触发
 * @param {function} func
 * @param {number} delay
 * @return {function}
 */
function throttle (func, delay) {
  let start = 0
  return (...params) => {
    let now = new Date().getTime()
    let self = this
    if (now > start + delay) {
      func.apply(self, params)
      start = nowF
    }
  }
}
/**
 * 判断数组是否含有的都是基本类型
 * @param {array} arr
 * @return {boolean} isBase
 */
function judgeBaseArray (arr) {
  let isBase = true
  arr.forEach((item) => {
    const type = judgeType(item)
    switch (type) {
      case 'number':
      case 'symbol':
      case null:
      case 'boolean':
      case 'undefined':
      case 'string':
        break
      default:
        isBase = false
    }
  })
  return isBase
}
/**
 * 判断数据的具体类型
 * @param {any} data
 * @return {string} type
 */
function judgeType (data) {
  if (data === null) return 'null'
  const type = typeof data
  if (type === 'object') return judgeObjectType(data)
  return type
}
/**
 * 判断对象的详细类型
 * @param {object} data
 * @return {string}
 */
function judgeObjectType (data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}
/**
 * 将对象转化成字符串（最顶层的键值对）
 * @param {object} strObj
 * @return {string} str
 */
function JSONStringify (strObj) {
  const type = judgeType(strObj)
  if (type !== 'Object' && type !== 'Array' && type !== 'Map') {
    return JSON.stringify(strObj)
  }
  let prefix = '{',
    suffix = '}'
  if (type === 'Array') {
    prefix = '['
    suffix = ']'
  }
  let str = prefix
  const keys = getObjAllKeys(strObj)
  for (let i = 0;i < keys.length;i++) {
    const key = keys[i]
    let value = strObj[key]
    if (type === 'Map') value = strObj.get(key)
    try {
      // key
      if (type !== 'Array') {
        const keyType = judgeType(key)
        switch (keyType) {
          case 'Object':
          case 'Array':
          case 'symbol':
            str += Object.prototype.toString.call(key)
            break
          default:
            str += key
        }
        str += ': '
      }
      // value
      let valueType = judgeType(value)
      if (/^HTML/.test(valueType)) valueType = 'dom'
      switch (valueType) {
        case 'Array':
          str += JSONStringify(value)
          break
        case 'Object':
          str += JSONStringify(value)
          break
        case 'function':
          str += String(value)
          break
        case 'symbol':
          str += String(value)
          break
        case 'dom':
          str += stringifyDOM(value)
          break
        default:
          str += JSON.stringify(value)
      }
      if (i < keys.length - 1) str += ', '
    } catch (e) {
      continue
    }
  }
  str += suffix
  return str
}
/**
 * 将dom转化为字符串
 * @param {element} dom
 * @return {string} domStr
 */
function stringifyDOM (dom) {
  let objE = document.createElement('div')
  objE.appendChild(dom.cloneNode(true))
  const domStr = objE.innerHTML
  objE = dom = null
  return domStr
}
/**
 * 判断对象是否为window
 * @param {object} obj
 * @return {boolean}
 */
function judgeWindow (obj) {
  const type = judgeType(obj)
  return type === 'global' || type === 'Window' || type === 'DOMWindow'
}
/**
 * 获取对象的所有键，包括不可枚举的键
 * @param {object} obj
 * @return {array}
 */
function getObjAllKeys (obj) {
  const type = judgeType(obj)
  if (type === 'Map') {
    const arr = []
    for (let key of obj) {
      const keyType = judgeType(key[0])
      if (keyType !== 'Object' && keyType !== 'Array') {
        arr.push(key[0])
      } else {
        arr.push(key[0])
      }
    }
    return arr
  } else if (type !== 'Object' && type !== 'Array') return []
  if (type === 'Array') {
    const arr = []
    obj.forEach((_, index) => {
      arr.push(index)
    })
    return arr
  }
  return Object.getOwnPropertyNames(obj).sort()
}
/**
 * 复制信息到剪切板
 * @param {string} info
 */
function copyInfo (info) {
  const input = document.createElement('input')
  input.value = info
  document.body.appendChild(input)
  input.select()
  document.execCommand('Copy')
  document.body.removeChild(input)
}
/**
 * 深拷贝
 * 此方法慎用，当对象中包含值为undefined或函数表达式的属性时会自动忽略
 * @param {object|array} target
 * @return {object|array}
 */
function deepCopy (target) {
  return JSON.parse(JSON.stringify(target))
}
/**
 * 将字符串中的特殊字符转义，用于正则表达式中
 * @param {string} str 需要转义的字符串
 * @return {string} str
 */
function escapeRegExp (str) {
  const regexp = /[\\^$.*+?()[\]{}|]/g
  return str && new RegExp(regexp.source).test(str) ? str.replace(regexp, '\\$&') : str
}
/**
 * 判断当前操作系统是否为mac或ios
 * @return {boolean}
 */
function isMac () {
  return /macintosh|mac os x/i.test(navigator.userAgent)
}
module.exports = {
  debounce,
  throttle,
  judgeBaseArray,
  judgeType,
  judgeObjectType,
  JSONStringify,
  stringifyDOM,
  judgeWindow,
  getObjAllKeys,
  copyInfo,
  deepCopy,
  escapeRegExp,
  isMac
}
