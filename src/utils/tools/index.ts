import { AnyArray } from "@type/interface"
import { stringifyDOM } from "@utils/tools/common"

export const basicTypes = [
  "string",
  "number",
  "boolean",
  "bigint",
  "null",
  "undefined",
  "symbol",
]

export const isBaseData = (data: any): boolean => {
  if (data === null) { return true }
  return basicTypes.includes(typeof data)
}

export const getType = (data: any): string => {
  if (data === null) { return "null" }
  let type: string = typeof data
  if (type === "object") {
    type = getObjType(data)
  }
  return type
}

export const getObjType = (data: any): string => {
  return Object.prototype.toString.call(data).slice(8, -1)
}

/** 获取对象的所有键，包括不可枚举的键 */
export function getObjAllKeys(obj: any): AnyArray {
  const type = getType(obj)
  switch (type) {
    case "Map": {
      const arr = []
      for (const key of obj) {
        arr.push(key[0])
      }
      return arr
    }
    case "Set":
    case "Array": {
      const arr: number[] = []
      obj.forEach((_: string, index: number) => {
        arr.push(index)
      })
      return arr
    }
    default: {
      if (type !== "Object" && type !== "Array") {
        return []
      } else {
        return Object.getOwnPropertyNames(obj).sort()
      }
    }
  }
}

/**
 * 由于JSON.stringify固有问题（参考MDN）
 * 因此这里需要polyfill一下来避免
 */
// eslint-disable-next-line max-lines-per-function
export function JSONStringify(data: any): string {
  let prefix = ""; let suffix = ""
  const type = getType(data)

  /** 先根据类型判断需要采用何种格式 */
  switch (type) {
    case "Object": {
      prefix = "{"
      suffix = "}"
      break
    }
    case "Array": {
      prefix = "["
      suffix = "]"
      break
    }
    case "Map": {
      prefix = `Map(${data.size}){`
      suffix = "}"
      break
    }
    case "Set": {
      prefix = `Set(${data.size}){`
      suffix = "}"
      data = [...data]
      break
    }
    case "Error": {
      return `Error: ${JSONStringify(data.message)}`
    }
    case "RegExp": {
      return data.toString()
    }
    default: {
      return JSON.stringify(data)
    }
  }

  let str = prefix
  const keys = getObjAllKeys(data)

  for (const [index, key] of keys.entries()) {
    let value = data[key]
    if (type === "Map") {
      value = data.get(key)
    }
    if (type !== "Array") {
      const keyType = getType(key)
      switch (keyType) {
        case "Object":
        case "Array":
        case "Set":
        case "symbol":
          str += Object.prototype.toString.call(key)
          break
        default:
          str += key
      }
      str += ": "
    }

    let valueType = getType(value)
    if (/^HTML/.test(valueType)) { valueType = "dom" }
    switch (valueType) {
      case "Array":
      case "Object":
        str += JSONStringify(value)
        break
      case "RegExp":
        str += value.toString()
        break
      case "function":
        str += String(value)
        break
      case "symbol":
        str += String(value)
        break
      case "dom":
        str += stringifyDOM(value)
        break
      case "Error":
        str += `Error: ${JSONStringify(value.message)}`
        break
      case "bigint":
        str += `${value.toString()}n`
        break
      case "number":
        str += Object.is(NaN, value) ? "NaN" : JSON.stringify(value)
        break
      default:
        str += JSON.stringify(value)
    }
    if (index < keys.length - 1) { str += ", " }
  }
  str += suffix
  return str
}

/** 获取数组交集 */
export const getArrayIntersection = (arr1: any[], arr2: any[]): any[] => {
  return arr1.filter((item) => arr2.indexOf(item) > -1)
}