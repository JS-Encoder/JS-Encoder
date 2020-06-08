/* eslint-disable */
import CodeMirror from 'codemirror'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/css/css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/sass/sass'
import 'codemirror/mode/stylus/stylus'
import 'codemirror/mode/coffeescript/coffeescript'

import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/xml-fold'
import 'codemirror/addon/fold/markdown-fold'
import 'codemirror/addon/fold/brace-fold'

import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/anyword-hint'

import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/continuelist'

import 'codemirror/addon/comment/comment'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/keymap/sublime'

import 'codemirror/addon/search/search'
import 'codemirror/addon/search/searchcursor'
import 'codemirror/addon/dialog/dialog'
import 'codemirror/addon/search/jump-to-line'

import * as format from '../utils/prettyFormat'
import markdownTools from '../utils/markdownTools'

const mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault
const runKey = mac ? "Cmd" : "Ctrl"

/**
 * 配置codemirror编辑器
 * @param string mode 语言类型
 */
export default function (mode = '') {
  const cmOptions = {// codemirror编辑配置
    tabSize: 2,// tab缩进数
    mode: '',// 语言
    theme: 'monokai',// 代码配色主题
    lineNumbers: true,
    matchTags: { bothTags: true },
    matchBrackets: true,
    lineWiseCopyCut: true,
    indentWithTabs: true,
    indentUnit: 2,
    lineWrapping: false,
    autoCloseTags: true,
    autoCloseBrackets: true,
    autofocus: true,
    foldGutter: true,
    keyMap: 'sublime',
    extraKeys: {// 快捷键配置
      [`${runKey}-Alt`]: 'autocomplete',// 智能提示
      [`${runKey}-Q`]: cm => {
        cm.foldCode(cm.getCursor())
      },
      'Shift-Alt-F': function (cm) {// 格式化代码
        const code = cm.getValue()
        const cursor = cm.getCursor()
        let finCode = ''
        if (cm.getOption('mode') === 'text/x-markdown') {
          return void 0
        } else {
          switch (mode) {
            case 'HTML':
              finCode = format.formatHtml(code)
              break
            case 'CSS':
              finCode = format.formatCss(code)
              break
            case 'JavaScript':
              finCode = format.formatJavaScript(code)
              break
          }
        }
        cm.setValue(finCode)
        cm.setCursor(cursor)
      }
    },
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    styleActiveLine: true
  }
  import('codemirror-emmet').then(emmet => {// 配置html和markdown的emmet
    emmet(CodeMirror)
    cmOptions.extraKeys = {
      ...cmOptions.extraKeys,
      Tab: cm => {
        /**
         * 处理策略
         * 如果光标选中了任何值，整行缩进
         * 如果当前光标所在编辑窗口为markdown，正常缩进
         * 如果当前行光标左边的一个字符为空或者为tab或空格，进行缩进
         * 如果当前光标所在编辑窗口为html，进行emmet扩展
         * 如果都不满足，按下tab触发自动补全（智能提示）
         */
        function indent () {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
          cm.replaceSelection(spaces, 'end', '+input')
        }
        if (cm.somethingSelected()) {// 光标选中文本
          cm.indentSelection('add') // 整行缩进
        } else {
          const cursor = cm.getCursor() // 获取焦点
          const line = cursor.line // 获取光标所在行数
          const ch = cursor.ch // 获取光标位置
          if (ch === 0 || cm.getOption('mode') === 'text/x-markdown') {
            indent() // 为markdown
          } else {
            const value = cm.getLine(line)// 获取当前行文本
            const front = value[ch - 1]// 获取光标前一字符
            switch (front) { // 为空格，tab或其他特定字符
              case '\t': case '<': case ' ': case '\'': case '/':
                indent()
                return void 0
            }
            if (cm.getOption('mode').indexOf('html') > -1) {// 为html
              if (front === '>') indent()
              try {
                cm.execCommand('emmetExpandAbbreviation')// emmet扩展
              } catch (err) {
                console.error(err)
              }
            } else cm.showHint()
          }
        }
      },
      [`${runKey}-Enter`]: cm => {
        if (cm.getOption('mode') === 'text/x-markdown') {
          let matchStr = ''
          // 判断开头是'> '还是'- '还是'1. '开头
          if (cm.somethingSelected()) {
            const selectContent = cm.listSelections()[0] // 第一个选中的文本
            let { anchor, head } = selectContent
            // 选中文本时，光标要么在内容前，要么在内容后，需要判断前后位置
            head.line >= anchor.line &&
              head.sticky === 'before' &&
              ([head, anchor] = [anchor, head])
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
      [`${runKey}-B`]: cm => {
        // 加粗
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.changeTextStyle(cm, '**')
      },
      [`${runKey}-I`]: cm => {
        // 倾斜
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.changeTextStyle(cm, '*')
      },
      [`${runKey}-D`]: cm => {
        // 删除
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.changeTextStyle(cm, '~~')
      },
      [`${runKey}-L`]: cm => {
        // 插入链接
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.addLink(cm)
      },
      [`${runKey}-P`]: cm => {
        // 插入图片
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.addLink(cm, true)
      },
      [`${runKey}-H`]: cm => {
        // 插入横线
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.addLine(cm)
      },
      [`${runKey}-K`]: cm => {
        // 插入代码
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.changeTextStyle(cm, '`')
      },
      [`${runKey}-U`]: cm => {
        // 插入代码
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.addList(cm, '- ')
      },
      [`${runKey}-O`]: cm => {
        // 插入代码
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.addOrderList(cm)
      },
      [`${runKey}-Shift-Q`]: cm => {
        // 插入代码
        cm.getOption('mode') === 'text/x-markdown' &&
          markdownTools.addList(cm, '> ')
      },
      Enter: 'emmetInsertLineBreak'
    }
    cmOptions.emmet = {
      markupSnippets: {
        'script:unpkg': 'script[src="https://unpkg.com/"]',
        'script:jsd': 'script[src="https://cdn.jsdelivr.net/npm/"]'
      }
    }
  })
  return cmOptions
}