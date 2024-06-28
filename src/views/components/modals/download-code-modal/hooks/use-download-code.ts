import { useEditorWrapperStore } from "@store/editor-wrapper"
import { MimeType, OriginLang } from "@type/prep"
import { IZipFile, IZipInfo, downloadFile, downloadZip } from "@utils/tools/download"
import useCodeCompile from "@hooks/use-code-compile"
import { useEditorConfigStore } from "@store/editor-config"
import { prep2MimeTypeMap } from "@utils/tools/prep"

const useDownloadCode = () => {
  const editorWrapperStore = useEditorWrapperStore()
  const editorConfigStore = useEditorConfigStore()
  const { getResultCode, getCompiledCode } = useCodeCompile()

  const getZipInfo = async (filename: string, needCompiled: boolean) => {
    const { origin2CodeMap } = editorWrapperStore
    const { prepMap } = editorConfigStore
    const originFileList = [
      { name: filename, content: origin2CodeMap.HTML, mimeType: prep2MimeTypeMap[prepMap.HTML]! },
      { name: filename, content: origin2CodeMap.CSS, mimeType: prep2MimeTypeMap[prepMap.CSS]! },
      { name: filename, content: origin2CodeMap.JAVASCRIPT, mimeType: prep2MimeTypeMap[prepMap.JAVASCRIPT]! },
    ].filter(({ content }) => !!content)
    let compiledFileList: IZipFile[] = []
    if (needCompiled) {
      const { result: compiledCodeMap } = await getCompiledCode()
      const htmlContent = await getResultCode({ [OriginLang.HTML]: compiledCodeMap.HTML })
      compiledFileList = [
        { name: filename, content: htmlContent, mimeType: MimeType.HTML },
        { name: filename, content: compiledCodeMap.CSS, mimeType: MimeType.CSS },
        { name: filename, content: compiledCodeMap.JAVASCRIPT, mimeType: MimeType.JAVASCRIPT },
      ].filter(({ content }) => !!content)
    }
    const zipInfo: IZipInfo = {
      name: "code",
      fileList: originFileList,
      folderList: needCompiled ? [{ name: "compiled", fileList: compiledFileList }] : [],
    }
    return zipInfo
  }
  const downloadSingleFile = async (filename: string) => {
    const code = await getResultCode()
    downloadFile(filename, code, MimeType.HTML)
  }
  const downloadMultipleFiles = async (filename: string, needCompiled: boolean) => {
    const fileInfo = await getZipInfo(filename, needCompiled)
    downloadZip(fileInfo)
  }
  return {
    downloadSingleFile,
    downloadMultipleFiles,
  }
}

export default useDownloadCode