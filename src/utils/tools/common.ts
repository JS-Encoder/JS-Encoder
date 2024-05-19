/**
 * 公共工具方法集合
 */
import { ErrorCode, throwError } from "@utils/tools/error"
import { ObjKey, Type, noop } from "@type/interface"

/**
 * 将dom转换为字符串
 * @param dom 需要转换成字符串的dom
 */
export function stringifyDOM(dom: HTMLElement): string {
  let eDiv: HTMLElement | null = document.createElement("div")
  eDiv.appendChild(dom.cloneNode(true))
  const domStr = eDiv.innerHTML
  eDiv = null
  return domStr
}

/**
 * 直接的深拷贝
 * 由于JSON.stringify固有问题，只能在确保可以直接转换时才可使用
 * @param data 需要深拷贝的数据
 */
export function deepCopy<T>(data: T): T {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 把字符串第一位变成大写，其他为小写
 * @param str 需要处理的字符串
 */
export function firstUpper(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * 将字符串中的特殊字符转义，用于正则表达式中
 * @param str 需要转义的字符串
 */
export function escapeRegExp(str: string): string {
  const regexp = /[\\^$.*+?()[\]{}|]/g
  return str && new RegExp(regexp.source).test(str) ? str.replace(regexp, "\\$&") : str
}

/**
 * 安全解析JSON字符串
 * @param str JSON字符串
 * @param defaultValue 默认解析值
 */
export function safeJSONParse<T>(str: string, defaultValue: any = {}): T {
  try {
    return JSON.parse(str || JSON.stringify(defaultValue))
  } catch (error) {
    throwError(ErrorCode.JSON_PARSE_ERROR, { data: { str } })
    return defaultValue
  }
}

/**
 * 获取数据的数据类型
 * @param data 数据
 */
function getType(data: any): string {
  return Object.prototype.toString.call(data).slice(8, -1)
}

/**
 * 将枚举类型的枚举值转换成数组
 * @param enumType 枚举类型
 */
function switchEnumValueToList(enumType: any): any[] {
  const list: any[] = []
  // eslint-disable-next-line guard-for-in
  for (const i in enumType) {
    list.push(enumType[i])
  }
  return list
}

/**
 * 获取迭代器所有value，生成list
 * @param iterator 需要处理的迭代器
 */
function switchIteratorValueToList(iterator: IterableIterator<any>): any[] {
  const list: any[] = []
  for (; ;) {
    const { value, done } = iterator.next()
    if (done) { break }
    list.push(value)
  }
  return list
}

/**
 * 获取对象的所有键，包括不可枚举的键
 * @param obj 需要处理的对象
 */
export function getObjAllKeys(obj: any): ObjKey[] {
  const type = getType(obj)
  switch (type) {
    case Type.MAP: {
      return switchIteratorValueToList((obj as Map<any, any>).keys())
    }
    case Type.ARRAY: {
      return (obj as any[]).map((_, index) => index)
    }
    default: {
      return type !== Type.OBJECT ? [] : Object.getOwnPropertyNames(obj)
    }
  }
}

/**
 * 获取对象所有自身属性名集合(包括不可枚举)
 * @param obj 需要处理的对象
 */
export function getObjOwnKeyList(obj: any): string[] {
  return Object.getOwnPropertyNames(obj)
}

/**
 * 提供一个数字，提供这个数字及其范围内的数字组成的数组
 * @param digit 数字
 * @param gap 表示包含目标数字周围的多少个数字
 * @param range 范围 包含两个元素[最小值, 最大值]
 * @param type 类型，可选择只要比digit小的值，或比digit大的值，默认全选
 */
export function getRangeNumberList(digit: number, gap: number, range: number[], type?: "min" | "max"): number[] {
  const res = []
  const [min, max] = range
  const realMin = type === "max" ? digit + 1 : digit - gap < min ? min : digit - gap
  const realMax = type === "min" ? digit - 1 : digit + gap > max ? max : digit + gap
  for (let i = realMin; i <= realMax; i++) {
    if (i !== digit) {
      res.push(i)
    }
  }
  return res
}

/** 防抖 */
export const debounce = (cb: noop, delay: number = 0) => {
  let timeoutId: NodeJS.Timeout
  return function(this: any, ...args: any[]): void {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => cb.apply(this, args), delay)
  }
}

export const isHttpUrl = (url: string) => {
  return /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&@=]*)?$/.test(url)
}

/** 获取范围间的随机数 */
export const getRandom = (min: number, max: number): number => {
  const floatRandom = Math.random()
  const difference = max - min
  const random = Math.round(difference * floatRandom)
  const randomWithinRange = random + min
  return randomWithinRange
}