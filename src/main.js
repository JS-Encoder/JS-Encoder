import Vue from 'vue'
import App from './App'
import router from './router'
import element from './utils/getElementUi'
import { codemirror } from 'vue-codemirror'
import '../static/css/codemirror.css'
import '../static/css/monokai.css'
import '../static/css/style.css'
import store from './vuex/store'

Vue.config.productionTip = false

Vue.use(codemirror)
Vue.use(element)

/* eslint-disable*/
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App />'
})

//自定义指令

Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
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
