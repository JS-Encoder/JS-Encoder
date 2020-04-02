import * as judge from './judgeType'

/**
 * 获取对象的所有键，包括不可枚举的键
 * @param Object obj 
 * @return Array
 */
function getObjAllKeys (obj) {
  const type = judge.judgeType(obj)
  if (type !== 'Object' && type !== 'Array') return []
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
 * 将dom转化为字符串
 * @param Element dom
 * @return domStr
 */
function stringifyDOM (dom) {
  let objE = document.createElement('div')
  objE.appendChild(dom.cloneNode(true))
  const domStr = objE.innerHTML
  objE = dom = null
  return domStr
}
/**
 * 将对象转化成字符串（最顶层的键值对）
 * @param Object stringObject
 * @return String
 */
function JSONStringify (stringObject) {
  const type = judge.judgeType(stringObject)
  if (type !== 'Object' && type !== 'Array') {
    return JSON.stringify(stringObject)
  }

  let prefix = '{', suffix = '}'
  if (type === 'Array') {
    prefix = '['
    suffix = ']'
  }
  let str = prefix

  const keys = getObjAllKeys(stringObject)
  for (let i = 0;i < keys.length;i++) {
    const key = keys[i]
    const value = stringObject[key]
    try {
      // key
      if (type !== 'Array') {
        const keyType = judge.judgeType(key)
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
      let valueType = judge.judgeType(value)
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
 * 检测对象是否为普通对象（不包含window、结点、特殊对象：数组，函数等。。。）
 * @param Object obj
 * @return Boolean
 */
function judgePlainObj (obj) {
  const hasOwnProp = Object.prototype.hasOwnProperty
  if (!obj || typeof obj !== 'object' || obj.nodeType || judgeWindow(obj)) {
    return false
  }
  try {
    if (obj.constructor
      && !hasOwnProp.call(obj, 'constructor')
      && !hasOwnProp.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false
    }
  } catch (e) {
    return false
  }
  let key
  for (key in obj) { }
  return key === undefined || hasOwnProp.call(obj, key)
}
/**
 * 判断数组是否含有的都是基本类型
 * @param Array arr
 * @return Boolean
 */
function judgeBaseArray (arr) {
  let isBase = true
  arr.forEach(item => {
    const type = judge.judgeType(item)
    switch (type) {
      case 'number':
      case 'symbol':
      case null:
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
 * 判断对象是否为window
 * @param Object obj
 * @return Boolean
 */
function judgeWindow (obj) {
  const type = judge.judgeType(obj)
  return type === 'global' || type === 'Window' || type === 'DOMWindow'
}

function judgeDOM (obj) {
  return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
}

export default {
  getObjAllKeys,
  JSONStringify,
  judgePlainObj,
  judgeWindow,
  judgeDOM,
  judgeBaseArray,
  stringifyDOM
}