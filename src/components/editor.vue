<template>
  <div id="editor" class="flex">
    <div class="bg" v-if="showBg" @click.stop="closeBg"></div>
    <Sidebar class="sidebar" :class="isShowSidebar?'sidebar-active':''" v-if="refresh"></Sidebar>
    <div class="fold-sidebar" :class="isShowSidebar?'fold-sidebar-active':''">
      <i class="icon iconfont icon-close" v-show="isShowSidebar" @click.stop="showSidebar(false)"></i>
      <i class="icon iconfont icon-menu" v-show="!isShowSidebar" @click.stop="showSidebar(true)"></i>
    </div>
    <MainBody></MainBody>
    <div class="slide-user-info" :class="showSlideUserMenu ? 'slide-user-info-show' : ''">
      <SlideUserMenu v-if="showSlideUserMenu"></SlideUserMenu>
    </div>
    <transition name="dialog-fade">
      <div class="dialog-box" v-if="currentDialog !== ''">
        <Dialog :dialogName="currentDialog"></Dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import Sidebar from './sidebar'
import MainBody from './mainbody'
import SlideUserMenu from './slideUserMenu'
import { getUrlParams } from '@/utils/handleUrl'
import { post, get } from '@/utils/request'
import handleCookie from '@/utils/handleCookie'
import Dialog from './dialog'
import { mapState } from 'vuex'
export default {
  components: {
    Sidebar,
    MainBody,
    SlideUserMenu,
    Dialog
  },
  data() {
    return {
      refresh: true,
      isShowSidebar: false
    }
  },
  mounted() {
    // 获取用户跳转到github进行注册之后会跳转回来，进行用户信息获取
    this.getUserInfo()
  },
  computed: {
    ...mapState({
      showBg: 'showBg',
      showSlideUserMenu: 'showSlideUserMenu',
      currentDialog: 'currentDialog',
      language: 'language',
      loginStatus: 'loginStatus'
    })
  },
  watch: {
    language() {
      // 重新渲染组件
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    }
  },
  methods: {
    showSidebar(status) {
      this.isShowSidebar = status
    },
    closeBg() {
      const commit = this.$store.commit
      commit('updateShowBg', false)
      commit('updateShowSlideUserMenu', false)
      commit('updateCurrentDialog', '')
    },
    async getCode() {
      /**
       * 判断环境以使用不同的方式截取参数
       * 获取code参数，开发模式下去除尾部的#/
       * 如果没有code参数，直接返回
       */
      const href = window.location.href
      let url = ''
      let paramObj = {}
      let userInfo = {}
      url = href.substr(0, href.indexOf('#/'))
      paramObj = getUrlParams(url)

      if (!paramObj.code) return 'NO CODE'

      // 向后台发送code，后台请求用户信息
      await get('/jsEncoder/login/loginGithub', {
        params: {
          code: paramObj.code
        }
      }).then(res => {
        userInfo = res
      }).catch(err =>{
        console.log(err)
      })
      return userInfo
    },
    getUserInfo() {
      const commit = this.$store.commit
      // 查看用户登录状态，如果已登录就不需要进行用户信息获取
      if (this.loginStatus) return void 0
      // 如果url中没有带参数，也不能获取用户信息
      if (window.location.href.indexOf('?') < 0) {
        // 显示欢迎弹窗
        const jsEcdStore = sessionStorage.getItem('jsEcdStore')
        const id = handleCookie.getCookieValue('_id')
        if (!id && !jsEcdStore) {
          commit('updateShowBg', true)
          commit('updateCurrentDialog', 'welcome')
        }
        return void 0
      }
      commit('updateShowPageLoader', true)
      this.getCode().then(res => {
        if (res === 'NO CODE') return void 0
        if (!Object.keys(res).length) {
          // 提示登陆失败
          this.$notify({
            message: this.language === 'zh' ? '登陆失败' : 'Login Failed',
            position: 'bottom-right',
            iconClass: 'icon iconfont icon-error1 error-icon',
            duration: 3000
          })
          commit('updateShowPageLoader', false)
          return void 0
        }
        handleCookie.setCookie('_id', res._id, 30)
        commit('updateLoginStatus', true)
        commit('updateUserInfo', res)
        // 跳转到用户界面
        commit('updateShowPageLoader', false)
        this.$router.push({
          path: '/profile'
        })
      })
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/editor.scss" scoped></style>
<style lang="scss" scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  @include setTransition(all, 0.3s, ease);
}
.dialog-fade-enter,
.dialog-fade-leave-active {
  opacity: 0;
  transform: scale(0);
  visibility: hidden;
}
#editor {
  @include setWAndH(100%, 100%);
  position: relative;
  .bg {
    position: absolute;
    z-index: 999;
    @include setWAndH(100%, 100%);
    @include setTransition(all, 0.3s, ease);
    background-color: rgba(0, 0, 0, 0.5);
  }
  .fold-sidebar {
    display: none;
    @include setWAndH(30px, 30px);
    background-color: $dominantHue;
    border-radius: 5px;
    cursor: pointer;
    & > i {
      color: $beforeFocus;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .slide-user-info {
    @include setWAndH(300px, 100%);
    @include setTransition(all, 0.3s, ease);
    position: absolute;
    background-color: $dominantHue;
    z-index: 1000;
    top: 0;
    left: 100%;
  }
  .slide-user-info-show {
    box-shadow: 0 0 5px 0 #000000;
    left: calc(100% - 300px);
  }
  .dialog-box {
    @include setWAndH(500px);
    max-height: 500px;
    overflow: auto;
    left: calc(50% - 250px);
    top: 100px;
    position: absolute;
    z-index: 1000;
    background-color: $primaryHued;
    border-radius: 5px;
    box-shadow: 0 0 5px 0 $deepColor;
    box-sizing: border-box;
    padding: 0 10px 10px 10px;
  }
}
</style>