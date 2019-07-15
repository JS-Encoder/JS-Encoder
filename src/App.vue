<template>
  <div id="app">
    <Header></Header>
    <SettingBar @changeTab="changeTabSpace" @hasChanged="changeTypeList"></SettingBar>
    <div class="code-box" ref="codeBox">
      <textareaBox
        :index="index"
        :key="item"
        :len="types.length"
        :space="tabSpace"
        :title="item"
        :typeList="types"
        class="textareaBox"
        v-for="(item,index) in types"
      ></textareaBox>
    </div>
    <router-view />
  </div>
</template>

<script>
import Header from './components/header'
import SettingBar from './components/settingBar'
import textareaBox from './components/textareaBox'
import { mapState } from 'vuex'
export default {
  name: 'App',
  data() {
    return {
      types: [],
      screenWidth: document.body.clientWidth,
      typeListQueue: {
        HTML: 1,
        MarkDown: 1,
        CSS: 2,
        JavaScript: 3,
        Console: 4,
        Output: 5
      },
      boxW: '',
      tabSpace: 2
    }
  },
  computed: {
    ...mapState({
      HTMLPrep: 'HTMLPrep',
      CSSPrep: 'CSSPrep',
      JSPrep: 'JSPrep'
    })
  },
  created() {
    this.types = [this.HTMLPrep, this.CSSPrep, this.JSPrep, 'Console', 'Output']
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
      for (let item of this.types) {
        let attr
        switch (item) {
          case 'HTML':
          case 'MarkDown':
            attr = 'HTML'
            break
          case 'CSS':
          case 'Sass':
            attr = 'CSS'
            break
          case 'JavaScript':
          case 'TypeScript':
            attr = 'JavaScript'
            break
          case 'Console':
            attr = 'Console'
            break
          case 'Output':
            attr = 'Output'
            break
        }
        const changeNum = parseFloat(this.$store.state.textBoxW[attr])
        this.$store.commit('updateTextBoxW', {
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
    changeTypeList(checkType) {
      // 由于html,css,js,console,output五个窗口是按照顺序排列的，因此在data.typeListQueue中设置为1~5，根据数值大小来判断窗口位置
      // checkType是数组，存放当前显示在页面的窗口
      // console.log(checkType)
      if (checkType.length) {
        const arr = [],
          finalArr = []
        checkType.forEach(item => {
          arr.push(this.typeListQueue[item]) // 将checkType元素在typeListQueue所对应的数值放到arr中
        })
        arr.sort((a, b) => {
          // 给arr中的元素从小到大排序
          return a - b
        })
        arr.forEach(item => {
          // 将arr的元素来替换成窗口名称，再push到finalArr中作为结果
          let str = ''
          if (item === 1) str = this.HTMLPrep
          else if (item === 2) str = this.CSSPrep
          else if (item === 3) str = this.JSPrep
          else if (item === 4) str = 'Console'
          else if (item === 5) str = 'Output'
          finalArr.push(str)
        })
        this.types = finalArr // 将finalArr赋给this.types，传给子组件textareaBox
        this.changeAllWidth()
        return null
      }
      this.types = checkType
    },
    changeAllWidth() {
      // 将所有窗口宽度改变为： 浏览器可见宽度 / this.types.length
      // vuex中textBoxW存放每个窗口宽度
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
.code-box {
  display: flex;
  width: 100%;
  height: calc(100% - 100px);
}
</style>

