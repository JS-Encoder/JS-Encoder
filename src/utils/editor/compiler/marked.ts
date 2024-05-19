import highlightJS from "highlight.js"
import { marked } from "marked"
import { markedHighlight } from "marked-highlight"
import markedKatex from "marked-katex-extension"

marked.use(
  {
    // 开启异步渲染
    async: true,
    pedantic: false,
    gfm: true,
  },
  // 代码块高亮
  markedHighlight({
    async: true,
    langPrefix: "hljs language-",
    highlight(code: string, lang: string) {
      const language = highlightJS.getLanguage(lang) ? lang : "plaintext"
      return highlightJS.highlight(code, { language }).value
    },
  }),
  // 支持katex公式
  markedKatex({ throwOnError: false }),
)

export default marked