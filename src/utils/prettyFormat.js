/* eslint-disable */
const formatOptions = {
  indent_size: 2, // tab缩进数
  indent_level: 0, // 缩进等级
  space_in_empty_paren: true,
  preserve_newlines: true // 元素前的换行是否被允许存在
}
class LoadFiles {
  constructor() {
    this.map = {}
  }
  set (k, v) {this.map[k] = v}
  get (k) {return this.map[k]}
}
const loadFiles = new LoadFiles()
function changeFormatOptions(newOption){
  formatOptions[newOption.attr] = newOption.val
}
async function formatHtml (code) { // 格式化HTML
  if (!loadFiles.get('beautifyHtml')) {
    const beautifyHtml = await require('js-beautify').html
    loadFiles.set('beautifyHtml', beautifyHtml)
  }
  return loadFiles.get('beautifyHtml')(code, formatOptions)
}
async function formatCss (code) { // 格式化CSS
  if (!loadFiles.get('beautifyCss')) {
    const beautifyCss = await require('js-beautify').css
    loadFiles.set('beautifyCss', beautifyCss)
  }
  return loadFiles.get('beautifyCss')(code, formatOptions)
}
async function formatJavaScript (code) { // 格式化JS
  if (!loadFiles.get('beautifyJs')) {
    const beautifyJs = await require('js-beautify').js
    loadFiles.set('beautifyJs', beautifyJs)
  }
  return loadFiles.get('beautifyJs')(code, formatOptions)
}

export {
  formatHtml,
  formatCss,
  formatJavaScript,
  changeFormatOptions
}