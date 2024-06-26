import { IConsoleValue } from "@type/console"
import { getObjEntries, getType, isBaseData, parseLink } from "."
import { isElement } from "./judge"

export const processConsoleValueList = (list: any[]) => {
  return list.map((value, index) => {
    const type = getType(value)
    const result = formatConsoleValue(value)
    if (type === "string") {
      if (!index) {
        result.value = value
      }
      const linkPos = parseLink(result.value)
      if (linkPos.length) {
        result.isLink = true
        result.linkPos = linkPos
      }
    }
    return result
  })
}

const listLengthLimit = { minLength: 9, maxLength: 99 }
const recordLengthLimit = { minLength: 5, maxLength: 99 }

// eslint-disable-next-line max-lines-per-function
export const formatConsoleValue = (
  value: any,
  isTable?: boolean,
): IConsoleValue => {
  const type = getType(value)
  let consoleValue: IConsoleValue = {
    type, value,
    ...(isBaseData(value) ? null : { toStringTag: value?.[Symbol.toStringTag] }),
  }

  switch (type) {
    case "Boolean":
    case "boolean":
    case "Number":
    case "number":
    case "symbol":
    case "Promise": {
      // do nothing
      break
    }
    case "String":
    case "string": {
      consoleValue.value = `"${value}"`
      break
    }
    case "undefined": {
      consoleValue.value = isTable ? "" : String(value)
      break
    }
    case "null": {
      consoleValue.value = String(value)
      break
    }
    case "bigint": {
      consoleValue.value = String(value) + "n"
      break
    }
    case "Array": {
      consoleValue = {
        ...consoleValue,
        ...listLengthLimit,
        size: (value as any[]).length,
      }
      break
    }
    case "Map": {
      consoleValue = {
        ...consoleValue,
        ...recordLengthLimit,
        size: (value as Map<any, any>).size,
        attrs: getObjEntries(value),
      }
      break
    }
    case "WeakMap": {
      consoleValue = {
        ...consoleValue,
        ...recordLengthLimit,
      }
      break
    }
    case "Set": {
      consoleValue = {
        ...consoleValue,
        ...listLengthLimit,
        size: (value as Set<any>).size,
        attrs: getObjEntries(value),
      }
      break
    }
    case "WeakSet": {
      consoleValue = {
        ...consoleValue,
        ...listLengthLimit,
      }
      break
    }
    case "NodeList": {
      consoleValue = {
        ...consoleValue,
        ...listLengthLimit,
        size: (value as NodeList).length,
      }
      break
    }
    case "function": {
      consoleValue = {
        ...consoleValue,
        ...listLengthLimit,
        value: value.toString(),
      }
      break
    }
    case "console": {
      const attrs = Reflect.ownKeys(value).map((key: string | symbol) => {
        const newValue = key === "memory"
          ? {
              // @ts-expect-error: memory exist
              jsHeapSizeLimit: console.memory?.jsHeapSizeLimit,
              // @ts-expect-error: memory exist
              totalJSHeapSize: console.memory?.totalJSHeapSize,
              // @ts-expect-error: memory exist
              usedJSHeapSize: console.memory?.usedJSHeapSize,
            }
          : value[key]
        return { key: String(key), value: newValue }
      })
      consoleValue = {
        ...consoleValue,
        ...recordLengthLimit,
        attrs,
        type: "Object",
        name: value?.constructor?.name,
        size: attrs.length,
      }
      break
    }
    default: {
      if (isElement(value)) {
        const attrs = Array
          .from((value as HTMLElement).attributes)
          .map((item) => ({ key: item.name, value: item.value }))
        consoleValue = {
          ...consoleValue,
          ...listLengthLimit,
          attrs,
          type: "Element",
          value: value.toString(),
          name: (value as HTMLElement).nodeName.toLowerCase(),
          size: attrs.length,
          suffix: [
            (value as HTMLElement).id ? `#${(value as HTMLElement).id}` : "",
            (value as HTMLElement).classList?.length
              ? `.${Array.from((value as HTMLElement).classList).join(".")}`
              : "",
          ].join(""),
        }
      } else {
        const attrs = Reflect.ownKeys(value).map((key: string | symbol) => ({
          key: String(key),
          value: value[key],
        }))
        consoleValue = {
          ...consoleValue,
          ...recordLengthLimit,
          attrs,
          type: "Object",
          name: value?.constructor?.name,
          size: attrs.length,
        }
      }
    }
  }
  return consoleValue
}