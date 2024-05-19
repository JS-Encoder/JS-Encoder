import { OriginLang } from "@type/prep"
import { IEditorLibraries } from "@type/settings"

export const genCSSLinksCode = (cssLinks: string[]) => {
  return cssLinks
    .map((link) => `<link href="${link}" rel="stylesheet">`)
    .join("\n")
}

export const genScriptLinksCode = (scriptLinks: string[]) => {
  return scriptLinks
    .map((link) => `<script type="text/javascript" src="${link}"></script>`)
    .join("\n")
}

export interface IGenHTMLCodeOption {
  /** 编辑器代码 */
  code: Partial<Record<OriginLang, string>>
  /** 头部标签 */
  headTags?: string
  /** 外部链接 */
  links?: IEditorLibraries
}

/** 生成完整的HTML文件代码 */
export const genHTMLFileCode = (options: IGenHTMLCodeOption) => {
  const { headTags, links, code } = options
  const { style: styleLinks = [], script: scriptLinks = [] } = links || {}
  const {
    [OriginLang.HTML]: htmlCode = "",
    [OriginLang.CSS]: cssCode = "",
    [OriginLang.JAVASCRIPT]: javascriptCode = "",
  } = code || {}
  const cssLinksCode = genCSSLinksCode(styleLinks)
  const scriptLinksCode = genScriptLinksCode(scriptLinks)
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${headTags}
    ${cssLinksCode}
    ${scriptLinksCode}
    <title></title>
    ${cssCode ? "<style>\n" + cssCode + "\n</style>": ""}
    <body>
    ${htmlCode}
    ${javascriptCode ? "<script>\n" + javascriptCode + "\n</script>": ""}
    </body>
    </html>
  `.trim()
}

export const getMarkdownScriptCode = () => {
  return `
    !function() {
      /** 渲染KaTeX数学公式 */
      renderMathInElement(document.body, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display: false},
          {left: "\\(", right: "\\)", display: false},
          {left: "\\[", right: "\\]", display: true}
        ]
      })
      /** 渲染markdown中的流程图 */
      const flows = document.querySelectorAll(".language-flow")
      for (let i = 0, k = flows.length;i < k;i++) {
        const currentFlow = flows[i]
        const pre = currentFlow.parentNode
        const chartBox = document.createElement("div")
        chartBox.id = "flow"+i
        pre.parentNode.replaceChild(chartBox, pre)
        const code = currentFlow.value || currentFlow.textContent
        flowchart.parse(code).drawSVG("flow"+i)
      }
    }()
  `.trim()
}

export const genErrorOverlayCode = (message: string) => {
  return `
    <div id="errorLayout" style="color: #ff5555;font-family: 'Consolas';box-sizing: border-box;padding: 20px;">
      <span style="font-weight: bold;">Compilation Error:</span>
      <pre style="margin-top: 20px;">${message}</pre>
    </div>
  `.trim()
}