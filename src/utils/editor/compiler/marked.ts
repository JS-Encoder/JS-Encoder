import highlightJS from "highlight.js"
import { marked } from "marked"
import { markedHighlight } from "marked-highlight"

export default marked.use(
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
)