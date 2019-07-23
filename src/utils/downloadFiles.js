/* eslint-disable */
import JSZip from 'jszip'
import judgeMode from './judgeMode.js'

async function singleDownLoad(state) {
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
  await judgeMode(state).then(obj => {
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
    `${validCDN}\n`
  '<script>\n' +
    `${codeObj.JSCode}\n` +
    '<\/script>\n' +
    '</body>\n' +
    '</html>'

  const aTag = document.createElement('a')
  let blob = new Blob([htmlCode])
  aTag.download = 'index.html'
  aTag.href = URL.createObjectURL(blob)
  aTag.click()
  URL.revokeObjectURL(blob)
}

async function zipDownLoad(state) {
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

  await judgeMode(state).then(obj => {
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

function judgeFormat(arr, fn) {
  if (arr.length) {
    for (let item of arr) {
      if (!item) continue
      if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
        fn(item)
    }
  }
}

export {
  singleDownLoad,
  zipDownLoad
}