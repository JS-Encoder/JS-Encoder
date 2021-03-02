import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueI18n from 'vue-i18n'
import element from '@utils/getElementUI'
import { codemirror } from 'vue-codemirror'

// theme
import './assets/css/codemirror.css'
import './assets/css/show-hint.css'
import './assets/css/foldgutter.css'
import './assets/css/codemirror-dialog.css'
import '../public/css/font.css'
import './assets/themes/default.css'

Vue.config.productionTip = false

// plugins
Vue.use(element).use(codemirror).use(VueI18n)
const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    zh: require('./language/zh'),
    en: require('./language/en'),
  },
})

// Get state from sessionStorage when page onload
const jsEcdStore = sessionStorage.getItem('jsEcdStore')
if (jsEcdStore !== null) {
  const oldState = JSON.parse(jsEcdStore)
  oldState.visibleDialog = ''
  store.replaceState(oldState)
}

// Create Vue instance must be after replace state
new Vue({
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')

// Store state in sessionStorage before page refresh
window.onbeforeunload = () => {
  store.commit('updateShowBg', false)
  store.commit('updateCurrentDialog', '')
  sessionStorage.setItem('jsEcdStore', JSON.stringify(store.state))
}