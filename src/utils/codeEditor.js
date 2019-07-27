/* eslint-disable */
import CodeMirror from 'codemirror'

export default function () {
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