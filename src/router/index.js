import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
import Editor from '@/components/editor.vue'
import Profile from '@/components/profile.vue'
import ErrorPage from '@/components/errorPage.vue'
import handleCookie from '@/utils/handleCookie'
import requestUserInfo from '@/utils/requestUserInfo'
Vue.use(Router)

/**
 * 重写路由的push方法
 * 防止出现 Navigating to current location XXX is not allowed 的问题
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

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
      path: '/editor/:id',
      name: 'editor',
      component: Editor
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: {
        judgeLogin: true
      }
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: Profile,
      meta: {
        judgeLogin: true
      },
      beforeEnter (to, from, next) {
        if (from.name === 'editor') store.commit('cleanProjectConfig')
        next()
      }
    },
    {
      path: '*',
      name: 'error',
      component: ErrorPage
    }
  ]
})

function loadHistorySession () {
  const jsEcdStore = sessionStorage.getItem('jsEcdStore')
  if (jsEcdStore !== null) {
    store.replaceState(JSON.parse(jsEcdStore))
  }
}
// 获取sessionStorage
loadHistorySession()

/**
 * 路由守卫规则
 * 在用户跳转路径为/profile开头时，监测其是否已经登陆
 * 如果没有登陆，监测其是否含有本地id（用户登陆凭证）
 * 若都没有，跳转到/editor
 * 若已登陆，跳转到/profile/用户名
 * 若有id，向后台请求用户信息并更新到state，登录状态置为true，跳转到/profile/用户名
 * 如果已登录，并且从editor跳转到profile，那么清除项目编辑配置
 */
router.beforeEach((to, from, next) => {
  if (!to.meta.judgeLogin) return next()
  const state = store.state
  const loginStatus = state.loginStatus
  const name = state.userInfo.name
  const id = handleCookie.getCookieValue('_id')
  const commit = store.commit
  if (loginStatus) {
    const path = `/profile/${name}`
    if (to.path !== path) {
      router.push({
        path
      })
    }
  } else if (id) {
    requestUserInfo.getUserInfo(id).then(res => {
      console.log('route')
      commit('updateUserInfo', res)
      commit('updateLoginStatus', true)
      router.push({
        path: `/profile/${res.name}`
      })
    })
  } else {
    router.push({
      path: `/editor`
    })
  }
  return next()
})

export default router