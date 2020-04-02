<template>
  <div id="profile" class="flex">
    <div class="bg" v-if="showBg" @click.stop="closeBg"></div>
    <Sidebar class="sidebar" :class="isShowSidebar?'sidebar-active':''" v-if="refresh" ref="sidebar"></Sidebar>
    <div class="fold-sidebar" :class="isShowSidebar?'fold-sidebar-active':''">
      <i class="icon iconfont icon-close" v-show="isShowSidebar" @click.stop="showSidebar(false)"></i>
      <i class="icon iconfont icon-menu" v-show="!isShowSidebar" @click.stop="showSidebar(true)"></i>
    </div>
    <ProfileBody class="profile-body"></ProfileBody>
    <transition name="dialog-fade">
      <div class="dialog-box" v-if="currentDialog !== ''">
        <Dialog :dialogName="currentDialog"></Dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import Sidebar from './sidebar'
import Dialog from './dialog'
import ProfileBody from './profileBody'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      refresh: true,
      isShowSidebar: false
    }
  },
  mounted() {
    // 如果用户已经登陆，给页面标题赋值
    const loginStatus = this.loginStatus
    const username = this.userInfo.name
    document.title = `${username} JS-Encoder`
  },
  computed: {
    ...mapState({
      showBg: 'showBg',
      currentDialog: 'currentDialog',
      language: 'language',
      loginStatus: 'loginStatus',
      userInfo: 'userInfo'
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
    }
  },
  components: {
    Sidebar,
    ProfileBody,
    Dialog
  }
}
</script>
<style lang="scss" src="./componentStyle/profile.scss" scoped></style>
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
#profile {
  @include setWAndH(100%, 100%);
  position: relative;
  .bg {
    position: absolute;
    z-index: 999;
    @include setWAndH(100%, 100%);
    @include setTransition(all, 0.3s, ease);
    background-color: rgba(0, 0, 0, 0.5);
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
}
</style>
