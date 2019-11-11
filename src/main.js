import Vue from 'vue'
import App from './App'
import router from './router'
import VueX from 'vuex'
import element from './utils/getElementUi'
import { codemirror } from 'vue-codemirror'
import * as judge from './utils/judgeMode'
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
      CSS: 'body{\n\tmargin: 0;\n\tpadding: 0;\n}',
      JavaScript: '',
      Console: '',
      Output: ''
    },
    HTMLPrep: 'HTML',
    CSSPrep: 'CSS',
    JSPrep: 'JavaScript',
    consoleInfo: [],
    waitTime: 500,
    replace: true,
    showScreen: false,
    loginStatus: false,
    accountInfo: {
      isShow: false,
      avatarUrl: '',
      name: '',
      login: '',
      email: ''
    },
    clientInfo: {
      clientID: '',
      clientSecret: ''
    },
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
    },
    updateAccountInfo: (state, obj) => {
      for (let attr in obj) {
        state.accountInfo[attr] = obj[attr]
      }
    },
    updateClientInfo: (state, info) => {
      state.clientInfo = info
    },
    updateLoginStatus: (state, newVal) => {
      state.loginStatus = newVal
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

// 页面刷新前将state存入sessionStorage
window.onbeforeunload = () => {
  sessionStorage.setItem('jsEcdStore', JSON.stringify(store.state))
}

console.log(
  '     ██╗███████╗      ███████╗███╗   ██╗ ██████╗ ██████╗ ██████╗ ███████╗██████╗ ' + '\n' +
  '     ██║██╔════╝      ██╔════╝████╗  ██║██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗' + '\n' +
  '     ██║███████╗█████╗█████╗  ██╔██╗ ██║██║     ██║   ██║██║  ██║█████╗  ██████╔╝' + '\n' +
  '██   ██║╚════██║╚════╝██╔══╝  ██║╚██╗██║██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗' + '\n' +
  '╚█████╔╝███████║      ███████╗██║ ╚████║╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║' + '\n' +
  '╚════╝ ╚══════╝      ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝ '
)
