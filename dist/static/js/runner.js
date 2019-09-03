/* eslint-disable */

var consoleInfo = []
window.onerror = function (msg, url, row, col) {
  consoleInfo.push({ data: { msg, url, row, col }, type: 'error' })
  return true
}
if (console) {
  var ableMethods = ['log', 'info', 'dir', 'debug', 'warn', 'error']
  ableMethods.forEach(function (method) {
    console[method] = function (data) {
      let type
      switch (method) {
        case 'log':
          const _type = judgeType(data)
          if (_type === 'Object' && data.type) {
            type = data.type
            data = data.data
          } else {
            type = _type
          }
          data = getContent(data)
          break
        case 'info':
        case 'dir':
          type = judgeType(data)
          data = getContent(data)
          break
        default:
          type = method
      }
      consoleInfo.push({ data, type })
    }
  })
}
document.write = function (data) {
  document.body.innerHTML += data
}

function getContent(data) {
  const type = judgeType(data)
  switch (type) {
    case 'Object':
      data = getObjContent(data)
      break
    case 'Array':
      data = getArrayContent(data)
      break
    case 'Function':
      data = getFunctionContent(data)
      break
  }
  return data
}

function getObjContent(obj) {
  const objAttrList = Object.keys(obj)
  let finStr = ''
  for (let attr of objAttrList) {
    finStr += `\t${attr}: ${obj[attr]}\n`
  }
  return `{\n${finStr}}`
}

function getArrayContent(arr) {
  return arr
}

function getFunctionContent(fn) {
  const length = fn.length
  const name = fn.name
  const prototype = fn.prototype
  const fnAttr = getObjContent({
    length,
    name,
    prototype
  })
  return `${fn}\n${fnAttr}`
}

function judgeType(data) {
  if (data === null) return null
  const type = typeof data
  if (type === 'object') return judgeObjectType(data)
  return type
}

function judgeObjectType(data) {
  return Object.prototype.toString.call(data).slice(8, -1)
}
