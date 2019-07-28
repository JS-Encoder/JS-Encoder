import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueX from 'vuex'
import { codemirror } from 'vue-codemirror'
import '../static/css/codemirror.css'
import '../static/css/monokai.css'

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

new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App />'
})

console.log(
  ' _____  ___    ___           ___   ____   ___    ___   ___' + '\n' +
  '   |   /   \\  |     |\\   |  |   \\ /    \\ |   \\  |     |   \\' + '\n' +
  '   |   \\___   |___  | \\  | |      |    | |    | |___  |___|' + '\n' +
  '   |       \\  |     |  \\ | |      |    | |    | |     | \\' + '\n' +
  '|__/   \\___/  |___  |   \\|  |___/ \\____/ |___/  |___  |   \\' + '\n'
)

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
