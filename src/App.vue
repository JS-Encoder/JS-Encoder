<template>
  <div id="app">
    <transition name="fade">
      <div v-show="!loaded" class="loader flex flex-jcc">
        <div class="loader-content flex flex-clo flex-ai">
          <PageLoader class="page-loader"></PageLoader>
          <span class="tip">{{ loadLang.init }}</span>
        </div>
      </div>
    </transition>
    <Instance></Instance>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import storage from '@utils/localStorage'
import PageLoader from '@components/PageLoader.vue'
import Instance from '@views/Instance.vue'
export default {
  name: 'App',
  components: {
    PageLoader,
    Instance,
  },
  data () {
    return {
      loaded: false,
      clientWidth: window.innerWidth,
      clientHeight: document.body.clientHeight,
    }
  },
  mounted () {
    setTimeout(() => {
      const { clientHeight: clientH, clientWidth: clientW } = document.body
      /**
       * The height of iframe is equal to client height subtract header, console and footer height
       * iframe的高度等于整个可见窗口高度减去header、console和底部信息栏的高度
       */
      const iframeH = clientH - this.consoleHeight - 41 - 30 - 20
      this.handleIframeH(iframeH)
      /**
       * Divide the editor and iframe widths equally
       * Need to subtract the width of left sidebar and cutting line
       * 将iframe和编辑窗口的宽度等分，需要减去分割线和侧边工具栏的宽度
       */
      const avgW = (clientW - 41 - 4) / 2
      if (avgW % 1 !== 0) {
        const floorAvg = Math.floor(avgW)
        this.handleIframeW(floorAvg)
        this.handleEditorW(floorAvg + 1)
      } else {
        this.handleIframeW(avgW)
        this.handleEditorW(avgW)
      }
      window.onresize = () => {
        this.clientWidth = window.innerWidth
        this.clientHeight = document.documentElement.clientHeight
      }
      /**
       * Hidden the page loader animation
       * 完成后隐藏全页面的加载动画
       */
      this.loaded = true
      // Show the templates dialog
      const hiddenAutoTmp = storage.get('hiddenAutoTmp')
      if (!hiddenAutoTmp) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$store.commit('handleDialogState', 'templates')
          }, 500)
        })
      }
    }, 2500)
  },
  computed: {
    ...mapState([
      'iframeHeight',
      'consoleHeight',
      'editorWidth',
      'iframeWidth',
    ]),
    loadLang () {
      return this.$t('instance').loader
    },
  },
  watch: {
    clientWidth (newW, oldW) {
      /**
       * Change the editor and iframe widths when the browser's visible are width changed
       * The width of them cannot be less than 100px, if any one reaches the minimal width, only change the other one's width
       * 当可见窗口宽度改变时，更改编辑窗口和iframe的宽度
       * 但这两个窗口的宽度不小于100px，如果任意一个窗口达到了最小值，只改变另一个窗口的宽度
       */
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
    clientHeight (newH, oldH) {
      /**
       * Change the iframe and console heights when the browser's visible area height changed
       * The height of console and iframe cannot be less than 25px and 100px, if any one reaches the minimal width, only change the other one's width
       * 当可见窗口高度改变时，修改iframe和console的宽度
       * console和iframe的高度不能小于25px和100px，如果任意一个窗口达到了最小值，只改变另一个窗口的高度
       */
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
#app {
  font-family: $font;
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
