<template>
  <div id="slideUserMenu">
    <div class="user-box flex flex-clo flex-ai noselect" v-if="loginStatus">
      <div class="user-avatar flex flex-ai flex-jcc">
        <img :src="userInfo.avatarUrl" alt="">
      </div>
      <div class="user-nick-name flex flex-ai flex-jcc">
        <span class="flex flex-jcc">{{userInfo.name}}</span>
      </div>
      <div class="user-menu flex flex-clo flex-ai">
        <div class="top-menu">
          <span @click="toProfile(false)">{{langSUMenu[0]}}</span>
          <!-- ︱
          <span>{{langSUMenu[1]}}</span> -->
        </div>
        <span @click="toProfile(true)">{{langSUMenu[2]}}</span>
        <span @click="logOut">{{langSUMenu[3]}}</span>
      </div>
    </div>
    <div class="login-box flex flex-clo flex-ai flex-jcc noselect" v-else>
      <span class="login-hint">{{loginHint}}</span>
      <button class="login-github-btn flex flex-ai flex-jcc btn-def" @click="loginWithGithub">
        <i class="icon iconfont icon-github"></i>
        {{loginBtnInfo}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { post, get } from '@/utils/request'
export default {
  data() {
    return {
      githubConfig: {}
    }
  },
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.githubConfig = {
        client_id: 'ac71238834c2cf44ce60',
        oAuth_uri: 'https://github.com/login/oauth/authorize'
      }
    } else {
      this.githubConfig = {
        client_id: '47c1b5b12a1b961cfea0',
        oAuth_uri: 'https://github.com/login/oauth/authorize'
      }
    }
  },
  methods: {
    loginWithGithub() {
      // 使用github进行登陆
      this.closeSlideMenu()
      const githubConfig = this.githubConfig
      window.location.href = `${githubConfig.oAuth_uri}?client_id=${githubConfig.client_id}`
    },
    toProfile(projectType) {
      // 用户跳转项目或回收站页面
      this.closeSlideMenu()
      this.$router.push({
        path: `/profile/${this.userInfo.name}`,
        query: { projectType }
      })
    },
    logOut() {
      const commit = this.$store.commit
      commit('updateCurrentDialog', 'logOut')
      commit('updateShowSlideUserMenu', false)
      commit('updateShowBg', true)
    },
    closeSlideMenu() {
      const commit = this.$store.commit
      commit('updateShowSlideUserMenu', false)
      commit('updateShowBg', false)
    }
  },
  computed: {
    langSUMenu() {
      return window.Global.language.slideUserMenu
    },
    loginHint() {
      return window.Global.language.loginHint
    },
    loginBtnInfo() {
      return window.Global.language.loginBtn
    },
    ...mapState({
      loginStatus: 'loginStatus',
      userInfo: 'userInfo'
    })
  }
}
</script>

<style lang="scss" scoped>
#slideUserMenu {
  letter-spacing: 0.034em;
  @include setWAndH(100%, 100%);
  .user-box {
    @include setWAndH(100%, 100%);
    .user-avatar {
      @include setWAndH(100px, 100px);
      margin: 50px 0 20px 0;
      border-radius: 50%;
      border: 1px solid $beforeFocus;
      & > img {
        @include setWAndH(96px, 96px);
        background-color: $primaryHued;
        border-radius: 50%;
      }
    }
    .user-nick-name {
      @include setWAndH(100%, 40px);
      background-color: $primaryHued;
      span {
        font-size: 18px;
        color: $afterFocus;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        width: 70%;
      }
    }
    .user-menu {
      color: $beforeFocus;
      .top-menu {
        margin: 20px 0;
        & > span {
          margin: 0 5px;
          font-size: 14px;
          cursor: pointer;
          @include setTransition(all, 0.3s, ease);
          &:hover {
            color: $afterFocus;
          }
        }
      }
      span {
        margin-bottom: 20px;
        font-size: 14px;
        cursor: pointer;
        @include setTransition(all, 0.3s, ease);
        &:hover {
          color: $afterFocus;
        }
      }
    }
  }
  .login-box {
    @include setWAndH(100%, 100%);
    .login-hint {
      font-size: 18px;
      color: $afterFocus;
      font-weight: 600;
      margin-bottom: 50px;
    }
    button {
      @include setWAndH(200px, 35px);
      outline: none;
      border: none;
      font-size: 14px;
      letter-spacing: 0.08em;
      margin-bottom: 150px;
      & > i {
        font-size: 25px;
        margin-right: 10px;
      }
    }
  }
}
</style>
