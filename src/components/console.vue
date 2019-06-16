<template>
  <div class="console">
    <div :class="item.type" :key="index" v-for="(item, index) in consoleInfo">
      <div class="error-box" v-if="item.type === 'error'">
        <span>{{item.data.msg}}</span>
        <br>
        <span>{{item.data.url}}</span>
        <br>
        <div>
          <span>row: {{item.data.row}}</span>
          <span>col: {{item.data.col}}</span>
        </div>
      </div>
      <span class="msg" v-else>{{item.data}}</span>
      <div class="line"></div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    consoleInfo() {
      return this.$store.state.consoleInfo
    }
  }
}
</script>
<style lang="scss" scoped>
.console {
  color: #ffffff;
  width: 100%;
  height: 100%;
  font-size: 14px;
  box-sizing: border-box;
  overflow: auto;
  .msg,
  .error-box {
    width: 100%;
    word-break: break-all;
    white-space: normal;
    margin: 4px 0;
    padding: 0 4px;
    box-sizing: border-box;
  }
  .msg {
    display: inline-block;
  }
  .line {
    width: 100%;
    height: 1px;
    border-top: 1px dashed #999;
  }
  .error-box {
    div{
      text-align: right;
      color: gray;
    }
  }
}
.error {
  color: red;
}
.log {
  color: #f2f2f2;
}
</style>
