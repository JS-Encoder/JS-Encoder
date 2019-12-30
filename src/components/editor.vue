<template>
  <div id="editor">
    <Header></Header>
    <SettingBar @changeTab="changeTabSpace" @hasChanged="changeTypeList"></SettingBar>
    <div class="code-box" ref="codeBox">
      <textareaBox
        :extraConsole="extraConsole"
        :index="index"
        :key="item"
        :len="types.length"
        :space="tabSpace"
        :title="item"
        :typeList="types"
        @updateConsole="updateConsole"
        class="textareaBox"
        v-for="(item,index) in types"
      ></textareaBox>
    </div>
  </div>
</template>

<script>
import Header from './header'
import SettingBar from './settingBar'
import textareaBox from './textareaBox'
import { judgeMode } from '@/utils/judgeMode'
import { getUrlParams } from '@/utils/handleUrl'
import { post, get } from '@/utils/request'
import { mapState } from 'vuex'
import qs from 'qs'

export default {
  name: 'editor',
  data() {
    return {
      types: [],
      screenWidth: document.body.clientWidth,
      typeListQueue: {
        HTML: 1,
        MarkDown: 1,
        CSS: 2,
        Sass: 2,
        Scss: 2,
        Less: 2,
        Stylus: 2,
        JavaScript: 3,
        TypeScript: 3,
        CoffeeScript: 3,
        Console: 4,
        Output: 5
      },
      boxW: '',
      tabSpace: 2,
      extraConsole: []
    }
  },
  computed: {
    ...mapState({
      HTMLPrep: 'HTMLPrep',
      CSSPrep: 'CSSPrep',
      JSPrep: 'JSPrep',
      accountInfo: 'accountInfo',
      loginStatus: 'loginStatus'
    })
  },
  created() {
    this.types = [this.HTMLPrep, this.CSSPrep, this.JSPrep, 'Console', 'Output']
    this.getUserInfo()
  },
  mounted() {
    this.changeAllWidth()
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
      })()
    }
  },
  watch: {
    screenWidth(newVal, oldVal) {
      const changeW = (newVal - oldVal) / this.types.length
      const store = this.$store
      for (let item of this.types) {
        const attr = judgeMode(item)
        const changeNum = parseFloat(store.state.textBoxW[attr])
        store.commit('updateTextBoxW', {
          attr: item,
          value: changeNum + changeW + 'px'
        })
      }
    }
  },
  components: {
    Header,
    SettingBar,
    textareaBox
  },
  methods: {
    async getCode() {
      // 如果有code（用户登陆），获取code值
      // 去除尾部的#/
      const href = window.location.href
      const url = href.substr(0, href.indexOf('#/'))
      const paramObj = getUrlParams(url)
      if (!paramObj) return

      const clientInfo = await require('@/info/clientInfo.json')
      let obj = {}

      // 获取传回来的授权码code
      await post('/github/login/oauth/access_token', {
        client_id: clientInfo.clientID,
        client_secret: clientInfo.clientSecret,
        code: paramObj.code
      }).then(res => {
        obj = qs.parse(res)
      })

      return obj
    },
    getUserInfo() {
      if (this.loginStatus) return
      if (window.location.href.indexOf('?') < 0) return

      this.getCode().then(res => {
        get('/gitUser/user', {
          headers: {
            Authorization: `Bearer ${res.access_token}`
          }
        }).then(res => {
          const commit = this.$store.commit

          commit('updateAccountInfo', {
            avatarUrl: res.avatar_url,
            name: res.name,
            login: res.login,
            email: res.email
          })
          commit('updateLoginStatus', true)
        })
      })
    },
    updateConsole(code) {
      const len = this.extraConsole.length
      this.extraConsole.splice(len, 0, code)
    },
    changeTypeList(checkType) {
      // The five Windows are arranged in sequence, so set it to 1~5 in data.typeListQueue, judge the window position according to the value size
      // checkType is an array,it is used to store the window currently displayed on the page
      if (checkType.length) {
        const arr = []
        const finalArr = []
        checkType.forEach(item => {
          arr.push(this.typeListQueue[item])
        })
        arr.sort((a, b) => {
          // Sort the elements in the arr from smallest to largest
          return a - b
        })
        arr.forEach(item => {
          // Replaces the value of the arr elements with the window,and push result into finalArr
          let str = ''
          switch (item) {
            case 1:
              str = this.HTMLPrep
              break
            case 2:
              str = this.CSSPrep
              break
            case 3:
              str = this.JSPrep
              break
            case 4:
              str = 'Console'
              break
            case 5:
              str = 'Output'
              break
          }
          finalArr.push(str)
        })
        this.types = finalArr
        this.changeAllWidth()
        return null
      }
      this.types = checkType
    },
    changeAllWidth() {
      // Change all window widths to : browser visible width / this.types.length
      // this.$store.state.textBoxW is used to store the width of each window
      const len = this.types.length
      const store = this.$store
      this.boxW = `${this.screenWidth / len}px`
      for (let item of this.types) {
        store.commit('updateTextBoxW', {
          attr: item,
          value: this.boxW
        })
      }
    },
    changeTabSpace(newVal) {
      this.tabSpace = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
#editor {
  width: 100%;
  height: 100%;
}
.code-box {
  display: flex;
  @include setWAndH(100%, calc(100% - 100px));
}
</style>
