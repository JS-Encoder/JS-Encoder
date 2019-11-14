import Vue from 'vue'
import Router from 'vue-router'
import Editor from '@/components/editor.vue'
import Profile from '@/components/profile.vue'
import store from '@/vuex/store'
Vue.use(Router)

/* eslint-disable*/
const router = new Router({
  routes: [
    {
      path: '/',
      redirect: 'editor'
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        judgeLogin: true
      },
      component: Profile
    }
  ],
  mode: 'hash',
  base: '/'
})

function loadHistorySession() {
  const jsEcdStore = sessionStorage.getItem('jsEcdStore')
  if (jsEcdStore !== null) {
    store.replaceState(JSON.parse(jsEcdStore))
  }
}
// 获取sessionStorage
loadHistorySession()

// 路由守卫
router.beforeEach(function (to, from, next) {
  // 判断此路由是否需要拦截
  if (!to.meta.judgeLogin) return next()
  if (store.state.loginStatus) return next()
  alert('please login')
  router.push({
    name: 'editor'
  })
})

export default router
