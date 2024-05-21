import LoaderService from "@utils/services/loader-service"
import { HIGHLIGHT_JS_URL } from "@utils/tools/config"
import { marked } from "marked"
import { markedHighlight } from "marked-highlight"

const loaderService = new LoaderService()

export const getMarked = async () => {
  if (!window.hljs) {
    await loaderService.loadScript(HIGHLIGHT_JS_URL)
  }
  return marked.use(
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
        const language = window.hljs.getLanguage(lang) ? lang : "plaintext"
        return window.hljs.highlight(code, { language }).value
      },
    }),
  )
}