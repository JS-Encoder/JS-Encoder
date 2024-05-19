import JSZip from "jszip"

export interface IZipFile {
  /** 文件名 */
  name: string
  /** 文件内容 */
  content: string
  /** 后缀名 */
  mimeType: string
}

export interface IZipInfo {
  /** zip文件名 */
  name: string
  /** 子文件夹列表 */
  folderList?: IZipInfo[]
  /** 子文件列表 */
  fileList?: IZipFile[]
}

const generateZipFile = (params: IZipInfo) => {
  const zip = new JSZip()
  const generator = (options: IZipInfo, parent: JSZip) => {
    const { name, folderList = [], fileList = [] } = options
    const zipFolder = parent.folder(name)!
    fileList.forEach(({ name: filename, mimeType, content }) => {
      zipFolder.file(`${filename}.${mimeType}`, content)
    })
    folderList.forEach((folder) => generator(folder, zipFolder))
  }
  generator(params, zip)
  return zip.generateAsync({ type: "blob" })
}

const download = (filename: string, blob: Blob) => {
  const href = URL.createObjectURL(blob)
  const aElement = document.createElement("a")
  aElement.download = filename
  aElement.href = href
  aElement.click()
  URL.revokeObjectURL(href)
}

/** 下载单个文件 */
export const downloadFile = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content])
  download(`${filename}.${mimeType}`, blob)
}

/** 下载zip文件 */
export const downloadZip = (params: IZipInfo) => {
  generateZipFile(params).then((blob) => {
    download(params.name, blob)
  })
}