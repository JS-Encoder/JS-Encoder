/* eslint-disable */
const limiteType = [
  'html',
  'css',
  'js',
  'md',
  'sass',
  'scss',
  'less',
  'styl',
  'ts',
  'coffee'
]

async function readFile(file) {
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  return new Promise((resolve, reject) => {
    reader.onload = e => {
      const fileString = e.target.result
      const mimeType = getMimeType(file.name)
      if (mimeType === 'html') {
        const htmlContent = splitHTML(fileString)
        const cssContent = splitCSS(fileString)
        const jsContent = splitJavaScript(fileString)
        const result = {}
        if (htmlContent) {
          result.html = {
            content: htmlContent,
            type: 'html'
          }
        }
        if (cssContent) {
          result.css = {
            content: cssContent,
            type: 'css'
          }
        }
        if (jsContent) {
          result.js = {
            content: jsContent,
            type: 'js'
          }
        }
        resolve(result)
      } else {
        resolve({
          content: fileString,
          type: mimeType
        })
      }
    }
  })
}

function splitHTML(content) {
  const result = /<body[^>]*>([\s\S]*)<\/body>/.exec(content)
  let finCode = ''
  if (result && result.length === 2) finCode = result[1]
  return finCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

function splitCSS(content) {
  let finCode = ''
  const result = /<style>(([\s\S])*?)<\/style>/g.exec(content)
  if (result && result.length >= 2) finCode = result[1]

  const linkList = content.match(/<link.*?(?:>|\/>)/ig)
  const link = []
  if (linkList) {
    for (let i = 0, content; content = linkList[i++];) {
      link.push(splitLink(content))
    }
  }

  return {
    link,
    finCode
  }
}

function splitLink(content) {
  const result = content.match(/<link .*?href=\"(.+?)\"/)
  if (result && result.length === 2) return result[1]
}

function splitJavaScript(content) {
  const scriptList = content.match(/<script.*?(?:>|\/>)\<\/script\>/ig)
  const CDN = []
  if (scriptList) {
    for (let i = 0, content; content = scriptList[i++];) {
      CDN.push(splitScriptSrc(content))
    }
  }

  let finCode = ''
  const codeList = content.match(/<script>([\s\S]+?)<\/script>/ig)
  if (codeList) {
    for (let i = 0, content; content = codeList[i++];) {
      finCode += splitScriptContent(content) + '\n'
    }
  }

  return {
    CDN,
    finCode
  }
}

function splitScriptContent(content) {
  const result = /<script>([\s\S]+?)<\/script>/ig.exec(content)
  if (result && result.length === 2) return result[1]
}

function splitScriptSrc(content) {
  const result = content.match(/<script .*?src=\"(.+?)\"/)
  if (result && result.length === 2) return result[1]
}

function getMimeType(fileName) {
  const pos = fileName.lastIndexOf('.')
  return fileName.substring(pos + 1)
}

export {
  readFile
}