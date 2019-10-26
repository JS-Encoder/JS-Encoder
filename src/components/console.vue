<template>
  <div class="console">
    <div :class="item.type" :key="index" v-for="(item, index) in consoleInfo">
      <div class="error-box" v-if="item.type === 'error' && item.data.msg">
        <i class="icon iconfont icon-error"></i>
        <span>{{item.data.msg}}</span>
        <br>
        <span class="error-url">{{item.data.url}}</span>
        <br>
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
      <div class="return-box flex" v-else-if="item.type === 'return'">
        <i class="icon iconfont icon-u-return"></i>
        <pre>{{item.data === undefined ? 'undefined' : item.data === null ? 'null' : item.data}}</pre>
      </div>
      <span
        class="msg"
        v-else
      >{{item.data === undefined ? 'undefined' : item.data === null ? 'null' : item.data}}</span>
      <div class="line"></div>
    </div>
    <div class="input-box flex">
      <i class="icon iconfont icon-jiantou"></i>
      <div
        @input="change"
        @keydown.down="switchNextInfo"
        @keydown.up="switchLastInfo"
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
  data() {
    return {
      commandHistory: [],
      historyIndex: 0,
      value: ''
    }
  },
  computed: {
    consoleInfo() {
      return this.$store.state.consoleInfo
    }
  },
  watch: {
    value(newVal) {
      const len = this.commandHistory.length
      this.commandHistory.splice(len - 1, 1, this.value)
    }
  },
  methods: {
    change(e) {
      // press enter can trigger input, need to return when the enter was pressed
      const data = e.data
      const inputType = e.inputType

      if (data === null) {
        if (inputType === 'insertLineBreak' || inputType === 'insertText')
          return
      }

      this.value = e.srcElement.innerText
    },
    sendCommand(e) {
      // press enter to push code to iframe
      let text = e.srcElement.innerText
      const code = text.replace(/^\n+|\n+$/g, '')

      this.$emit('updateConsole', code)
      e.srcElement.innerText = ''

      this.commandHistory.push('')
      // record history index
      this.historyIndex = this.commandHistory.length - 1
    },
    switchLastInfo(e) {
      const position = this.getCursorPosition()

      if (position.start !== 0 && position.end !== 0) return

      const history = this.getCommandHistory(-1)

      if (history) e.srcElement.innerText = history
    },
    switchNextInfo(e) {
      const position = this.getCursorPosition()
      const len = e.srcElement.innerText.length

      if (position.start !== len && position.end !== len) return

      const history = this.getCommandHistory(1)

      if (history || history === '') e.srcElement.innerText = history
    },
    getCursorPosition() {
      // get cursor position
      const range = window.getSelection().getRangeAt(0)
      const start = range.startOffset
      const end = range.endOffset

      return {
        start,
        end
      }
    },
    getCommandHistory(num) {
      const list = this.commandHistory
      const newIndex = this.historyIndex + num + 1
      const history = list[newIndex]

      if (history || history === '') this.historyIndex += num

      return history
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/console.scss" scoped></style>
