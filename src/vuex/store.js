import Vue from 'vue'
import state from './state'
import mutations from './mutations'
import VueX from 'vuex'
Vue.use(VueX)

export default new VueX.Store({
  state,
  mutations
})
