/* eslint-disable */
import JSZip from 'jszip'
import judgeMode from './judgeMode.js'

async function singleDownLoad(state) {
  // css link
  const cssLinks = state.cssLinks
  let validCss = ''

  if (cssLinks.length) {
    for (let item of cssLinks) {
      if (!item) continue
      if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
        validCss += `<link rel="stylesheet" href="${item}">`
    }
  }

  // js cdn
  const cdnJs = state.cdnJs
  let validCDN = ''
  if (cdnJs.length) {
    for (let item of cdnJs) {
      if (!item) continue
      if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
        validCDN += `<script src="${item}"><\/script>\n\t`
    }
  }

  let codeObj

  await judgeMode(state).then(obj => {
    codeObj = obj
  })

  const aTag = document.createElement('a')
  const htmlCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t${validCss}<title>Document</title>\n\t<style>\n\t${
    codeObj.CSSCode
    }\n\t</style>\n</head>\n<body>\n\t${codeObj.HTMLCode +
    validCDN}\n\t<script>\n\t${
    codeObj.JSCode
    }\n\t<\/script>\n</body>\n</html>`
  let blob = new Blob([htmlCode])
  aTag.download = 'index.html'
  aTag.href = URL.createObjectURL(blob)
  aTag.click()
  URL.revokeObjectURL(blob)
}

async function zipDownLoad(state) {
  // css link
  const cssLinks = state.cssLinks
  let validCss = ''

  if (cssLinks.length) {
    for (let item of cssLinks) {
      if (!item) continue
      if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
        validCss += `<link rel="stylesheet" href="${item}">`
    }
  }

  // js cdn
  const cdnJs = state.cdnJs
  let validCDN = ''
  if (cdnJs.length) {
    for (let item of cdnJs) {
      if (!item) continue
      if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
        validCDN += `<script src="${item}"><\/script>\n\t`
    }
  }

  let codeObj

  await judgeMode(state).then(obj => {
    codeObj = obj
  })

  const zip = new JSZip()
  let code = zip.folder('code')
  const htmlCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t<title>Document</title>\n\t<link rel="stylesheet" href="./index.css">\n</head>\n<body>\n\t${codeObj.HTMLCode +
    validCDN}\n\t<script src="./index.js"><\/script>\n</body>\n</html>`
  const cssCode = codeObj.CSSCode
  const jsCode = codeObj.JSCode
  code.file('index.html', htmlCode)
  code.file('index.css', cssCode)
  code.file('index.js', jsCode)
  zip.generateAsync({ type: 'blob' }).then(function (content) {
    saveAs(content, 'code.zip')
  })
}

export {
  singleDownLoad,
  zipDownLoad
}