import { strFromU8, strToU8, unzlibSync, zlibSync } from "fflate"

/** 压缩字符串 */
export const zipString = (data: string) => {
  const buffer = strToU8(data)
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return binary
}

/** 解压字符串 */
export const unzipString = (data: string) => {
  if (!data.startsWith("\x78\xDA")) { return data }
  const buffer = strToU8(data, true)
  const unzipped = unzlibSync(buffer)
  return strFromU8(unzipped)
}

/** copy字符串，兼容http */
export const copyString = (content: string = "") => {
  if (navigator?.clipboard) {
    return navigator.clipboard.writeText(String(content))
  } else {
    return new Promise<void>((resolve, reject) => {
      const copyInput = document.createElement("input")
      document.body.append(copyInput)
      copyInput.setAttribute("value", String(content))
      copyInput.select()
      if (document.execCommand("copy")) {
        resolve()
      } else {
        reject()
      }
      document.body.removeChild(copyInput)
    })
  }
}