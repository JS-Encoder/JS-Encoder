<template>
  <div id="app">
    <Header></Header>
    <SettingBar @hasChanged="changeTypeList" @changeTab="changeTabSpace"></SettingBar>
    <div :style="{height:txtBoxHeight}" class="code-box" ref="codeBox">
      <textareaBox
        :index="index"
        :key="item"
        :len="type.length"
        :title="item"
        :typeList="type"
        class="textareaBox"
        v-for="(item,index) in type"
        :space="tabSpace"
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
      screenHeight: document.body.clientHeight,
      txtBoxHeight: `${document.body.clientHeight - 100}px`,
      typeListQueue: {
        HTML: 1,
        CSS: 2,
        JavaScript: 3,
        Console: 4,
        Output: 5
      },
      boxW: '',
      tabSpace: 4
    }
  },
  mounted() {
    this.changeAllWidth()
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth
        this.screenHeight = document.body.clientHeight
      })()
    }
  },
  watch: {
    screenHeight(val) {
      if (!this.timerW) {
        this.screenHeight = val
        this.timerW = true
        this.txtBoxHeight = `${val - 100}px`
        setTimeout(() => {
          this.timerW = false
        }, 50)
      }
    },
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
    changeTabSpace(newVal){
      this.tabSpace = newVal
    }
  }
}
</script>

<style lang="scss" scoped>
.code-box {
  display: flex;
}
</style>

