import Loader from './loader'
import parserHTML from 'prettier/parser-html'
import parserMarkdown from 'prettier/parser-markdown'
import parserCSS from 'prettier/parser-postcss'
import parserJavaScript from 'prettier/parser-babel'
import parserPug from '@prettier/plugin-pug'

const formatOptions = {
  useTabs: false, // 使用tab替换空格
  semi: false, // 分号结尾
  singleQuote: true, // 单引号
  tabWidth: 2, // tab对应空格数
}

function changeFormatOptions (newOption) {
  formatOptions[newOption.attr] = newOption.val
}

const loader = new Loader()

const parserMap = {
  HTML: 'html',
  Markdown: 'markdown',
  Pug: 'pug',
  CSS: 'css',
  Sass: 'scss',
  Scss: 'scss',
  Less: 'less',
  Stylus: 'css',
  JavaScript: 'babel',
  TypeScript: 'typescript',
  CoffeeScript: 'babel',
  JSX: 'babel'
}

/**
 * 对于TypeScript的格式化插件使用外部cdn链接引入
 * 这是因为该插件文件过大而为之
 */
const pluginMap = {
  HTML: parserHTML,
  Markdown: parserMarkdown,
  Pug: parserPug,
  CSS: parserCSS,
  Sass: parserCSS,
  Scss: parserCSS,
  Less: parserCSS,
  Stylus: parserCSS,
  JavaScript: parserJavaScript,
  TypeScript: window.prettierPlugins.typescript,
  CoffeeScript: parserJavaScript,
  JSX: parserJavaScript
}

function format (code, mode) {
  let parser = parserMap[mode]
  let plugin = pluginMap[mode]
  if (plugin === null) {
    return code
  }
  if (!loader.has('format')) {
    const format = require('prettier').format
    loader.set('format', format)
  }
  let result = code
  try {
    result = loader.get('format')(code, {
      ...formatOptions,
      parser,
      plugins: [plugin]
    })
  } catch (err) {
    console.log('format error:', err)
  }
  return result
}

export {
  changeFormatOptions,
  format
}