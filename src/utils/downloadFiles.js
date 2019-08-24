/* eslint-disable */
import JSZip from 'jszip'
import getCompiledCode from './getCompiledCode'
import { judgeMimeType } from './judgeMode'
import judgeFormat from './judgeUrlFormat'

async function singleDownLoad(state, uncompiled) {
  // css link
  let validCss = ''
  judgeFormat(state.cssLinks, function (item) {
    validCss += `<link rel="stylesheet" href="${item}">`
  })

  // js cdn
  let validCDN = ''
  judgeFormat(state.cdnJs, function (item) {
    validCDN += `<script src="${item}"><\/script>\n\t`
  })

  let codeObj
  await getCompiledCode(state).then(obj => {
    codeObj = obj
  })

  const htmlCode =
    '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '\t<meta charset="UTF-8">\n' +
    '\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
    `\t${validCss}` +
    '\t<title>Document</title>\n' +
    '\t<style>\n' +
    `\t\t${codeObj.CSSCode}\n` +
    '\t</style>\n' +
    '</head>\n' +
    '<body>\n' +
    `${codeObj.HTMLCode}\n` +
    `${validCDN}\n` +
    '<script>\n' +
    `${codeObj.JSCode}\n` +
    '<\/script>\n' +
    '</body>\n' +
    '</html>'

  download(htmlCode, 'index.html')

  if (uncompiled) {
    const typeObj = judgePrep(state)
    if (typeObj) {
      const code = state.textBoxContent
      typeObj.html && download(code.HTML, `index.${typeObj.html}`)
      typeObj.css && download(code.CSS, `index.${typeObj.css}`)
      typeObj.js && download(code.JavaScript, `index.${typeObj.js}`)
    }
  }

}

async function zipDownLoad(state, uncompiled) {
  // css link
  let validCss = ''
  judgeFormat(state.cssLinks, function (item) {
    validCss += `<link rel="stylesheet" href="${item}">`
  })

  // js cdn
  let validCDN = ''
  judgeFormat(state.cdnJs, function (item) {
    validCDN += `<script src="${item}"><\/script>\n\t`
  })

  let codeObj

  await getCompiledCode(state).then(obj => {
    codeObj = obj
  })

  const zip = new JSZip()
  let code = zip.folder('code')
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
  code.file('index.html', htmlCode)
  code.file('index.css', cssCode)
  code.file('index.js', jsCode)
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, 'code.zip')
  })
}

function download(code, name) {
  const aTag = document.createElement('a')
  let blob = new Blob([code])
  aTag.download = name
  aTag.href = URL.createObjectURL(blob)
  aTag.click()
  URL.revokeObjectURL(blob)
}

function judgePrep(state) {
  const HTMLPrep = state.HTMLPrep
  const CSSPrep = state.CSSPrep
  const JSPrep = state.JSPrep
  const typeObj = {}

  if (HTMLPrep !== 'HTML') {
    typeObj.html = judgeMimeType(HTMLPrep)
  } else if (CSSPrep !== 'CSS') {
    typeObj.css = judgeMimeType(CSSPrep)
  } else if (JSPrep !== 'JavaScript') {
    typeObj.js = judgeMimeType(JSPrep)
  } else {
    return
  }

  return typeObj
}

export {
  singleDownLoad,
  zipDownLoad
}