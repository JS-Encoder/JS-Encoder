import { useEditorConfigStore } from "@store/editor-config"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { EditorCodeMap } from "@type/editor"
import { Prep } from "@type/prep"
import { formatCode } from "@utils/editor/formatter"
import type { RequiredOptions } from "prettier"

const useCodeFormatting = () => {

  const getFormattingConfig = (): Partial<RequiredOptions> => {
    const { settings: { indent: { indentWithTab, tabSize }, formatting: { config } } } = useEditorConfigStore()
    return {
      ...config,
      useTab: indentWithTab,
      tabWidth: tabSize,
    }
  }

  const formatEditorCode = async (code: string, prep: Prep) => {
    const formattedCode = await formatCode(code, prep, getFormattingConfig())
    return formattedCode
  }

  const formatAllEditorCode = async () => {
    const { tabId2PrepMap, codeMap, updateCodeMap } = useEditorWrapperStore()
    const formattedCodeMap: EditorCodeMap = {}
    for (const [tabId, prep] of Object.entries(tabId2PrepMap)) {
      const code = codeMap[Number(tabId)]
      const formattedCode = await formatEditorCode(code, prep)
      formattedCodeMap[Number(tabId)] = formattedCode
    }
    updateCodeMap(codeMap)
  }

  return {
    getFormattingConfig,
    formatEditorCode,
    formatAllEditorCode,
  }
}

export default useCodeFormatting