import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { mimeTypeMap } from './judgeMode'
import { compileHTML, compileCSS, compileJS } from '@utils/compiler'

export default class InstanceDownloader {
  /**
   * @param object code 代码集合
   * @param object links 外部链接
   * @param array prep 预处理
   * @param boolean dwPrep 是否下载未编译版本
   */
  constructor(code, links, prep, dwPrep) {
    this.code = code
    this.links = links
    this.prep = prep
    this.dwPrep = dwPrep
  }
  /**
   * 下载文件
   * @param string type 文件类型 single|multiple
   */
  async handle(type) {
    const { HTML, CSS, JavaScript } = this.code
    const prep = this.prep
    const { cssLinks, JSLinks } = this.links
    const dwPrep = this.dwPrep
    let HTMLCode,
      CSSCode,
      JSCode,
      extCss = '',
      extJS = ''
    await compileHTML(HTML, prep[0]).then((res) => {
      HTMLCode = res
    })
    await compileCSS(CSS, prep[1]).then((res) => {
      CSSCode = res
    })
    await compileJS(JavaScript, prep[2]).then((res) => {
      JSCode = res
    })
    for (let i = 0, k = cssLinks.length; i < k; i++) {
      const linkStr = `\t<link href="${cssLinks[i]}" rel="stylesheet">\n`
      extCss += linkStr
    }
    for (let i = 0, k = JSLinks.length; i < k; i++) {
      const linkStr = `\t<script src="${JSLinks[i]}"></script>\n`
      extJS += linkStr
    }
    if (type === 'single') {
      this.single({ HTMLCode, CSSCode, JSCode }, { extCss, extJS })
      if (dwPrep) {
        const typeObj = this.judgePrep()
        typeObj.html && this.download(HTML, `index.${typeObj.html}`)
        typeObj.css && this.download(CSS, `index.${typeObj.css}`)
        typeObj.js && this.download(JavaScript, `index.${typeObj.js}`)
      }
    } else if (type === 'multiple') {
      this.multiple({ HTMLCode, CSSCode, JSCode }, { extCss, extJS })
    }
  }
  /**
   * 单文件下载
   * @param object code 代码集合
   * @param object links 外部链接字符串集合
   */
  single(code, links) {
    const { HTMLCode, CSSCode, JSCode } = code
    const { extCss = '', extJS = '' } = links
    const htmlCode = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${extCss}
    ${extJS}
    <title></title>
    <style>
    ${CSSCode}
    </style>
    <body>
    ${HTMLCode}
    <script>
    ${JSCode}
    </script>
    </body>
    </html>
    `
    this.download(htmlCode, 'index.html')
  }
  /**
   * 多文件(zip)下载
   * @param object code 代码集合
   * @param object links 外部链接字符串集合
   */
  multiple(code, links) {
    const { HTML, CSS, JavaScript } = this.code
    const { HTMLCode, CSSCode, JSCode } = code
    const { extCss, extJS } = links
    const zip = new JSZip()
    const zipFolder = zip.folder('code')
    const htmlCode = `
    <!DOCTYPE html>
    <html lang="en">                           
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${extCss}
    ${extJS}
    <link rel="stylesheet" href="./index.css">
    <script src="./index.js"><\/script>
    <title></title>
    <body>
    ${HTMLCode}
    </body>
    </html>
    `
    zipFolder.file('index.html', htmlCode)
    zipFolder.file('index.css', CSSCode)
    zipFolder.file('index.js', JSCode)
    const dwPrep = this.dwPrep
    if (dwPrep) {
      const typeObj = this.judgePrep()
      typeObj.html && zipFolder.file(`index.${typeObj.html}`, HTML)
      typeObj.css && zipFolder.file(`index.${typeObj.css}`, CSS)
      typeObj.js && zipFolder.file(`index.${typeObj.js}`, JavaScript)
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // 生成压缩包并下载
      saveAs(content, 'JSEncoderCode.zip')
    })
  }
  /**
   * 下载文件
   * @param string code 代码
   * @param string name 文件名
   */
  download(code, name) {
    const aTag = document.createElement('a') //创建a标签
    let blob = new Blob([code]) // 创建文件流
    aTag.download = name
    aTag.href = URL.createObjectURL(blob) // 创建下载链接
    aTag.click() // 触发a标签点击事件下载文件
    URL.revokeObjectURL(blob)
  }
  judgePrep() {
    const [HTMLPrep, CSSPrep, JSPrep] = this.prep
    const typeObj = {}
    HTMLPrep !== 'HTML' && (typeObj.html = mimeTypeMap[HTMLPrep])
    CSSPrep !== 'CSS' && (typeObj.css = mimeTypeMap[CSSPrep])
    JSPrep !== 'JavaScript' && (typeObj.js = mimeTypeMap[JSPrep])
    return typeObj
  }
}
