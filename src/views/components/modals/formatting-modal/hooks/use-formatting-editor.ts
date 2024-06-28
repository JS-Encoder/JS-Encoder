import { safeJSONParse } from "@utils/tools/common"
import { computed } from "vue"
import stripJsonComments from "strip-json-comments"
import { AnyObject } from "@type/interface"
import { getPrepBaseExtension, getPrepLintExtension } from "@utils/editor/config/editor.config"
import { Prep } from "@type/prep"
import { useCommonStore } from "@store/common"
import { useEditorConfigStore } from "@store/editor-config"

const useFormattingEditor = () => {

  const getFormattingEditorCode = () => {
    const { settings: { formatting: { config } } } = useEditorConfigStore()
    const attrs = Object.entries(config).map(([key, value]) => {
      return `\t"${key}": ${typeof value === "string" ? "\"" + value + "\"": value}`
    })
    return `{\n${attrs.join(",\n")}\n}`
  }

  const formattingEditorExtensions = [
    getPrepBaseExtension(Prep.JSON),
    getPrepLintExtension(Prep.JSON),
  ]

  const formattingEditorSettings = computed<any>(() => {
    const { theme } = useCommonStore()
    return {
      lineNumbers: false,
      lineWrapping: true,
      style: {
        ".cm-scroller": {
          fontSize: "13px",
          fontFamily: "JetBrains Mono",
          height: "200px",
        },
        ".cm-scroller .cm-line": {
          paddingLeft: "4px",
        },
        ".cm-scroller .cm-content": {
          padding: 0,
        },
        "&.cm-focused": {
          outline: "none",
        },
      },
      theme,
    }
  })

  const parseFormattingConfig = async (jsonStr: string) => {
    return safeJSONParse<AnyObject | null>(stripJsonComments(jsonStr) || "{}", null)
  }

  return {
    getFormattingEditorCode,
    formattingEditorExtensions,
    formattingEditorSettings,
    parseFormattingConfig,
  }
}

export default useFormattingEditor