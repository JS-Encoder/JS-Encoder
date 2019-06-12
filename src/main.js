import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueX from 'vuex'
import { codemirror } from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/monokai.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/dialog/dialog.css'
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
    consoleInfo: ''
  },
  mutations: {
    change: (state, info) => {
      state.textBoxContent[info.title] = info.newVal
    },
    updateOutput: (state, newVal) => {
      state.textBoxContent.Output = newVal
    },
    updateConsole: (state, newVal) => {
      state.consoleInfo = newVal
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
