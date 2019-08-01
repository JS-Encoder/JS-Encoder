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
<style lang="scss" scoped>
$BKColor: #f2f2f2;

@mixin setWAndH($width: auto, $height: auto) {
  width: $width;
  height: $height;
}

.font-warp {
  word-break: break-all;
  white-space: normal;
}

.bdBox {
  box-sizing: border-box;
}

.info-public-style {
  @include setWAndH(100%, 100%);
  @extend .font-warp;
  @extend .bdBox;
  margin: 4px 0;
  padding: 0 4px;
}

.console {
  color: $BKColor;
  @include setWAndH(100%, 100%);
  @extend .bdBox;
  font-size: 14px;
  overflow: auto;
  .msg {
    @extend .info-public-style;
    display: inline-block;
  }
  .error-box,
  .warn-box {
    @extend .info-public-style;
    i {
      font-size: 12px;
    }
    div {
      text-align: right;
      color: #999;
    }
  }
  .line {
    @include setWAndH(100%, 1px);
    border-top: 1px dashed #999;
  }
  .input-box {
    @extend .info-public-style;
    height: auto;
    margin: 4px 0;
    i {
      font-size: 10px;
      margin-top: 3px;
      color: #1989fa;
    }
    .input-text {
      background-color: transparent;
      border: none;
      color: #f2f2f2;
      width: calc(100% - 22px);
      outline: none;
      resize: none;
      height: auto;
      overflow-x: hidden;
      overflow-y: auto;
      word-wrap: break-word;
      padding: 0 4px;
      box-sizing: border-box;
    }
  }
}
.error {
  color: #ff0000;
}
.warn {
  color: orange;
}
</style>
