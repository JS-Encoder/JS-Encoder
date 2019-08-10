import Vue from 'vue'
import App from './App'
import router from './router'
import VueX from 'vuex'
import element from './utils/getElementUi'
import { codemirror } from 'vue-codemirror'
import * as judge from './utils/judgeMode'
import './utils/changeWindowEvent'
import '../static/css/codemirror.css'
import '../static/css/monokai.css'
import '../static/css/style.css'

Vue.config.productionTip = false

Vue.use(codemirror)
Vue.use(element)
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
    change: (state, obj) => {
      for (let key in obj) {
        state.textBoxContent[key] = obj[key]
      }
    },
    updateTextBoxW: (state, info) => {
      const attr = judge.judgeMode(info.attr)
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
  '                                                          ' + '\n' +
  ' _____  ___    ___           ___   ____   ___    ___   ___' + '\n' +
  '   |   /   \\  |     |\\   |  |   \\ /    \\ |   \\  |     |   \\' + '\n' +
  '   |   \\___   |___  | \\  | |      |    | |    | |___  |___|' + '\n' +
  '   |       \\  |     |  \\ | |      |    | |    | |     | \\' + '\n' +
  '|__/   \\___/  |___  |   \\|  |___/ \\____/ |___/  |___  |   \\' + '\n'
)
