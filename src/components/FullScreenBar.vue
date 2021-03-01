<template>
  <div id="fullScreenBar" class="borbox">
    <div class="scale-box flex flex-ai flex-jcc">
      <span class="proportion">{{scale}}%</span>
      <el-slider v-model="scale" :show-tooltip="false" :step="25" show-stops :min="25" :max="500">
      </el-slider>
    </div>
    <div class="opt-list flex">
      <div class="opt flex flex-ai flex-jcc" @click="refresh">
        <i class="icon iconfont icon-zhongzhi"></i>
      </div>
      <div class="opt flex flex-ai flex-jcc" @click="exitFullScreen">
        <i class="icon iconfont icon-suoxiao"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    getIframeBody: Function
  },
  data() {
    return {
      scale: 100
    }
  },
  methods: {
    refresh() {
      this.$emit('runCode')
    },
    exitFullScreen() {
      const iframe = this.$props.getIframeBody()
      const style = iframe.contentWindow.document.body.style
      style.transformOrigin = '0 0'
      style.transform = 'scale(1)'
      this.$emit('exitFullScreen', false)
    }
  },
  watch: {
    scale(newScale) {
      const iframe = this.$props.getIframeBody()
      const style = iframe.contentWindow.document.body.style
      newScale /= 100
      !style.transformOrigin && (style.transformOrigin = 'top left')
      style.width = `calc(100vw/${newScale})`
      style.transform = `scale(${newScale})`
    }
  }
}
</script>

<style lang="scss" scoped>
#fullScreenBar {
  width: 100%;
  height: 41px;
  border-bottom: 1px solid $deep;
  position: relative;
  background-color: $thirdColor;
  .opt-list {
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    .opt {
      width: 50px;
      height: 100%;
      color: $beforeFocus;
      cursor: pointer;
      &:hover {
        color: $afterFocus;
      }
      i {
        font-size: 22px;
      }
      .icon-zhongzhi {
        font-size: 24px;
      }
    }
  }
  .scale-box {
    width: 300px;
    height: 100%;
    color: $afterFocus;
    .proportion {
      margin-right: 20px;
    }
    .el-slider {
      width: 200px;
      height: 100%;
    }
  }
}
</style>
