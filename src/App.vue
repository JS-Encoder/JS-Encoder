<template>
  <div id="app" @click="closeDialog">
    <router-view />
    <PageLoader class="page-loader" :content="content" v-if="showPageLoader"></PageLoader>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as zh from './common/lang/zh'
import * as en from './common/lang/en'
import reqUserInfo from '@/utils/requestUserInfo'
import handleCookie from '@/utils/handleCookie'
import judgeBrowserTAndV from '@/utils/checkBrowser'
import PageLoader from './components/pageLoader'
export default {
  name: 'App',
  data() {
    return {
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      content: 'Logging in via github, please wait a moment...'
    }
  },
  mounted() {
    // 首先检测浏览器类型
    const browserInfo = judgeBrowserTAndV()

    if (browserInfo.type !== 'chrome' || !/^8/.test(browserInfo.version)) {
      // 提醒用户更换浏览器
      this.$message({
        showClose: true,
        message: window.Global.language.browserTip,
        type: 'error',
        duration: 0
      })
    }

    // 初始化账户
    this.initAccount()
    // 缓存窗口尺寸
    window.onresize = () => {
      const ele = document.documentElement
      this.clientHeight = ele.clientHeight
      this.clientWidth = ele.clientWidth
    }
  },
  components: {
    PageLoader
  },
  computed: {
    ...mapState({
      language: 'language',
      currentSecOpt: 'currentSecOpt',
      iframeScreen: 'iframeScreen',
      isFilterShow: 'isFilterShow',
      consoleSize: 'consoleSize',
      codeAreaHeight: 'codeAreaHeight',
      codeAreaWidth: 'codeAreaWidth',
      iframeWidth: 'iframeWidth',
      showPageLoader: 'showPageLoader'
    })
  },
  watch: {
    language(newLang) {
      const lang = newLang === 'zh' ? zh : en
      window.Global.language = lang
    },
    clientHeight(newVal, oldVal) {
      // 浏览器可视窗口高度改变时同时改变console和代码窗口大小
      // 改变策略：高度减小时等比缩小两个窗口高度，console不能小于25，代码窗口不小于100，有任何一个窗口达到最小值，那么只减少另一个窗口的高度
      const commit = this.$store.commit
      const consoleSize = this.consoleSize
      const codeAreaHeight = this.codeAreaHeight
      const resizeHeight = newVal - oldVal
      if (consoleSize <= 25 && codeAreaHeight <= 100 && resizeHeight < 0) {
        return void 0
      }
      if (consoleSize <= 25 && resizeHeight < 0) {
        commit('updateCodeAreaHeight', codeAreaHeight + resizeHeight)
        return void 0
      } else if (codeAreaHeight <= 100 && resizeHeight < 0) {
        commit('updateConsoleSize', consoleSize + resizeHeight)
        return void 0
      }
      commit('updateCodeAreaHeight', codeAreaHeight + resizeHeight / 2)
      commit('updateConsoleSize', consoleSize + resizeHeight / 2)
    },
    clientWidth(newVal, oldVal) {
      // 浏览器可视窗口宽度改变时同时改变编辑器和iframe窗口宽度
      // 宽度减小时同时等比缩小两个窗口宽度，两个窗口宽度都不能小于100，有任何一个窗口达到最小值，那么只减少另一个窗口的宽度
      const { commit, state } = this.$store
      let codeAreaWidth = this.codeAreaWidth
      let iframeWidth = this.iframeWidth
      const resizeWidth = newVal - oldVal

      if (codeAreaWidth <= 100 && iframeWidth <= 100 && resizeWidth < 0) {
        return void 0
      }
      if (codeAreaWidth <= 100 && resizeWidth < 0) {
        commit('updateIframeWidth', iframeWidth + resizeWidth)
        return void 0
      } else if (iframeWidth <= 100 && resizeWidth < 0) {
        commit('updateCodeAreaWidth', codeAreaWidth + resizeWidth)
        return void 0
      }
      commit('updateClientWidth', newVal)
      commit('updateCodeAreaWidth', codeAreaWidth + resizeWidth / 2)
      commit('updateIframeWidth', iframeWidth + resizeWidth / 2)
    }
  },
  methods: {
    closeDialog() {
      // 关掉其他窗口
      const commit = this.$store.commit
      if (this.currentSecOpt !== '') {
        commit('updateCurrentSecOpt', '')
        if (this.iframeScreen) commit('updateIframeScreen', false)
      }
      if (this.isFilterShow) {
        commit('updateIsFilterShow', false)
        commit('updateIframeScreen', false)
      }
    },
    initAccount() {
      /**
       * 初始化账户
       * 判断用户是否登陆，已经登陆就直接返回
       * 如果本地存在_id字段，就向后台请求用户信息，否则跳转到编辑界面
       */
      const isLogin = this.$store.state.loginStatus
      if (isLogin) return void 0
      const _id = handleCookie.getCookieValue('_id')
      if (!_id) return void 0
      this.getUserInfoById(_id)
    },
    getUserInfoById(_id) {
      /**
       * 如果用户存在，跳转到用户信息界面
       * 如果用户不存在，跳转到编辑界面
       */
      const commit = this.$store.commit
      reqUserInfo.getUserInfo(_id).then(res => {
        if (Object.keys(res).length !== 0) {
          commit('updateLoginStatus', true)
          commit('updateUserInfo', res)
          if (this.$route.name === 'editor') {
            this.$router.push({
              name: 'profile',
              params: {
                id: res.name
              },
              replace: true
            })
          }
        } else {
          this.$notify({
            message: this.language === 'zh' ? '登陆失败' : 'Login Failed',
            position: 'bottom-right',
            iconClass: 'icon iconfont icon-error1 error-icon',
            duration: 3000
          })
          commit('updateShowPageLoader', false)
          return void 0
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  @include setWAndH(100%, 100%);
  position: relative;
  font-family: $josefinSans;
  background-color: $dominantHue;
  .page-loader {
    position: absolute;
    top: 0;
    z-index: 2000;
  }
}
</style>
