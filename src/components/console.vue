<template>
  <div class="console">
    <div :class="item.type" :key="index" v-for="(item, index) in consoleInfo">
      <div class="error-box" v-if="item.type === 'error' && item.data.msg">
        <i class="icon iconfont icon-error"></i>
        <span>{{item.data.msg}}</span>
        <br />
        <span>{{item.data.url}}</span>
        <br />
        <div>
          <span>row: {{item.data.row - 2}}</span>
          <span>col: {{item.data.col - 10}}</span>
        </div>
      </div>
      <div class="error-box" v-else-if="item.type === 'error'">
        <i class="icon iconfont icon-error"></i>
        <span>{{item.data}}</span>
      </div>
      <div class="warn-box" v-else-if="item.type === 'warn'">
        <i class="icon iconfont icon-jinggaoicon"></i>
        <span>{{item.data}}</span>
      </div>
      <span
        class="msg"
        v-else
      >{{item.data === undefined ? 'undefined' : item.data === null ? 'null' : item.data}}</span>
      <div class="line"></div>
    </div>
    <div class="input-box flex">
      <i class="cion iconfont icon-jiantou"></i>
      <div
        @keyup.enter="sendCommand"
        class="input-text"
        contenteditable="plaintext-only"
        spellcheck="false"
        type="text"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    consoleInfo() {
      return this.$store.state.consoleInfo
    }
  },
  methods: {
    sendCommand(e) {
      let text = e.srcElement.innerText
      const code = text.replace(/^\n+|\n+$/g, '')
      const exeCode = `try{console.log('${code}');var r=eval(${code});console.log(r)}catch(e){console.log(e);}`
      this.$emit('updateConsole', exeCode)
      e.srcElement.innerText = ''
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/console.scss" scoped></style>
