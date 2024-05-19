import { AnyFunction } from "@type/interface"
import { getObjOwnKeyList } from "@utils/tools/common"
import { getObjType } from "."

export function isElement(data: any): boolean {
  const element = (data as HTMLElement)?.ownerDocument?.defaultView?.HTMLElement
  return !!(element && data instanceof element)
}

export function isUndefined(data: any): boolean {
  return data === undefined
}

export function isNull(data: any): boolean {
  return data === null
}

export function isMac(): boolean {
  return /macintosh|mac os x/i.test(navigator.userAgent)
}

/** 是否本身拥有的属性，不是通过原型链向上查找的 */
export function isOwnAttr(target: Record<string, any>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(target, key)
}

/** 判断对象中是否存在循环引用 */
export function isCyclic(obj: any): boolean {
  const stackSet = new Set()
  const detect = (data: any): boolean => {
    if (typeof data !== "object" || data === null) {
      return false
    }
    if (stackSet.has(data)) {
      return true
    }
    stackSet.add(data)
    // 遍历对象所有自身属性
    getObjOwnKeyList(data).forEach((key) => {
      detect(data[key])
    })

    stackSet.delete(data)
    return false
  }

  return detect(obj)
}

export const isAsyncFn = (fn: AnyFunction): boolean => {
  return getObjType(fn) === "AsyncFunction"
}

export const isGeneratorFn = (fn: AnyFunction): boolean => {
  return getObjType(fn) === "GeneratorFunction"
}

export const isArrowFn = (fn: AnyFunction): boolean => {
  return !(fn.hasOwnProperty("prototype")
    || fn.hasOwnProperty("arguments")
    || fn.hasOwnProperty("caller"))
}