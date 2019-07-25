<template>
  <div class="console">
    <div :class="item.type" :key="index" v-for="(item, index) in consoleInfo">
      <div class="error-box" v-if="item.type === 'error'">
        <i class="icon iconfont icon-error"></i>
        <span>{{item.data.msg}}</span>
        <br />
        <span>{{item.data.url}}</span>
        <br />
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
  .error-box {
    @extend .info-public-style;
    i {
      @include setWAndH(16px, 16px);
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
}
.error {
  color: #ff0000;
}
</style>
