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
  },
  methods: {
    hideAccount() {
      const commit = this.$store.commit
      commit('updateAccountInfo', {
        isShow: false
      })
      commit('updateScreen', false)
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
