/** 获取文件后缀 */
export const getFileMimeType = (filename: string): string => {
  const pos = filename.lastIndexOf(".")
  return filename.substring(pos + 1)
}

const enum FileSizeUnit {
  B = "B",
  KB = "KB",
  MB = "MB",
  GB = "GB",
}
const fileSizeUnitList = [
  FileSizeUnit.B,
  FileSizeUnit.KB,
  FileSizeUnit.MB,
  FileSizeUnit.GB,
]
const SIZE_GAP = 1024
/** 获取文件大小文案，如100KB，超过1024则使用更高的单位 */
export const getFileSizeText = (file: File): string => {
  let unitSize = 1
  let sizeText = ""
  for (const unit of fileSizeUnitList) {
    const size = file.size / unitSize
    if (size >= SIZE_GAP) {
      unitSize *= SIZE_GAP
    } else {
      sizeText = size.toFixed(2) + unit
      break
    }
  }
  return sizeText
}

/** 获取文件内容 */
export const getFileContent = async (file: File): Promise<string> => {
  const reader = new FileReader()
  reader.readAsText(file, "UTF-8")
  return new Promise((resolve) => {
    reader.onload = (e) => {
      if (!e.target) {
        console.error(`无法读取文件${file.name}的内容`)
        resolve("")
      } else {
        resolve(e.target.result as string)
      }
    }
  })
}