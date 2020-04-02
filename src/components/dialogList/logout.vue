<template>
  <div id="logout" class="flex flex-clo">
    <div class="text flex flex-clo">
      <span class="content">{{langLogout.content}}</span>
      <span class="describe">{{langLogout.describe}}</span>
      <span class="describe">{{langLogout.describeExtra}}</span>
    </div>
    <div class="btn-box flex">
      <button class="btn-def cancel" @click="cancel">{{langLogout.cancel}}</button>
      <button class="btn-def confirm" @click="confirm">{{langLogout.confirm}}</button>
    </div>
  </div>
</template>

<script>
import handleCookie from '@/utils/handleCookie'
export default {
  data() {
    return {}
  },
  computed: {
    langLogout() {
      return window.Global.language.dialogInfo.logOut
    }
  },
  methods: {
    cancel() {
      const commit = this.$store.commit
      commit('updateShowBg', false)
      commit('updateCurrentDialog', '')
    },
    confirm() {
      // 清除所有cookie
      const cookieList = ['_id', 'defaultCode', 'preprocess', 'qnyToken']
      for (let i = 0, k = cookieList.length; i < k; i++) {
        handleCookie.deleteCookie(cookieList[i])
      }
      // 清除所有
      // 跳转
      const commit = this.$store.commit
      commit('cleanUserConfig')
      commit('updateShowBg', false)
      commit('updateCurrentDialog', '')
      // this.$router.push({
      //   path: '/editor'
      // })
      // 直接跳转路由依然会带code参数
      location.href = Global.publicUrl + '#/editor'
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
#logout {
  .text {
    margin: 20px 0;
    .content {
      color: $afterFocus;
    }
  }
  .btn-box {
    .btn-def {
      padding: 6px 20px;
      margin: 10px;
    }
    .cancel {
      margin-left: auto;
      background-color: $afterFocus;
      color: $deepColor;
    }
    .confirm {
      background-color: #ff3c41;
      color: $afterFocus;
    }
  }
}
</style>
