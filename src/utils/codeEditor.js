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
// import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/xml-fold'

import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint'
// import 'codemirror/addon/hint/show-hint.css'
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

import * as format from '../utils/prettyFormat'

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
    autoCloseTags: true,
    autoCloseBrackets: true,
    autofocus: true,
    foldGutter: true,
    keyMap: 'sublime',
    extraKeys: {// 快捷键配置
      'Ctrl-Alt': 'autocomplete',// 智能提示
      'Ctrl-Q': cm => {
        cm.foldCode(cm.getCursor())
      },
      'Shift-Alt-F': async cm => {// 格式化代码
        const code = cm.getValue()
        let finCode = ''
        switch (mode) {
          case 'HTML':
            await format.formatHtml(code).then(res => { finCode = res })
            break
          case 'CSS':
            await format.formatCss(code).then(res => { finCode = res })
            break
          case 'JavaScript':
            await format.formatJavaScript(code).then(res => { finCode = res })
            break
        }
        cm.setValue(finCode)
      }
    },
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    styleActiveLine: true
  }
  import('codemirror-emmet').then(emmet => {// 配置html emmet
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
        if (cm.somethingSelected()) {
          cm.indentSelection('add')
        } else {
          const cursor = cm.getCursor() // 获取焦点
          const line = cursor.line
          const ch = cursor.ch // 获取光标位置
          if (ch === 0 || cm.getOption('mode') === 'text/x-markdown') {
            indent()
          } else {
            const value = cm.getLine(line)
            const front = value[ch - 1]
            const end = value[ch]
            switch (front) {
              case '\t':
              case '<':
              case ' ':
              case '\'':
              case '/':
                indent()
                return void 0
            }
            if (cm.getOption('mode').indexOf('html') > -1) {
              if (front === '>') {
                indent()
              }
              try {
                cm.execCommand('emmetExpandAbbreviation')
              } catch (err) {
                console.error(err)
              }
            } else {
              cm.showHint()
            }
          }
        }
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