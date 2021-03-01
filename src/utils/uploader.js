import { judgeExtension, ModeMimeTypeMap } from './judgeMode'
import { httpUrl } from './regExpList'

/**
 * 获取实例中上传文件列表的内容
 * 由于上传相同类型的文件，后面的文件会覆盖前面文件的内容，因此如果列表中有重复类型的文件，只读取后面文件的内容
 * @param array fileList 文件列表
 */
async function uploader(fileList, isResoleHTML) {
  // 翻转数组，将非重复类型文件内容存入，跳过想同类型文件
  const list = fileList.reverse()
  const fileObj = {}
  for (let i = 0, k = list.length; i < k; i++) {
    const current = fileList[i]
    const extension = getMimeType(current.name)
    const type = judgeExtension(getMimeType(current.name))
    if (!fileObj.hasOwnProperty(type)) {
      await fileReader(current, extension, isResoleHTML).then((res) => {
        fileObj[type] = res
      })
    } else {
      continue
    }
  }
  return fileObj
}

/**
 * 读取文件并获取处理后的文本
 * 如果文件是html，需要把里面的html，css和javascript代码区分开
 * @param {file} file
 * @param {string} extension 文件后缀
 * @param {boolean} isResoleHTML 是否分解html文件
 */
async function fileReader(file, extension, isResoleHTML = true) {
  const reader = new FileReader()
  reader.readAsText(file, 'UTF-8')
  return new Promise((resolve) => {
    reader.onload = (e) => {
      const fileString = e.target.result
      if (extension === 'html' && isResoleHTML) {
        const fileInfo = resolveHTML(fileString)
        resolve({
          content: fileInfo,
          type: 'html',
        })
      } else {
        resolve({
          content: fileString,
          type: ModeMimeTypeMap[extension],
        })
      }
    }
  })
}

/**
 * 分解html
 * 将html文件分解成html，css和js代码
 * 取出里面包含的外部链接
 *  @param string content
 */
function resolveHTML(content) {
  let html, css, js, tmpCode, result
  // html
  result = /<body[^>]*>([\s\S]*)<\/body>/.exec(content)
  if (result && result.length === 2) tmpCode = result[1]
  html = tmpCode.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  // css
  result = /<style>(([\s\S])*?)<\/style>/g.exec(content)
  if (result && result.length >= 2) css = result[1]
  // external css
  const linkList = content.match(/<link.*?(?:>|\/>)/gi)
  const links = []
  if (linkList) {
    let url = ''
    for (let i = 0, content; (content = linkList[i++]); ) {
      result = content.match(/<link .*?href=\"(.+?)\"/)
      if (result && result.length === 2) url = result[1]
      if (httpUrl.test(url)) links.push(url)
    }
  }
  // js
  const codeList = content.match(/<script>([\s\S]+?)<\/script>/gi)
  if (codeList) {
    let code = ''
    for (let i = 0, content; (content = codeList[i++]); ) {
      result = /<script>([\s\S]+?)<\/script>/gi.exec(content)
      if (result && result.length === 2) code = result[1]
      js += code + '\n'
    }
  }
  // external js
  const scriptList = content.match(/<script.*?(?:>|\/>)\<\/script\>/gi)
  const scripts = []
  if (scriptList) {
    let url = ''
    for (let i = 0, content; (content = scriptList[i++]); ) {
      result = content.match(/<script .*?src=\"(.+?)\"/)
      if (result && result.length === 2) url = result[1]
      if (httpUrl.test(url)) scripts.push(url)
    }
  }
  return {
    html,
    css,
    js,
    links,
    scripts,
  }
}

function getMimeType(fileName) {
  const pos = fileName.lastIndexOf('.')
  return fileName.substring(pos + 1)
}

export default uploader
