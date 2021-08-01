<template>
  <div id="instance">
    <div class="instance-content">
      <InstanceHeader></InstanceHeader>
      <div class="main-body flex">
        <Sidebar class="flex-sh"></Sidebar>
        <div class="flex flex-1 area">
          <div class="code-area flex flex-clo" :style="{ width: `${editorWidth}px` }">
            <EditorTabBar></EditorTabBar>
            <MarkdownTools :getCodeMirror="getCodeMirror" :getIframeBody="getIframeBody"
              v-if="mdToolbarVisible && currentTab === 'Markdown'">
            </MarkdownTools>
            <Editor @runCode="runCode" :ref="'editor' + index" class="flex-1" v-for="(item, index) in preprocessor"
              :key="index" :codeMode="item" :index="index" @cursorPosChanged="cursorPosChanged"
              :showCodeArea="item === currentTab" v-show="item === currentTab">
            </Editor>
          </div>
          <div v-if="resizeVisible" class="resize borbox" @mousedown="viewResize"></div>
          <div class="view-area flex flex-clo" :style="{ width: `${iframeWidth}px` }">
            <ViewTabBar @fullScreen="changeFullScreenState" @runCode="runCode"></ViewTabBar>
            <div class="iframe-box" :style="{ height: `${iframeHeight}px` }"
              :class="iframeFullScreen ? 'full-screen' : ''">
              <div class="iframe-screen noselect" v-show="iframeScreenVisible"></div>
              <FullScreenBar :getIframeBody="getIframeBody" @runCode="runCode" v-show="iframeFullScreen"
                @exitFullScreen="changeFullScreenState"></FullScreenBar>
              <iframe
                allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
                frameborder="0" id="iframe" name="iframe" ref="iframeBox"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                scrolling="yes" allowfullscreen="true" :src="`${publicPath}html/instance.html`"></iframe>
              <div class="iframe-width noselect" v-show="showIframeWidth">{{ iframeWidth }}px</div>
            </div>
            <div class="console-box" :style="{ height: `${consoleHeight}px` }">
              <Console></Console>
            </div>
          </div>
        </div>
      </div>
      <InstanceFooter :isCompiling="isCompiling" :cursorPos="cursorPos"></InstanceFooter>
    </div>
    <Preprocessor></Preprocessor>
    <Library></Library>
    <Settings></Settings>
    <Upload></Upload>
    <Download></Download>
    <Shortcut></Shortcut>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
/* components */
import InstanceHeader from '@components/instance/InstanceHeader.vue'
import InstanceFooter from '@components/instance/InstanceFooter.vue'
import Sidebar from '@components/instance/Sidebar.vue'
import ViewTabBar from '@components/instance/ViewTabBar.vue'
import EditorTabBar from '@components/instance/EditorTabBar.vue'
import Preprocessor from '@components/instance/Preprocessor.vue'
import Library from '@components/instance/Library.vue'
import Settings from '@components/instance/Settings.vue'
import Upload from '@components/instance/Upload.vue'
import Download from '@components/instance/Download.vue'
import Shortcut from '@components/instance/Shortcut.vue'
import MarkdownTools from '@components/MarkdownTools.vue'
import Editor from '@components/Editor.vue'
import Console from '@components/Console.vue'
import FullScreenBar from '@components/FullScreenBar.vue'
/* scripts */
import { compileHTML, compileCSS, compileJS } from '@utils/compiler'
import { deepCopy } from '@utils/tools'
import SyncScroll from '@utils/syncScroll'
import IframeHandler from '@utils/handleInstanceView'
import IframeConsole from '@utils/console'
import ShortcutHandler from '@utils/handleShortcut'
import iframeLinks from '@utils/iframeLinks'
import handleLoop from '@utils/handleLoop'

export default {
  data() {
    return {
      resizeVisible: true,
      publicPath: process.env.BASE_URL,
      clientWidth: window.innerWidth,
      clientHeight: document.body.clientHeight,
      isChildrenMounted: false,
      iframeFullScreen: false,
      iframeInit: false,
      consoleInfo: [],
      isCompiling: false,
      cursorPos: { col: 1, ln: 1 },
      showIframeWidth: false,
    }
  },
  components: {
    InstanceHeader,
    Sidebar,
    EditorTabBar,
    Editor,
    ViewTabBar,
    Console,
    Preprocessor,
    Library,
    Settings,
    Upload,
    Download,
    Shortcut,
    FullScreenBar,
    InstanceFooter,
    MarkdownTools,
  },
  mounted() {
    this.$nextTick(() => {
      this.isChildrenMounted = true
      // Initialize the shortcut key
      new ShortcutHandler().install()
      // Initialize console and execute the code once
      new IframeConsole(this.$refs.iframeBox)
      this.runCode().then(() => {
        this.iframeInit = true
      })
    })
  },
  computed: {
    ...mapState([
      'preprocessor',
      'mdToolbarVisible',
      'currentTab',
      'iframeScreenVisible',
      'iframeHeight',
      'consoleHeight',
      'editorWidth',
      'iframeWidth',
      'instanceCode',
      'instanceSetting',
      'instanceExtLinks',
      'consoleSettings',
    ]),
    isMD() {
      return this.preprocessor[0] === 'Markdown'
    },
  },
  watch: {
    consoleInfo(newLogs) {
      this.handleConsoleInfo(newLogs)
    },
    isMD(newVal) {
      this.runCode()
      if (!newVal) new SyncScroll().clearSyncScroll()
    },
  },
  methods: {
    ...mapMutations([
      'handleIframeW',
      'handleIframeScreenVisible',
      'handleIframeWVisible',
      'handleEditorW',
      'handleConsoleInfo',
      'handleConsoleInfoCount',
    ]),
    viewResize(e) {
      // Drag the dividing line with mouse to change the width of iframe and editor
      // Display the mask on iframe, otherwise it will effect mouse drag
      this.handleIframeScreenVisible(true)
      // Display the current width of iframe
      this.handleIframeWVisible(true)
      const starX = e.clientX
      const viewW = this.iframeWidth
      const editorW = this.editorWidth
      const wholeW = viewW + editorW
      document.onmousemove = (ev) => {
        const iEvent = ev || event
        const finW = editorW + iEvent.clientX - starX
        if (finW > 100 && wholeW - finW > 100) {
          this.handleEditorW(finW)
          this.handleIframeW(wholeW - finW)
          this.showIframeWidth = true
        }
        document.onmouseup = () => {
          this.handleIframeScreenVisible(false)
          this.handleIframeWVisible(false)
          document.onmouseup = null
          document.onmousemove = null
          this.showIframeWidth = false
          // Refresh the codemirror to update editor after drag is over
          const index = this.preprocessor.indexOf(this.currentTab)
          this.getCodeMirror(index).refresh()
        }
      }
    },
    async runCode(daley = 0) {
      if (!daley) daley = this.instanceSetting.delayTime
      // Display the compile load animation at instance footer
      this.isCompiling = true
      const iframe = this.$refs.iframeBox
      const code = this.instanceCode
      const prep = this.preprocessor
      let links = {}
      const isMD = this.isMD
      let HTMLCode = '',
        CSSCode = '',
        JSCode = ''
      const docConsole = new IframeConsole()
      // No need to reload iframe when execute code at first time or when preprocessor is markdown
      if (!isMD) {
        if (this.iframeInit) {
          // Reload is essential because the old javascript code has effective for iframe
          iframe.src += ''
          // 使用reload重载似乎在新版chrome和edge中会加载外部的vueApp，因此使用src代替
          // iframe.contentWindow.location.reload()
          const consoleSettings = this.consoleSettings
          if (consoleSettings.clear) {
            docConsole.clear()
            this.handleConsoleInfo([])
          }
          await new Promise((resolve) => {
            iframe.onload = () => {
              docConsole.refresh(iframe)
              iframe.onload = null
              resolve()
            }
          })
        }
        await compileCSS(code.CSS, prep[1]).then((res) => {
          CSSCode = res
        })
        await compileJS(code.JavaScript, prep[2]).then((res) => {
          // Switch raw JavaScript code to code that prevents infinite loops
          JSCode = handleLoop(res)
        })
        // Deep copy the external links to avoid the effect state
        links = deepCopy(this.instanceExtLinks)
        // add common js to links
        links.JSLinks = [...links.JSLinks, ...iframeLinks.commonJS]
      } else {
        // Load the highlight and KaTeX when the preprocessor is markdown
        links.cssLinks = iframeLinks.mdCSS
        links.JSLinks = iframeLinks.mdJS
      }
      await compileHTML(code.HTML, prep[0]).then((res) => {
        HTMLCode = res
      })
      setTimeout(async () => {
        const handler = new IframeHandler(iframe)
        const headTags = this.instanceSetting.headTags
        await handler
          .insertCode({ HTMLCode, CSSCode, JSCode }, links, isMD, headTags)
          .then((callback) => {
            iframe.contentWindow.onerror = (msg, _, row, col) => {
              docConsole.consoleInfo.push({
                type: 'system-error',
                content: msg,
                row,
                col,
              })
              return void 0
            }
            callback()
          })
        const logs = docConsole.getLogs()
        this.calcConsoleInfoCount(logs)
        this.consoleInfo = logs
        if (isMD) this.initSyncScroll(iframe)
        this.isCompiling = false
      }, daley)
    },
    initSyncScroll(iframe) {
      // Initialize the sync scroll for markdown
      if (!iframe) iframe = this.$refs.iframeBox
      new SyncScroll(this.getCodeMirror(0), iframe)
    },
    changeFullScreenState(visible) {
      this.iframeFullScreen = visible
    },
    getCodeMirror(index) {
      // Get the instance of cm after the child components mounted successful
      return this.isChildrenMounted
        ? this.$refs[`editor${index}`][index].getCodeMirror()
        : void 0
    },
    getIframeBody() {
      return this.$refs.iframeBox
    },
    cursorPosChanged(pos) {
      this.cursorPos = pos
    },
    calcConsoleInfoCount(consoleInfo) {
      const consoleInfoCount = { error: 0, warn: 0, info: 0 }
      for (let item of consoleInfo) {
        const type = item.type
        switch (item.type) {
          case 'error':
          case 'warn':
          case 'info':
            consoleInfoCount[type]++
          case 'system-error':
            consoleInfoCount.error++
        }
      }
      this.handleConsoleInfoCount(consoleInfoCount)
    },
  },
}
</script>

<style lang="scss" scoped>
#instance {
  width: 100%;
  height: 100%;
  background-color: $mainColor;
  overflow: hidden;
  .instance-content {
    width: 100%;
    height: 100%;
    .main-body {
      height: calc(100% - 61px);
      .area {
        .resize {
          width: 4px;
          height: 100%;
          border: 2px solid $secondColor;
          cursor: w-resize;
          @include setTransition(all, 0.3s, ease);
          &:hover {
            border-color: $primary;
          }
        }
        .view-area {
          .iframe-box {
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            transform-origin: top right;
            .iframe-screen {
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.3);
              position: absolute;
              z-index: 1;
            }
            iframe {
              width: 100%;
              height: 100%;
            }
            .iframe-height,
            .iframe-width {
              position: absolute;
              bottom: 0;
              left: 0;
              color: $beforeFocus;
              background-color: $secondColor;
              border: 1px solid $mainColor;
              z-index: 2;
              font-size: 12px;
              padding: 4px;
            }
          }
          .full-screen {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 2000;
            width: 100% !important;
            height: 100% !important;
          }
          .console-box {
            width: 100%;
            height: 150px;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
