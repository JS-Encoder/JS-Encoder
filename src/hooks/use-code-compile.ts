import { useEditorConfigStore } from "@store/editor-config"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { OriginLang, Prep } from "@type/prep"
import { ICompileCodeMapResult, defaultCodeMap, compile, compileComponent } from "@utils/editor/compiler"
import { genHTMLFileCode, getMarkdownScriptCode } from "@utils/tools/code-gen"
import { FLOW_CHART_URLS, KATEX_JS_URL, KATEX_RENDER_URL, KATEX_STYLE_URL } from "@utils/tools/config"

// eslint-disable-next-line max-lines-per-function
const useCodeCompile = () => {
  const editorConfigStore = useEditorConfigStore()
  const editorWrapperStore = useEditorWrapperStore()

  /** 获取编译后的代码 */
  const getCompiledCode = async (): Promise<ICompileCodeMapResult> => {
    const { prepMap } = editorConfigStore
    const { origin2CodeMap, isComponentMode } = editorWrapperStore
    if (isComponentMode) {
      // 组件模式
      return await compileComponent(origin2CodeMap.JAVASCRIPT, prepMap.JAVASCRIPT)
    } else {
      const htmlResult = await compile(origin2CodeMap.HTML, prepMap.HTML)
      if (!htmlResult.success) { return { ...htmlResult, result: defaultCodeMap } }
      const cssResult = await compile(origin2CodeMap.CSS, prepMap.CSS)
      if (!cssResult.success) { return { ...cssResult, result: defaultCodeMap } }
      const javascriptResult = await compile(origin2CodeMap.JAVASCRIPT, prepMap.JAVASCRIPT)
      if (!javascriptResult.success) { return { ...javascriptResult, result: defaultCodeMap } }
      if (prepMap[OriginLang.HTML] === Prep.MARKDOWN) {
        javascriptResult.result = getMarkdownScriptCode() + javascriptResult.result
      }
      const resultCodeMap = {
        [OriginLang.HTML]: htmlResult.result,
        [OriginLang.CSS]: cssResult.result,
        [OriginLang.JAVASCRIPT]: javascriptResult.result,
      }
      return { success: true, result: resultCodeMap }
    }
  }

  const getResultLinks = () => {
    const { prepMap, libraries } = editorConfigStore
    const style = [...libraries.style]
    const script = [...libraries.script]
    if (prepMap[OriginLang.HTML] === Prep.MARKDOWN) {
      style.push(KATEX_STYLE_URL)
      script.push(KATEX_JS_URL, KATEX_RENDER_URL, ...FLOW_CHART_URLS)
    }
    return { style, script }
  }

  const getResultCode = async (compiledCodeMap?: Partial<Record<OriginLang, string>>) => {
    const { settings: { other: { headTags } } } = editorConfigStore
    const code = compiledCodeMap || (await getCompiledCode()).result
    const links = getResultLinks()
    return genHTMLFileCode({
      headTags,
      links,
      code,
    })
  }

  return {
    getCompiledCode,
    getResultCode,
  }
}

export default useCodeCompile