import html2canvas from 'html2canvas'
import axios from 'axios'
import { get } from './request'
import domPainter from 'dom-painter'

const domPainterConfig = {
  width: 1200,
  height: 666,
  format: 'image/jpeg',
  quality: 0.7,
  links: [],
  fonts: [],
  otherStyles: ''
}

async function getIframeImage (dom) {
  let dataUrl = ''
  // 先使用domPainter进行截图，如果失败，使用html2canvas截图
  try {
    await domPainter(dom, domPainterConfig).then(dataURL => {
      dataUrl = dataURL
    })
  } catch (error) {
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 333
    const content = canvas.getContext("2d")
    content.fillStyle = getComputedStyle(dom, null).backgroundColor
    content.fillRect(0, 0, canvas.width, canvas.height)
    await html2canvas(dom, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      canvas,
      logging: true,
      allowTaint: false
    }).then(canvas => {
      dataUrl = canvas.toDataURL('image/jpeg')
    })
  }
  return dataUrl
}

async function getToken () {
  let token = ''
  await get('/jsEncoder/project/token', {}).then(res => {
    token = res
  })
  return token
}

async function deleteOldPoster (key) {
  let result = ''
  await get('/jsEncoder/project/delFile', {
    params: { key }
  }).then(res => {
    result = res
  })
  return result
}

async function sendImageToQiNiuYun (dataURL, token) {
  const file = dataURLtoFile(dataURL)
  const param = new FormData()
  let imageUrl = ''
  param.append("file", file)
  param.append("token", token)
  await axios({
    method: 'post',
    url: '/qiNiu',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': 'UpToken ' + token
    }
  }).then(res => {
    imageUrl = res.data.key
  })
  return imageUrl
}

// async function screenshotBySVG (iframe) {
//   // 通过svg实现截图
//   const iframeWindow = iframe.contentWindow
//   const iframeDom = iframeWindow.document
//   const { codeAreaContent, preprocess, linkList } = store.state
//   let rules = null
//   let cssStr = ''
//   const style = iframeDom.querySelector('#JSEncoderRunnerCSS')
//   await compileCSS(preprocess[1], codeAreaContent.CSS).then(code => {
//     cssStr = code
//   })
//   let htmlStr = new XMLSerializer().serializeToString(iframeDom.body)
//   const styleSheets = iframeDom.styleSheets
//   console.log(styleSheets)
//   getImgBase64('https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1283473720,778141451&fm=11&gp=0.jpg')
//   for (let i = styleSheets.length - 1;i > 0;i--) {
//     const styleSheet = styleSheets[i]
//     if (styleSheet.ownerNode.id === 'JSEncoderRunnerCSS') {
//       // 由于有多个styleSheet，所以要找到外部style(编辑器内的style样式)规则
//       rules = styleSheet.rules
//       break
//     }
//   }
//   if (linkList.length) {
//     await loadLinkCss(linkList).then(linkCssStr => {
//       cssStr += linkCssStr + '\n'
//     })
//   }
//   const fontUrlList = getFonts(rules)
//   const matchFontList = cssStr.match(/@font-face[ ]*\{[^\}]+\}/)
//   if (matchFontList) {
//     for (let i = matchFontList.length - 1;i >= 0;i--) {
//       cssStr = cssStr.replace(matchFontList[i], '')
//     }
//   }
//   if (fontUrlList.length) { // 获取字体样式
//     await loadFonts(fontUrlList).then(fontStyleStr => {
//       cssStr += fontStyleStr + '\n'
//     })
//   }
//   // 截图并转换成文件
//   let svgUrl = ''
//   svgUrl = await buildSVG({
//     width: 1296,
//     height: 720
//   }, htmlStr, cssStr)
//   return svgUrl
// }

// function getFonts (rules) {
//   const fontUrlList = []
//   for (let i = rules.length - 1;i >= 0;i--) {
//     const rule = rules[i]
//     const type = judgeType(rule)
//     if (type === 'CSSFontFaceRule') {
//       const { src, fontFamily } = rule.style
//       const match = src.match(/url\("([\s\S]*)"\)/)// 取出url字符串中的链接
//       const url = match[1]
//       const format = url.match(/^http(s|):\/\/([\s\S]*).(woff2|woff|ttf|otf|svg|eot)$/)[3]
//       judgeFontsUrl(url) &&
//         (fontUrlList.indexOf(url) < 0) &&
//         fontUrlList.push({ url, format, fontFamily })
//     }
//   }
//   return fontUrlList
// }

// async function loadFonts (fontUrlList) {
//   // 加载外部字体
//   const promises = []
//   let fontStyleStr = ''
//   fontUrlList.forEach(item => {
//     const promise = fetch(item.url, { // 转换url为blob对象
//     }).then(res => res.blob()).then(data => {
//       return new Promise((resolve, reject) => {
//         const fr = new FileReader();
//         fr.onload = e => {
//           resolve(e.target.result)
//         }
//         fr.readAsDataURL(data)
//       })
//     }).then(data => {
//       const { format, fontFamily } = item
//       let fontStr = `\n@font-face {
//         font-family: ${fontFamily};
//         font-style: normal;
//         font-weight: regular;
//         src: url('${data}');
//       }\n`
//       return fontStr
//     })
//     promises.push(promise)
//   })
//   await Promise.all(promises).then(list => {
//     for (let i = list.length - 1;i >= 0;i--) {
//       fontStyleStr += list[i]
//     }
//   })
//   return fontStyleStr
// }

// async function loadLinkCss (linkList) {
//   // 加载外部css
//   const promises = []
//   let linkCssStr = ''
//   linkList.forEach(item => {
//     const promise = fetch(item, { // 转换url为blob对象
//     }).then(res => res.text())
//       .then(data => data)
//     promises.push(promise)
//   })
//   await Promise.all(promises).then(list => {
//     for (let i = list.length - 1;i >= 0;i--) {
//       linkCssStr += list[i]
//     }
//   })
//   return linkCssStr
// }

// function judgeFontsUrl (url) {
//   const reg = /^http(s|):\/\/([\s\S]*).(woff2|woff|ttf|otf|svg|eot)$/
//   return reg.test(url)
// }

// async function buildSVG (size, html, css) {
//   const { width, height } = size
//   let url = ''
//   const htmlStr = `
//   <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n
//     <style>\n
//       ${css}
//     </style>\n
//     <foreignObject width="100%" height="100%">\n
//       ${html}
//     </foreignObject>\n
//   </svg>`
//   const svg = new Blob(htmlStr.split(''), {
//     type: 'image/svg+xml;charset=utf-8'
//   })
//   await blobToDataURL(svg).then(async res => {
//     let canvas = document.createElement('canvas')
//     let ctx = canvas.getContext('2d')
//     const canvasW = document.createAttribute("width")
//     canvasW.nodeValue = width
//     const canvasH = document.createAttribute("height")
//     canvasH.nodeValue = height
//     canvas.setAttributeNode(canvasW)
//     canvas.setAttributeNode(canvasH)
//     ctx.fillStyle = "#fff"
//     ctx.fillRect(0, 0, width, height)
//     return new Promise((resolve, reject) => {
//       const img = new Image()
//       img.crossOrigin = 'Anonymous'
//       img.src = res
//       img.onload = () => {
//         ctx.drawImage(img, 0, 0, width, height)
//         const quality = 0.8
//         url = canvas.toDataURL('image/jpeg', quality)
//         resolve(url)
//       }
//     })
//   })
//   return url
// }

// async function blobToDataURL (blob) {
//   return new Promise((resolve, reject) => {
//     let a = new FileReader()
//     a.onload = async e => { resolve(e.target.result) }
//     a.readAsDataURL(blob)
//   })
// }

// function dataURLtoFile (dataURL, filename = 'file') {
//   let arr = dataURL.split(',')
//   let mime = arr[0].match(/:(.*?);/)[1]
//   let suffix = mime.split('/')[1]
//   let bstr = atob(arr[1])
//   let n = bstr.length
//   let u8arr = new Uint8Array(n)
//   while (n--) {
//     u8arr[n] = bstr.charCodeAt(n)
//   }
//   return new File([u8arr], `${filename}.${suffix}`, {
//     type: mime
//   })
// }

// async function compileCSS (CSSPrep, CSSCode) {
//   switch (CSSPrep) {
//     case 'Sass':
//     case 'Scss':
//       await compiler
//         .compileSass(CSSCode)
//         .then(code => {
//           CSSCode = code
//         })
//         .catch(err => {
//           console.log(err)
//         })
//       break
//     case 'Less':
//       await compiler
//         .compileLess(CSSCode)
//         .then(code => {
//           CSSCode = code.css
//         })
//         .catch(err => {
//           console.log(err)
//         })
//       break
//     case 'Stylus':
//       await compiler
//         .compileStylus(CSSCode)
//         .then(code => {
//           CSSCode = code
//         })
//         .catch(err => {
//           console.log(err)
//         })
//       break
//     default:
//       break
//   }
//   return CSSCode
// }

// function getImgBase64 (imgUrl) {
//   window.URL = window.URL || window.webkitURL
//   var xhr = new XMLHttpRequest()
//   xhr.open("get", imgUrl, true)
//   xhr.responseType = "blob"
//   xhr.onload = function () {
//     if (this.status == 200) {
//       //得到一个blob对象
//       var blob = this.response
//       let oFileReader = new FileReader()
//       oFileReader.onloadend = function (e) {
//         let base64 = e.target.result
//         console.log(base64)
//       }
//       oFileReader.readAsDataURL(blob)
//       let src = window.URL.createObjectURL(blob)
//       console.log(src)
//     }
//   }
//   xhr.send()
// }

export default {
  getIframeImage,
  getToken,
  sendImageToQiNiuYun,
  deleteOldPoster
}