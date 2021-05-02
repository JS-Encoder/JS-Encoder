import Loader from './loader'
const loader = new Loader()
/**
 * 处理实例iframe的代码执行
 */
class IframeHandler {
  constructor(iframe) {
    if (!IframeHandler.instance) {
      this.iframe = iframe
      IframeHandler.instance = this
    }
    return IframeHandler.instance
  }
  /**
   * 向iframe中插入代码
   * @param {object} code 代码集合
   * @param {object} links 外部链接集合
   * @param {boolean} isMD 是否为markdown模式
   * @param {string} headTags 需要添加在头部的标签字符串
   */
  async insertCode (code, links, isMD, headTags = '') {
    const { HTMLCode, CSSCode, JSCode } = code
    const { cssLinks, JSLinks } = links
    const iDoc = this.iframe.contentWindow.document
    let extCss = '',
      extJS = ''
    for (let i = 0, k = cssLinks.length;i < k;i++) {
      const linkStr = `<link href="${cssLinks[i]}" rel="stylesheet">\n`
      extCss += linkStr
    }
    for (let i = 0, k = JSLinks.length;i < k;i++) {
      const linkStr = `<script src="${JSLinks[i]}"></script>\n`
      extJS += linkStr
    }
    iDoc.open()
    iDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${headTags}
    ${extCss}
    ${extJS}
    <title></title>
    <style>
    ${CSSCode}
    </style>
    <body>
    ${HTMLCode}
    </body>
    </html>
    `)
    iDoc.close()
    return new Promise((resolve) => {
      this.iframe.onload = () => {
        if (isMD) {
          this.renderMathFormula()
          this.renderFlowchart()
        }
        resolve(() => {
          this.insertScript(JSCode)
        })
      }
    })
  }
  /**
   * 向iframe中插入script标签
   * @param string JSCode
   */
  insertScript (JSCode) {
    const doc = this.iframe.contentWindow.document
    const script = doc.createElement('script')
    script.text = JSCode
    doc.body.appendChild(script)
  }
  /**
   * 渲染markdown中的数学公式
   */
  async renderMathFormula () {
    const iBody = this.iframe.contentWindow.document.body
    let KaTeX
    if (!loader.get('KaTeX')) {
      // 导入renderMathInElement方法
      KaTeX = (await import('katex/dist/contrib/auto-render')).default
      loader.set('KaTeX', KaTeX)
    } else {
      KaTeX = loader.get('KaTeX')
    }
    KaTeX(iBody, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false },
        { left: '\\[', right: '\\]', display: true },
      ],
    })
  }
  /**
   * 渲染markdown中的流程图
   */
  renderFlowchart () {
    const iframeWindow = this.iframe.contentWindow
    const flows = iframeWindow.document.querySelectorAll('.language-flow')
    for (let i = 0, k = flows.length;i < k;i++) {
      const currentFlow = flows[i]
      const pre = currentFlow.parentNode
      const chartBox = document.createElement('div')
      chartBox.id = `flow${i}`
      pre.parentNode.replaceChild(chartBox, pre)
      const code = currentFlow.value || currentFlow.textContent
      iframeWindow.flowchart.parse(code).drawSVG(`flow${i}`)
    }
  }
  clearIframe () {
    IframeHandler.instance = null
  }
}
export default IframeHandler
