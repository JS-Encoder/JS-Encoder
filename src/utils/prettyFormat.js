/* eslint-disable */
const formatOptions = {
  indent_size: 2,
  indent_level: 0,
  space_in_empty_paren: true,
  preserve_newlines: true
}

class LoadFiles {
  constructor() {
    this.map = {}
  }
  set(k, v) {
    this.map[k] = v
  }
  get(k) {
    return this.map[k]
  }
}

const loadFiles = new LoadFiles()

async function formatHtml(code) {
  if (!loadFiles.get('beautifyHtml')) {
    const beautifyHtml = await require('js-beautify').html
    loadFiles.set('beautifyHtml', beautifyHtml)
  }
  return loadFiles.get('beautifyHtml')(code, formatOptions)
}

async function formatCss(code) {
  if (!loadFiles.get('beautifyCss')) {
    const beautifyCss = await require('js-beautify').css
    loadFiles.set('beautifyCss', beautifyCss)
  }
  return loadFiles.get('beautifyCss')(code, formatOptions)
}

async function formatJavaScript(code) {
  if (!loadFiles.get('beautifyJs')) {
    const beautifyJs = await require('js-beautify').js
    loadFiles.set('beautifyJs', beautifyJs)
  }
  return loadFiles.get('beautifyJs')(code, formatOptions)
}

export {
  formatHtml,
  formatCss,
  formatJavaScript
}