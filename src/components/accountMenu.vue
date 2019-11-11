<template>
  <transition name="account">
    <div class="account-menu">
      <ul class="account-options-list">
        <li :key="index" @click="item.method" class="account-option" v-for="(item, index) in menuOptions">{{item.name}}</li>
      </ul>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    loginStatus: Boolean,
    accountInfo: Object
  },
  data() {
    return {}
  },
  computed: {
    menuOptions() {
      const accountInfo = this.accountInfo
      const unLoginOptions = [
        {
          name: 'Log In',
          method: this.openLogin
        }
      ]
      const loggedInOptions = [
        {
          name: accountInfo.name,
          method: this.profile
        },
        {
          name: 'Log Out',
          method: this.logOut
        }
      ]

      return this.loginStatus ? loggedInOptions : unLoginOptions
    }
  },
  methods: {
    openLogin() {
      this.$emit('openLogin')
    },
    logOut() {
      // 登出账户
      if (confirm('Are you sure to log out?')){
        console.log('sure')
      }
    },
    profile() {
      // 进入个人信息界面
      sessionStorage.setItem('jsEcdStore', JSON.stringify(this.$store.state))

      this.$router.push({
        path: '/profile'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.account-enter-active,
.account-leave-active {
  @include setTransition(all, 0.2s, ease);
}
.account-enter,
.account-leave-to {
  opacity: 0;
  transform: scale(0.8);
  visibility: hidden;
}
.account-menu {
  @include setWAndH(150px);
  position: absolute;
  top: 50px;
  right: 0;
  max-height: calc(100vh - 71px);
  z-index: 2000;
  box-sizing: border-box;
  box-shadow: 0 0.5rem 5rem $dominantHue;
  background-color: $dominantHue;
  overflow-y: auto;
  transform-origin: top right;
  .account-options-list {
    color: $primaryHued;
    .account-option {
      padding: 10px 15px;
      cursor: pointer;
      @include setTransition(all, 0.3s, ease);
      &:hover {
        background-color: #333333;
      }
    }
  }
}
</style>
