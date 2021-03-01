/**
 * 格式化代码
 */

import Loader from './loader'

const formatOptions = {
  indent_size: 2, // tab缩进数
  indent_level: 0, // 缩进等级
  space_in_empty_paren: true,
  preserve_newlines: true // 元素前的换行是否被允许存在
}

const loader = new Loader()

function changeFormatOptions (newOption) {
  formatOptions[newOption.attr] = newOption.val
}
function formatHtml (code) {
  if (!loader.get('formatHtml')) {
    const formatHtml = require('js-beautify').html
    loader.set('formatHtml', formatHtml)
  }
  return loader.get('formatHtml')(code, formatOptions)
}
function formatCss (code) {
  if (!loader.get('formatCss')) {
    const formatCss = require('js-beautify').css
    loader.set('formatCss', formatCss)
  }
  return loader.get('formatCss')(code, formatOptions)
}
function formatJavaScript (code) {
  if (!loader.get('formatJs')) {
    const formatJs = require('js-beautify').js
    loader.set('formatJs', formatJs)
  }
  return loader.get('formatJs')(code, formatOptions)
}

export {
  formatHtml,
  formatCss,
  formatJavaScript,
  changeFormatOptions
}