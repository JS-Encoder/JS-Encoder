/**
 * 配置codemirror编辑器
 * 添加markdown快捷键
 * 修改emmet部分触发机制
 */

import CodeMirror from 'codemirror'
import markdownTools from './markdownTools'
// 语言高亮
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/pug/pug'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/stylus/stylus'
import 'codemirror/mode/coffeescript/coffeescript'
import 'codemirror/mode/stex/stex'
import 'codemirror/addon/mode/multiplex'
// 代码收缩
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/brace-fold'
// 智能提示
import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/anyword-hint'
// 语法检查
import 'codemirror/addon/lint/css-lint'
import 'codemirror/addon/lint/html-lint'
import 'codemirror/addon/lint/javascript-lint.js'
import 'codemirror/addon/lint/coffeescript-lint'
import 'codemirror/addon/lint/lint.js'
// 标签匹配
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/continuelist'
// 搜索
import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/search/jump-to-line'
import 'codemirror/addon/search/matchesonscrollbar'
import 'codemirror/addon/search/match-highlighter'
// 快捷键
import 'codemirror/keymap/sublime'
// 其它
import 'codemirror/addon/comment/comment'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/scroll/scrollpastend'
import 'codemirror/addon/comment/continuecomment'
import 'codemirror/addon/runmode/colorize'
// 格式化
import * as formatter from './codeFormatter'
// 其他工具
import { escapeRegExp } from './tools'
// 导入全局hint
import { JSHINT } from 'jshint'
import { CSSLint } from 'csslint'
import { HTMLHint } from 'htmlhint'
window.JSHINT = JSHINT
window.CSSLint = CSSLint
window.HTMLHint = HTMLHint

// windows or mac
const mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault
const runKey = mac ? 'Cmd' : 'Ctrl'

/**
 * 定义混合模式
 * 为markdown添加LaTeX语法高亮支持
 */
CodeMirror.defineMode('text/md-mix', (config) => {
  const matchStrList = [
    ['$$', '$$'],
    ['\\[', '\\]'],
    ['\\(', '\\)'],
  ]
  const options = []
  for (let item of matchStrList) {
    options.push({
      open: item[0],
      close: item[1],
      mode: CodeMirror.getMode(config, 'stex'),
      delimStyle: 'delimit',
    })
  }
  return CodeMirror.multiplexingMode(CodeMirror.getMode(config, 'text/x-markdown'), ...options)
})
/**
 * 为hint添加更多keywords
 */
const orig = CodeMirror.hint.javascript
const extraJsKeywords = (
  'includes at charAt charCodeAt codePointAt concat indexOf endsWith lastIndexOf match matchAll replace replaceAll repeat startsWith toLocaleLowerCase toLocaleUpperCase toLowerCase toUpperCase trim ' +
  'assign create entries defineProperty defineProperties freeze getOwnPropertyDescriptor getOwnPropertyDescriptors getOwnPropertyNames getOwnPropertySymbols fromEntries is getPrototypeOf isSealed isExtensible isFrozen keys values setPrototypeOf seal preventExtensions'
).split(' ')

CodeMirror.hint.javascript = (cm) => {
  const inner = orig(cm)
  const cur = cm.getCursor(),
    curLine = cm.getLine(cur.line)
  let start = cur.ch,
    end = start
  while (end < curLine.length && /[\w$]+/.test(curLine.charAt(end))) ++end
  while (start && /[\w$]+/.test(curLine.charAt(start - 1))) --start
  const curWord = start != end && curLine.slice(start, end)
  const regex = new RegExp('^' + curWord, 'i')
  const matchList = extraJsKeywords.filter((item) => item.match(regex))
  inner.list = [...inner.list, ...matchList]
  return inner
}
/**
 * 配置编辑器功能及选项
 * @param string mode 语言
 */
function codemirrorConfig(mode = '') {
  const codeOptions = {
    tabSize: 2, // tab缩进数
    mode: '', // 语言
    theme: 'default', // 代码配色主题
    lineNumbers: true, // 显示行号
    matchTags: { bothTags: true }, // 匹配标签
    matchBrackets: true, // 括号匹配
    lineWiseCopyCut: true,
    indentWithTabs: true,
    indentUnit: 2,
    lineWrapping: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    autofocus: true,
    foldGutter: true,
    keyMap: 'sublime',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    styleActiveLine: true,
    scrollPastEnd: true, // 在编辑器底部插入一个编辑器同等高度的空白
    continueComments: true,
    lint: false,
    selfContain: true,
    searchMarkList: [], // 搜索时高亮的mark列表 非原生属性，而是为了保存mark信息自己添加的属性
    searchAnnotate: null, // 搜索时高亮匹配字符对应的滚动条高度位置，非原生属性
    currentMatchIndex: null, // 当前突出搜索匹配字符列表中的第几个，非原生属性
    currentMatchMarker: null, // 当前突出搜索匹配字符的marker，非原生属性
    closeDialog: null, // 用来关闭搜索框的方法，非原生属性
    highlightSelectionMatches: {
      showToken: true,
      annotateScrollbar: true,
    },
    hintOptions: {
      completeSingle: false,
      alignWithWord: false,
    },
    extraKeys: {
      [`${runKey}-Q`]: (cm) => {
        cm.foldCode(cm.getCursor())
      },
      'Shift-Alt-F': (cm) => {
        // 格式化代码
        const code = cm.getValue()
        const cursor = cm.getCursor()
        let finCode = ''
        if (cm.getOption('mode') === 'text/md-mix') {
          return void 0
        } else {
          switch (mode) {
            case 'HTML':
              finCode = formatter.formatHtml(code)
              break
            case 'CSS':
              finCode = formatter.formatCss(code)
              break
            case 'JavaScript':
              finCode = formatter.formatJavaScript(code)
              break
          }
        }
        cm.setValue(finCode)
        cm.setCursor(cursor)
      },
    },
  }
  import('codemirror-emmet').then((emmet) => {
    // 配置html和markdown的emmet
    emmet.default(CodeMirror)
    codeOptions.extraKeys = {
      ...codeOptions.extraKeys,
      Tab: (cm) => {
        /**
         * 处理策略
         * 如果光标选中了任何值，整行缩进
         * 如果当前光标所在编辑窗口为markdown，正常缩进
         * 如果当前行光标左边的一个字符为空或者为tab或空格，进行缩进
         * 如果当前光标所在编辑窗口为html，进行emmet扩展
         * 如果都不满足，按下tab触发自动补全（智能提示）
         */
        function indent() {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
          cm.replaceSelection(spaces, 'end', '+input')
        }
        if (cm.somethingSelected()) {
          // 光标选中文本
          cm.indentSelection('add') // 整行缩进
        } else {
          const cursor = cm.getCursor() // 获取焦点
          const line = cursor.line // 获取光标所在行数
          const ch = cursor.ch // 获取光标位置
          if (ch === 0 || cm.getOption('mode') === 'text/md-mix') {
            indent() // 为markdown
          } else {
            const value = cm.getLine(line) // 获取当前行文本
            const front = value[ch - 1] // 获取光标前一字符
            switch (
              front // 为空格，tab或其他特定字符
            ) {
              case '\t':
              case '<':
              case ' ':
              case "'":
              case '/':
                indent()
                return void 0
            }
            if (cm.getOption('mode') === 'text/html') {
              // 为html
              front === '>' && indent()
              try {
                cm.execCommand('emmetExpandAbbreviation') // emmet扩展
              } catch (err) {
                console.error(err)
              }
            } else {
              cm.showHint()
            }
          }
        }
      },
      [`${runKey}-F`]: (cm) => {
        // 创建搜索窗口，并为元素绑定相应事件，如果窗口已存在，便仅使得搜索框获得焦点，如已选中文本，将文本置入搜索框中
        if (cm.getOption('closeDialog')) {
          const searchInput = document.getElementById('JSEncoderSearchInput')
          let searchStr = cm.getSelection()
          if (!/\n/.test(searchStr)) searchInput['_value'] = searchStr
          searchInput.focus()
          searchInput.select()
          return void 0
        }
        const searchDiv = document.createElement('div')
        searchDiv.innerHTML = `
        <div class="noselect">
          <div class="js-encoder-search-container" id="JSEncoderSearchContainer">
            <input id="JSEncoderSearchInput" type="text" value="" placeholder="search" autocomplete="off">
            <span id="JSEncoderMatchNum">No results</span>
            <i class="icon iconfont icon-shangla i-disable" title="Previous match" id="JSEncoderPreviousMatch"></i>
            <i class="icon iconfont icon-xiala i-disable" title="Next match" id="JSEncoderNextMatch"></i>
            <i class="icon iconfont icon-close2" title="Close" id="JSEncoderClose"></i>
          </div>
        </div>`
        const preI = searchDiv.querySelector('#JSEncoderPreviousMatch')
        const nextI = searchDiv.querySelector('#JSEncoderNextMatch')
        const closeI = searchDiv.querySelector('#JSEncoderClose')
        const searchInput = searchDiv.querySelector('#JSEncoderSearchInput')
        preI.onclick = () => {
          // 向上寻找结果
          const searchMarkList = cm.getOption('searchMarkList')
          let currentMatchIndex = cm.getOption('currentMatchIndex')
          currentMatchIndex = currentMatchIndex <= 1 ? searchMarkList.length : --currentMatchIndex
          cm.setOption('currentMatchIndex', currentMatchIndex)
          const { from, to } = searchMarkList[currentMatchIndex - 1].find()
          cm.scrollIntoView({ from, to })
          let marker = cm.getOption('currentMatchMarker')
          if (marker) marker.clear()
          marker = cm.markText(from, to, {
            className: 'cm-current-searching-match',
          })
          cm.setOption('currentMatchMarker', marker)
          const matchSpan = searchDiv.querySelector('#JSEncoderMatchNum')
          matchSpan.innerText = `${currentMatchIndex} of ${searchMarkList.length}`
        }
        nextI.onclick = () => {
          // 向下寻找结果
          const searchMarkList = cm.getOption('searchMarkList')
          let currentMatchIndex = cm.getOption('currentMatchIndex')
          currentMatchIndex = currentMatchIndex === searchMarkList.length ? 1 : ++currentMatchIndex
          cm.setOption('currentMatchIndex', currentMatchIndex)
          const { from, to } = searchMarkList[currentMatchIndex - 1].find()
          cm.scrollIntoView({ from, to })
          let marker = cm.getOption('currentMatchMarker')
          if (marker) marker.clear()
          marker = cm.markText(from, to, {
            className: 'cm-current-searching-match',
          })
          cm.setOption('currentMatchMarker', marker)
          const matchSpan = searchDiv.querySelector('#JSEncoderMatchNum')
          matchSpan.innerText = `${currentMatchIndex} of ${searchMarkList.length}`
        }
        closeI.onclick = () => {
          // 关闭搜索框
          cm.getOption('closeDialog')()
          cm.setOption('closeDialog', null)
        }
        // 不支持多行匹配，因此在选中多行的时候不会将选中文本置于搜索框内
        let searchStr = cm.getSelection()
        if (/\n/.test(searchStr)) searchStr = ''
        const search = (value) => {
          /**
           * 每次输入时判断searchMarkList和searchAnnotate中是否有值，有就清除上一次查询产生的mark和annotate的背景高亮
           * 查询搜索框内的值，若有匹配结果，则调用markText高亮背景并将相关信息存入searchMarkList以便清除
           * showMatchesOnScrollbar将匹配结果相对文档的位置按比例渲染在滚动条中，将结果存入searchAnnotate以便清除
           */
          let searchMarkList = cm.getOption('searchMarkList')
          if (searchMarkList.length) {
            searchMarkList.forEach((marker) => {
              marker.clear(marker.find())
            })
            cm.setOption('searchMarkList', [])
          }
          const annotate = cm.getOption('searchAnnotate')
          if (annotate !== null) {
            annotate.clear()
            cm.setOption('searchAnnotate', null)
          }
          const matchSpan = searchDiv.querySelector('#JSEncoderMatchNum')
          const setNoResults = () => {
            matchSpan.innerText = 'No results'
            preI.classList.add('i-disable')
            nextI.classList.add('i-disable')
            cm.setOption('currentMatchIndex', null)
          }
          if (value) {
            const regexp = new RegExp(escapeRegExp(value), 'ig')
            const cursor = cm.getSearchCursor(regexp, { line: 0, ch: 0 }, {})
            if (cursor.find(false)) {
              const markList = []
              let from, to
              do {
                from = cursor.from()
                to = cursor.to()
                const marker = cm.markText(from, to, {
                  className: 'cm-searching',
                })
                markList.push(marker)
              } while (cursor.findNext())
              cm.setOption('searchMarkList', markList)
              cm.setOption('currentMatchIndex', 0)
              searchMarkList = cm.getOption('searchMarkList')
              matchSpan.innerText = `${0} of ${searchMarkList.length}`
              preI.classList.remove('i-disable')
              nextI.classList.remove('i-disable')
              const annotate = cm.showMatchesOnScrollbar(regexp, regexp, {
                className: 'CodeMirror-search-match',
              })
              cm.setOption('searchAnnotate', annotate)
            } else {
              setNoResults()
            }
          } else {
            setNoResults()
          }
          const marker = cm.getOption('currentMatchMarker')
          if (marker) marker.clear()
          cm.setOption('currentMatchMarker', null)
        }
        const closeDialog = cm.openDialog(searchDiv, () => {}, {
          closeOnEnter: false, // 回车不会关闭窗口
          closeOnBlur: false, // 失去焦点不会关闭窗口
          onInput: (e) => {
            search(e.target.value)
          },
          onClose: () => {
            const searchMarkList = cm.getOption('searchMarkList')
            if (searchMarkList.length) {
              searchMarkList.forEach((marker) => {
                marker.clear(marker.find())
              })
              cm.setOption('searchMarkList', [])
            }
            const annotate = cm.getOption('searchAnnotate')
            if (annotate !== null) {
              annotate.clear()
              cm.setOption('searchAnnotate', null)
            }
            const marker = cm.getOption('currentMatchMarker')
            if (marker) marker.clear()
            cm.setOption('currentMatchMarker', null)
          },
        })
        // openDialog方法虽然提供了oninput事件，但是我还需要在value改变的情况下就执行搜索，于是需要监听value的改变
        Object.defineProperty(searchInput, '_value', {
          configurable: true,
          set: function(value) {
            this.value = value
            search(value)
          },
          get: function() {
            return this.value
          },
        })
        searchInput['_value'] = searchStr
        cm.setOption('closeDialog', closeDialog)
      },
      [`${runKey}-Enter`]: (cm) => {
        // 引用，无序，有序列表延伸
        if (cm.getOption('mode') === 'text/md-mix') {
          let matchStr = ''
          // 判断开头是'> '还是'- '还是'1. '开头
          if (cm.somethingSelected()) {
            const selectContent = cm.listSelections()[0] // 第一个选中的文本
            let { anchor, head } = selectContent
            // 选中文本时，光标要么在内容前，要么在内容后，需要判断前后位置
            head.line >= anchor.line && head.sticky === 'before' && ([head, anchor] = [anchor, head])
            let { line: preLine, ch: prePos } = head
            const selectVal = cm.getSelection()
            let preStr = cm.getRange({ line: preLine, ch: 0 }, head)
            let preBlank = ''
            if (/^( |\t)+/.test(preStr)) {
              preBlank = preStr.match(/^( |\t)+/)[0]
              preStr = preStr.trimLeft()
            }
            if (/^> /.test(preStr)) {
              // 以'> '开头
              matchStr = '> '
              prePos && (matchStr = `\n${preBlank}${matchStr}${selectVal}\n`) && ++preLine
              cm.replaceSelection(matchStr)
              cm.setCursor({ line: preLine, ch: matchStr.length })
            } else if (/^- /.test(preStr)) {
              // 以'- '开头
              matchStr = '- '
              prePos && (matchStr = `\n${preBlank}${matchStr}${selectVal}\n`) && ++preLine
              cm.replaceSelection(matchStr)
              cm.setCursor({ line: preLine, ch: matchStr.length })
            } else if (/^\d+(\.) /.test(preStr)) {
              let preNumber = 0
              if (/^\d+(\.) /.test(preStr)) {
                // 是否以'数字. '开头，找出前面的数字
                preNumber = Number.parseInt(preStr.match(/^\d+/)[0])
              }
              matchStr = `\n${preBlank}${preNumber + 1}. ${selectVal}\n`
              cm.replaceSelection(matchStr)
              cm.setCursor({ line: preLine + 1, ch: matchStr.length - 2 })
            }
          } else {
            const cursor = cm.getCursor()
            let { line: curLine, ch: curPos } = cursor // 获取光标位置
            let preStr = cm.getRange({ line: curLine, ch: 0 }, cursor)
            let preBlank = ''
            if (/^( |\t)+/.test(preStr)) {
              // 有序列表标识前也许会有空格或tab缩进
              preBlank = preStr.match(/^( |\t)+/)[0]
              preStr = preStr.trimLeft()
            }
            if (/^> /.test(preStr)) {
              // 以'> '开头
              matchStr = '> '
              curPos && (matchStr = `\n${preBlank}${matchStr}\n`) && ++curLine
              cm.replaceSelection(matchStr)
              cm.setCursor({ line: curLine, ch: matchStr.length })
            } else if (/^- /.test(preStr)) {
              // 以'- '开头
              matchStr = '- '
              curPos && (matchStr = `\n${preBlank}${matchStr}\n`) && ++curLine
              cm.replaceSelection(matchStr)
              cm.setCursor({ line: curLine, ch: matchStr.length })
            } else if (/^\d+(\.) /.test(preStr)) {
              // 以'数字. '开头
              let preNumber = 0
              if (/^\d+(\.) /.test(preStr)) {
                // 是否以'数字. '开头，找出前面的数字
                preNumber = Number.parseInt(preStr.match(/^\d+/)[0])
              }
              matchStr = `\n${preBlank}${preNumber + 1}. `
              cm.replaceSelection(matchStr)
              cm.setCursor({ line: curLine + 1, ch: matchStr.length - 1 })
            }
          }
          cm.focus()
        }
      },
      [`${runKey}-B`]: (cm) => {
        // 加粗
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleTextStyle(cm, '**')
      },
      [`${runKey}-I`]: (cm) => {
        // 倾斜
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleTextStyle(cm, '*')
      },
      [`${runKey}-D`]: (cm) => {
        // 删除
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleTextStyle(cm, '~~')
      },
      [`${runKey}-L`]: (cm) => {
        // 插入链接
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleLink(cm)
      },
      [`${runKey}-P`]: (cm) => {
        // 插入图片
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleLink(cm, true)
      },
      [`${runKey}-H`]: (cm) => {
        // 插入横线
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleLine(cm)
      },
      [`${runKey}-K`]: (cm) => {
        // 插入代码
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleTextStyle(cm, '`')
      },
      [`${runKey}-U`]: (cm) => {
        // 插入代码
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleUnorderedList(cm, '- ')
      },
      [`${runKey}-O`]: (cm) => {
        // 插入代码
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleOrderList(cm)
      },
      [`${runKey}-Shift-Q`]: (cm) => {
        // 插入代码
        cm.getOption('mode') === 'text/md-mix' && markdownTools.handleUnorderedList(cm, '> ')
      },
    }
    codeOptions.emmet = {
      markupSnippets: {
        'script:unpkg': 'script[src="https://unpkg.com/"]',
        'script:jsd': 'script[src="https://cdn.jsdelivr.net/npm/"]',
      },
    }
  })
  return codeOptions
}
export default codemirrorConfig
