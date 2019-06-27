<template>
  <div id="app">
    <Header></Header>
    <SettingBar @changeTab="changeTabSpace" @hasChanged="changeTypeList"></SettingBar>
    <div class="code-box" ref="codeBox">
      <textareaBox
        :index="index"
        :key="item"
        :len="type.length"
        :space="tabSpace"
        :title="item"
        :typeList="type"
        class="textareaBox"
        v-for="(item,index) in type"
      ></textareaBox>
    </div>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/header'
import SettingBar from './components/settingBar'
import textareaBox from './components/textareaBox'
export default {
  name: 'App',
  data() {
    return {
      type: ['HTML', 'CSS', 'JavaScript', 'Console', 'Output'],
      screenWidth: document.body.clientWidth,
      typeListQueue: {
        HTML: 1,
        CSS: 2,
        JavaScript: 3,
        Console: 4,
        Output: 5
      },
      boxW: '',
      tabSpace: 2
    }
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
      const changeW = (newVal - oldVal) / this.type.length
      for (let item of this.type) {
        const changeNum = parseFloat(this.$store.state.textBoxW[item])
        this.$store.state.textBoxW[item] = changeNum + changeW + 'px'
      }
    }
  },
  components: {
    Header,
    SettingBar,
    textareaBox
  },
  methods: {
    changeTypeList(val) {
      if (val.length) {
        const arr = [],
          finalArr = []
        val.forEach(item => {
          arr.push(this.typeListQueue[item])
        })
        arr.sort((a, b) => {
          return a - b
        })
        arr.forEach(item => {
          let str = ''
          if (item === 1) str = 'HTML'
          else if (item === 2) str = 'CSS'
          else if (item === 3) str = 'JavaScript'
          else if (item === 4) str = 'Console'
          else if (item === 5) str = 'Output'
          finalArr.push(str)
        })
        this.type = finalArr
        this.changeAllWidth()
        return
      }
      this.type = val
    },
    changeAllWidth() {
      const len = this.type.length
      this.boxW = `${this.screenWidth / len}px`
      for (let item of this.type) {
        this.$store.state.textBoxW[item] = this.boxW
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

