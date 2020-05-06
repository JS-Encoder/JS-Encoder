/* eslint-disable */
import JSZip from 'jszip'
import getCompiledCode from './getCompiledCode'
import { judgeMimeType } from './judgeMode'
import judgeFormat from './judgeUrlFormat'
import store from '../vuex/store'

async function singleDownLoad (unCompiled) {
  const state = store.state
  // css link
  let validCss = ''
  judgeFormat(state.linkList, function (item) {
    validCss += `<link rel="stylesheet" href="${item}">`
  })

  // js cdn
  let validCDN = ''
  judgeFormat(state.CDNList, function (item) {
    validCDN += `<script src="${item}"><\/script>\n\t`
  })

  let codeObj
  await getCompiledCode(state.codeAreaContent, state.preprocess).then(obj => {
    codeObj = obj
  })

  const htmlCode =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '\t<meta charset="UTF-8">\n' +
    '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
    `\t${validCDN}\n` +
    `\t${validCss}\n` +
    '\t<title>Document</title>\n' +
    '\t<style>\n' +
    `\t\t${codeObj.CSSCode}\n` +
    '\t</style>\n' +
    '</head>\n' +
    '<body>\n' +
    `${codeObj.HTMLCode}\n` +
    '<script>\n' +
    `${codeObj.JSCode}\n` +
    '<\/script>\n' +
    '</body>\n' +
    '</html>'

  download(htmlCode, 'index.html')

  if (unCompiled) {
    const typeObj = judgePrep()
    if (typeObj) {
      const code = state.codeAreaContent
      typeObj.html && download(code.HTML, `index.${typeObj.html}`)
      typeObj.css && download(code.CSS, `index.${typeObj.css}`)
      typeObj.js && download(code.JavaScript, `index.${typeObj.js}`)
    }
  }
}

async function zipDownLoad (unCompiled) {
  const state = store.state
  // css link
  let validCss = ''
  judgeFormat(state.linkList, function (item) {
    validCss += `<link rel="stylesheet" href="${item}">`
  })
  // js cdn
  let validCDN = ''
  judgeFormat(state.CDNList, function (item) {
    validCDN += `<script src="${item}"><\/script>\n\t`
  })
  let codeObj
  await getCompiledCode(state.codeAreaContent, state.preprocess).then(obj => {
    codeObj = obj
  })
  // 创建压缩包
  const zip = new JSZip()
  let zipFolder = zip.folder('code')
  const htmlCode =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '\t<meta charset="UTF-8">\n' +
    '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
    `\t${validCss}\n` +
    `\t${validCDN}\n` +
    '\t<link rel="stylesheet" href="./index.css">\n' +
    '\t<script src="./index.js"><\/script>\n' +
    '\t<title>Document</title>\n' +
    '<body>\n' +
    `${codeObj.HTMLCode}\n` +
    '</body>\n' +
    '</html>'
  const cssCode = codeObj.CSSCode
  const jsCode = codeObj.JSCode
  zipFolder.file('index.html', htmlCode)//创建html，css和js文件
  zipFolder.file('index.css', cssCode)
  zipFolder.file('index.js', jsCode)
  if (unCompiled) {//是否下载未编译文件
    const typeObj = judgePrep()//使用了什么预处理语言
    if (typeObj) {
      const code = state.codeAreaContent
      typeObj.html && zipFolder.file(`index.${typeObj.html}`, code.HTML)
      typeObj.css && zipFolder.file(`index.${typeObj.css}`, code.CSS)
      typeObj.js && zipFolder.file(`index.${typeObj.js}`, code.JavaScript)
    }
  }
  zip.generateAsync({ type: 'blob' }).then(content => {// 生成压缩包并下载
    saveAs(content, 'JSEncoderCode.zip')
  })
}
// 下载文件
function download (code, name) {
  const aTag = document.createElement('a') //创建a标签
  let blob = new Blob([code]) // 创建文件流
  aTag.download = name
  aTag.href = URL.createObjectURL(blob) // 创建下载链接
  aTag.click() // 触发a标签点击事件下载文件
  URL.revokeObjectURL(blob)
}

function judgePrep () {
  const preprocess = store.state.preprocess
  const HTMLPrep = preprocess[0]
  const CSSPrep = preprocess[1]
  const JSPrep = preprocess[2]
  const typeObj = {}

  HTMLPrep !== 'HTML' && (typeObj.html = judgeMimeType(HTMLPrep))
  CSSPrep !== 'CSS' && (typeObj.css = judgeMimeType(CSSPrep))
  JSPrep !== 'JavaScript' && (typeObj.js = judgeMimeType(JSPrep))

  return typeObj
}

export {
  singleDownLoad,
  zipDownLoad
}