import Vue from 'vue'
import App from './App'
import router from './router'
import element from './utils/getElementUi'
import global from './utils/global'
import { codemirror } from 'vue-codemirror'
import '../static/css/codemirror.css'
import '../static/css/monokai.css'
import '../static/css/style.css'
import '../static/css/show-hint.css'
import '../static/css/public.css'
import '../static/css/foldgutter.css'
import '../static/css/dialog.css'
import store from './vuex/store'

Vue.config.productionTip = true
window.Global = global

Vue.use(codemirror)
Vue.use(element)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})

//自定义指令
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

// 页面刷新前将state存入sessionStorage
window.onbeforeunload = () => {
  store.commit('updateShowBg', false)
  store.commit('updateCurrentDialog', '')
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