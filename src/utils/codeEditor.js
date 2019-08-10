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
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/xml-fold'

import 'codemirror/addon/hint/javascript-hint'
import 'codemirror/addon/hint/html-hint'
import 'codemirror/addon/hint/css-hint'
import 'codemirror/addon/hint/show-hint'
import 'codemirror/addon/hint/show-hint.css'
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
  const cmOptions = {
    tabSize: 2,
    mode: '',
    theme: 'monokai',
    lineNumbers: true,
    matchTags: { bothTags: true },
    matchBrackets: true,
    lineWiseCopyCut: true,
    indentWithTabs: true,
    indentUnit: 2,
    autoCloseTags: true,
    autoCloseBrackets: true,
    foldGutter: true,
    keyMap: 'sublime',
    extraKeys: {
      'Ctrl-Alt': 'autocomplete',
      'Ctrl-Q': cm => {
        cm.foldCode(cm.getCursor())
      },
      'Shift-Alt-F': async cm => {
        const code = cm.getValue()
        let finCode = ''
        switch (mode) {
          case 'HTML':
            await format.formatHtml(code).then(res => {
              finCode = res
            })
            break
          case 'CSS':
            await format.formatCss(code).then(res => {
              finCode = res
            })
            break
          case 'JavaScript':
            await format.formatJavaScript(code).then(res => {
              finCode = res
            })
            break
        }
        cm.setValue(finCode)
      }
    },
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    styleActiveLine: true
  }
  import('codemirror-emmet').then(emmet => {
    emmet(CodeMirror)
    cmOptions.extraKeys = {
      ...cmOptions.extraKeys,
      Tab: cm => {
        if (cm.somethingSelected()) {
          cm.indentSelection('add')
        } else if (cm.getOption('mode').indexOf('html') > -1) {
          try {
            cm.execCommand('emmetExpandAbbreviation')
          } catch (err) {
            console.error(err)
          }
        } else {
          const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
          cm.replaceSelection(spaces, 'end', '+input')
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