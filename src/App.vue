<template>
  <div id="app">
    <div v-show="!loaded" class="loader flex flex-jcc">
      <div class="loader-content flex flex-clo flex-ai">
        <PageLoader class="page-loader"></PageLoader>
        <span class="tip">{{ loadLang.init }}</span>
      </div>
    </div>
    <Instance></Instance>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PageLoader from '@components/PageLoader.vue'
import Instance from '@views/Instance.vue'
export default {
  name: 'App',
  components: {
    PageLoader,
    Instance,
  },
  data() {
    return {
      loaded: false,
      clientWidth: window.innerWidth,
      clientHeight: document.body.clientHeight,
    }
  },
  mounted() {
    setTimeout(() => {
      const { clientHeight: clientH, clientWidth: clientW } = document.body
      // The height of iframe is equal to client height subtract header and console height
      const iframeH = clientH - this.consoleHeight - 41 - 30
      this.handleIframeH(iframeH)
      // Divide the editor and iframe widths equally
      // Need to subtract the width of left sidebar and cutting line
      const avgW = (clientW - 41 - 4) / 2
      if (avgW % 1 !== 0) {
        const floorAvg = Math.floor(avgW)
        this.handleIframeW(floorAvg)
        this.handleEditorW(floorAvg + 1)
      } else {
        this.handleIframeW(avgW)
        this.handleEditorW(avgW)
      }
      // Monitor the width and height of browser's visible area
      window.onresize = () => {
        this.clientWidth = window.innerWidth
        this.clientHeight = document.documentElement.clientHeight
      }
      // Hidden the page loader animation
      this.loaded = true
    }, 3000)
  },
  computed: {
    ...mapState([
      'iframeHeight',
      'consoleHeight',
      'editorWidth',
      'iframeWidth',
    ]),
    loadLang() {
      return this.$t('instance').loader
    },
  },
  watch: {
    clientWidth(newW, oldW) {
      // Change the editor and iframe widths when the browser's visible are width changed
      // The width of them cannot be less than 100px, if any one reaches the minimal width, only change the other one's width
      const editorW = this.editorWidth
      const iframeW = this.iframeWidth
      const gapW = newW - oldW
      if (editorW <= 100 && iframeW <= 100 && gapW < 0) {
        return void 0
      }
      if (editorW <= 100 && gapW < 0) {
        this.handleIframeW(iframeW + gapW)
        return void 0
      } else if (iframeW <= 100 && gapW < 0) {
        this.handleEditorW(editorW + gapW)
        return void 0
      }
      const avgW = gapW / 2
      this.handleIframeW(iframeW + avgW)
      this.handleEditorW(editorW + avgW)
    },
    clientHeight(newH, oldH) {
      // Change the iframe and console heights when the browser's visible area height changed
      // The height of console and iframe cannot be less than 25px and 100px, if any one reaches the minimal width, only change the other one's width
      const iframeH = this.iframeHeight
      const consoleH = this.consoleHeight
      const gapH = newH - oldH
      if (consoleH <= 25 && iframeH <= 100 && gapH < 0) {
        return void 0
      }
      if (consoleH <= 25 && gapH < 0) {
        this.handleIframeH(iframeH + gapH)
        return void 0
      } else if (iframeH <= 100 && gapH < 0) {
        this.handleConsoleH(consoleH + gapH)
        return void 0
      }
      const avgH = gapH / 2
      this.handleIframeH(iframeH + avgH)
      this.handleConsoleH(consoleH + avgH)
    },
  },
  methods: {
    ...mapMutations([
      'handleIframeH',
      'handleIframeW',
      'handleEditorW',
      'handleConsoleH',
    ]),
  },
}
</script>

<style lang="scss">
@include scrollBar();
@include keyframes(bgc-fade) {
  0%,
  100% {
    background-color: $thirdColor;
  }
  50% {
    background-color: $deep;
  }
}
#app {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
    Microsoft YaHei, SimSun, sans-serif;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  position: relative;
  .loader {
    width: 100%;
    height: 100%;
    background-color: $mainColor;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 100;
    @include animation(bgc-fade, 3s, 0s, ease, infinite);
    .loader-content {
      margin-top: 100px;
      .page-loader {
        width: 250px;
        height: 200px;
      }
      .tip {
        font-size: 16px;
        color: $afterFocus;
      }
    }
  }
}
</style>
