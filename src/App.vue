<template>
  <div @click="hideAccount" id="home">
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Home',
  computed: {
    ...mapState({
      accountInfo: 'accountInfo'
    })
  },
  created() {
    // 初始加载动画
    try {
      document.body.removeChild(document.getElementById('appLoading'))
      setTimeout(function () {
        document.getElementById('home').style.opacity = '1'
      }, 300)
    } catch (e) { }

    this.findHistorySession()
  },
  methods: {
    hideAccount() {
      const commit = this.$store.commit
      commit('updateAccountInfo', {
        isShow: false
      })
      commit('updateScreen', false)
    },
    findHistorySession() {
      // 判断sessionStorage是否为空，否则将state重置为session
      const jsEcdStore = sessionStorage.getItem('jsEcdStore')
      if (jsEcdStore === null) return
      this.$store.replaceState(JSON.parse(jsEcdStore))
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
}
</style>
