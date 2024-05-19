import { MimeType, OriginLang, Prep } from "@type/prep"
import { getOriginByMimeType, mimeType2PrepMap } from "@utils/tools/prep"
import { getFileContent, getFileMimeType } from "@utils/tools/file"
import { ref, shallowReactive } from "vue"
import { splitHTML } from "@utils/tools/code-split"
import { initialPrepMap, useEditorConfigStore } from "@store/editor-config"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { IEditorPrepMap } from "@type/settings"
import { deepCopy } from "@utils/tools/common"
import { EditorCodeMap } from "@type/editor"

interface IUploadFileInfo {
  file: File
  mimeType: string
  prep: Prep
  originLang: OriginLang
}

/** 允许上传的文件后缀 */
const allowMimeTypes = Object.values(MimeType)

export const chosenFiles = shallowReactive<File[]>([])
export const setAllowMimeTypeFiles = (files: FileList) => {
  // 判断上传的文件中哪些是符合后缀名要求的
  Array.from(files).forEach((file) => {
    const mimeType = getFileMimeType(file.name)
    if (allowMimeTypes.includes(mimeType as MimeType)) {
      chosenFiles.push(file)
    }
  })
}

/** 是否分解HTML */
export const isSplitHTML = ref<boolean>(true)
/** 获取源(OriginLang)到文件信息的映射 */
const getOrigin2FileInfoMap = (files: File[]) => {
  return files.reduce((acc, file) => {
    const mimeType = getFileMimeType(file.name) as MimeType
    const prep = mimeType2PrepMap[mimeType]
    const originLang = getOriginByMimeType(mimeType)!
    const fileInfo = { file, mimeType, originLang, prep }
    // 在需要分割HTML时，html文件中的CSS和JavaScript代码会覆盖之前上传的同源(OriginLang)文件代码
    if (originLang === OriginLang.HTML && isSplitHTML.value) {
      acc = { [originLang]: fileInfo }
    } else {
      acc[originLang] = fileInfo
    }
    return acc
  }, {} as Partial<Record<OriginLang, IUploadFileInfo>>)
}

/** 处理上传的文件列表，将解析出的信息存储至store */
export const processUploadFiles = async (files: File[]) => {
  const editorConfigStore = useEditorConfigStore()
  const editorWrapperStore = useEditorWrapperStore()
  const { updateCodeMap, origin2TabIdMap } = editorWrapperStore
  const { updatePrepMap, updateLibraries, libraries } = editorConfigStore
  // 由于上传相同类型的文件，后面的文件会覆盖前面文件的内容，因此如果列表中有重复类型的文件，只读取后面文件的内容
  const origin2FileInfoMap = getOrigin2FileInfoMap(files)
  const tmpOrigin2CodeMap: Partial<Record<OriginLang, string>> = {}
  let tmpPrepMap: Partial<IEditorPrepMap> = {}
  const tmpLibraries = deepCopy(libraries)
  for (const fileInfo of Object.values(origin2FileInfoMap)) {
    const fileContent = await getFileContent(fileInfo.file)
    if (fileInfo.prep === Prep.HTML && isSplitHTML.value) {
      // 分解HTML内容并设置到对应的tab中
      const {
        styleLinks,
        styleContent,
        htmlContent,
        scriptLinks,
        scriptContent,
      } = splitHTML(fileContent)
      tmpLibraries.style.push(...styleLinks)
      tmpLibraries.script.push(...scriptLinks)
      tmpOrigin2CodeMap[OriginLang.HTML] = htmlContent
      tmpOrigin2CodeMap[OriginLang.CSS] = styleContent
      tmpOrigin2CodeMap[OriginLang.JAVASCRIPT] = scriptContent
      tmpPrepMap = { ...initialPrepMap }
    } else {
      tmpOrigin2CodeMap[fileInfo.originLang] = fileContent
      tmpPrepMap[fileInfo.originLang] = fileInfo.prep
    }
  }
  updateLibraries(libraries)
  updatePrepMap(tmpPrepMap)
  const tmpCodeMap = Object.entries(tmpOrigin2CodeMap).reduce((acc, [origin, code]) => {
    const tabId = origin2TabIdMap[origin as OriginLang]
    acc[tabId] = code
    return acc
  }, {} as Partial<EditorCodeMap>)
  updateCodeMap(tmpCodeMap)
}