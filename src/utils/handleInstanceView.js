import Loader from './loader'
const loader = new Loader()

/**
 * Handling the code execution of the instance iframe
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
   * Insert code into iframe
   * 向iframe中插入代码
   * @param {Object} code 代码集合
   * @param {Object} links 外部链接集合
   * @param {Boolean} isMD 是否为markdown模式
   * @param {String} headTags 需要添加在头部的标签字符串
   * @param {Function} onerror 代码执行异常监听函数
   * @param {Function} onunhandledrejection Promise执行异常监听函数
   */
  async insertCode (code, links, isMD, headTags, onerror, onunhandledrejection) {
    const { HTMLCode, CSSCode, JSCode } = code
    const { cssLinks, JSLinks } = links
    const iWin = this.iframe.contentWindow
    const iDoc = iWin.document
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
    // 在执行js脚本前向iframe注入错误监听回调函数
    iWin.onerror = onerror
    iWin.onunhandledrejection = onunhandledrejection
    iDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${headTags}
    ${extCss}
    <title></title>
    <style>
    ${CSSCode}
    </style>
    <body translate="no">
    ${HTMLCode}
    ${extJS}
    <script>
    ${JSCode}
    </script>
    </body>
    </html>
    `)
    iDoc.close()
    return new Promise((resolve) => {
      // 执行用户在写的onload回调函数
      iWin.onload?.()
      this.iframe.onload = () => {
        if (isMD) {
          this.renderMathFormula()
          this.renderFlowchart()
        }
        resolve(() => {})
      }
    })
  }

  /**
   * Insert script tag into iframe
   * 向iframe中插入script标签
   * @param {String} JSCode
   */
  insertScript (JSCode) {
    const doc = this.iframe.contentWindow.document
    const script = doc.createElement('script')
    script.text = JSCode
    doc.body.appendChild(script)
  }

  /**
   * Render mathematical formulas in markdown
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
   * Render the flowchart in markdown
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
