import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueX from 'vuex'
import { codemirror } from 'vue-codemirror'
import marked from 'marked'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/dialog/dialog.css'
import '../static/css/codemirror.css'
import '../static/css/monokai.css'
import 'codemirror/addon/fold/foldgutter.css'
require('codemirror/mode/javascript/javascript.js')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/css/css.js')
require('codemirror/mode/sass/sass.js')
require('codemirror/mode/stylus/stylus')
require('codemirror/mode/coffeescript/coffeescript')
require('codemirror/mode/livescript/livescript')
require('codemirror/mode/jsx/jsx')
require('codemirror/keymap/vim.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/display/fullscreen.js')
require('codemirror/addon/hint/javascript-hint.js')
require('codemirror/addon/hint/html-hint.js')
require('codemirror/addon/hint/css-hint.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/anyword-hint.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/dialog/dialog.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/edit/closetag.js')
require('codemirror/addon/edit/closebrackets.js')
require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/edit/matchtags')
require('codemirror/addon/edit/matchbrackets')
require('codemirror/addon/comment/comment.js')
require('codemirror/keymap/sublime.js')
require('codemirror/addon/display/fullscreen.js')
require('codemirror/mode/markdown/markdown.js')
require('codemirror/addon/edit/continuelist')
Vue.use(codemirror)
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueX)
/* eslint-disable no-new */
const store = new VueX.Store({
  state: {
    textBoxW: {
      HTML: '',
      CSS: '',
      JavaScript: '',
      Console: '',
      Output: ''
    },
    textBoxContent: {
      HTML: '',
      CSS: '',
      JavaScript: '',
      Console: '',
      Output: ''
    },
    HTMLPrep: 'HTML',
    CSSPrep: 'CSS',
    JSPrep: 'JavaScript',
    consoleInfo: '',
    waitTime: 500,
    replace: true,
    showScreen: false,
    autoUp: true,
    isRun: false,
    cdnJs: [],
    cssLinks: []
  },
  mutations: {
    change: (state, info) => {
      state.textBoxContent[info.title] = info.newVal
    },
    updateTextBoxW: (state, info) => {
      let attr = info.attr
      switch (attr) {
        case 'HTML':
        case 'MarkDown':
          attr = 'HTML'
          break
        case 'CSS':
        case 'Sass':
        case 'Scss':
        case 'Less':
        case 'Stylus':
          attr = 'CSS'
          break
        case 'JavaScript':
        case 'TypeScript':
        case 'CoffeeScript':
        case 'LiveScript':
        case 'JSX':
          attr = 'JavaScript'
          break
        case 'Console':
          attr = 'Console'
          break
        case 'Output':
          attr = 'Output'
          break
      }
      state.textBoxW[attr] = info.value
    },
    updateStateAttr: (state, info) => {
      state[info.attr] = info.value
    },
    updateOutput: (state, newVal) => {
      state.textBoxContent.Output = newVal
    },
    updateConsole: (state, newVal) => {
      state.consoleInfo = newVal
    },
    updateScreen: (state, newVal) => {
      state.showScreen = newVal
    },
    updateTime: (state, newVal) => {
      state.waitTime = newVal
    },
    updateReplace: (state, newVal) => {
      state.replace = newVal
    },
    updateAutoUp: (state, newVal) => {
      state.autoUp = newVal
    },
    updateRun: (state, newVal) => {
      state.isRun = newVal
    },
    updateCDN: (state, newVal) => {
      state.cdnJs = newVal
    },
    updateCssLinks: (state, newVal) => {
      state.cssLinks = newVal
    }
  }
})

// const html = '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<meta name="viewport" content="width=device-width">\n\t<title>Compiler ol</title>\n</head>\n<body>\n\n</body>\n</html>'
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App />'
})

// 监测刷新和关闭
// window.onbeforeunload = function (e) {
//   let dialogText = 'Dialog text here'
//   e.returnValue = dialogText
//   return dialogText
// }
// window.isCloseHint = true
// 初始化关闭
// window.addEventListener('beforeunload', function (e) {
//   if (window.isCloseHint) {
//     let confirmationMessage = '要记得保存！你确定要离开我吗？';
//     (e || window.event).returnValue = confirmationMessage // 兼容 Gecko + IE
//     return confirmationMessage // 兼容 Gecko + Webkit, Safari, Chrome
//   }
// })
