<template>
  <div id="instance">
    <div class="instance-content">
      <InstanceHeader></InstanceHeader>
      <div class="main-body flex">
        <Sidebar class="flex-sh"></Sidebar>
        <div class="flex flex-1 area">
          <div class="code-area flex flex-clo" :style="{ width: `${editorWidth}px` }">
            <EditorTabBar @selectTool="selectTool"></EditorTabBar>
            <MarkdownTools :getCodeMirror="getCodeMirror" :getIframeBody="getIframeBody"
              v-if="mdToolbarVisible && currentTab === 'Markdown'">
            </MarkdownTools>
            <template v-if="cpntMode">
              <CpntEditor ref="cpntEditor" class="flex-1" @cursorPosChanged="cursorPosChanged" @runCode="runCode"></CpntEditor>
            </template>
            <template v-else>
              <Editor :ref="'editor' + index" class="flex-1" v-for="(item, index) in preprocessor"
                :key="index" :codeMode="item" :index="index" @cursorPosChanged="cursorPosChanged"
                @runCode="runCode" :showCodeArea="item === currentTab" v-show="item === currentTab">
              </Editor>
            </template>
          </div>
          <div v-if="resizeVisible" class="resize borbox" @mousedown="viewResize"></div>
          <div class="view-area flex flex-clo" :style="{ width: `${iframeWidth}px` }">
            <ViewTabBar @fullScreen="changeFullScreenState" @runCode="runCode"></ViewTabBar>
            <div class="iframe-box" :style="{ height: `${iframeHeight}px` }"
              :class="iframeFullScreen ? 'full-screen' : ''">
              <div class="iframe-screen noselect" v-show="iframeScreenVisible"></div>
              <FullScreenBar :getIframeBody="getIframeBody" @runCode="runCode" v-show="iframeFullScreen"
                @exitFullScreen="changeFullScreenState"></FullScreenBar>
              <iframe title="Preview"
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
    <Templates></Templates>
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
import Templates from '@components/instance/Templates.vue'
import Preprocessor from '@components/instance/Preprocessor.vue'
import Library from '@components/instance/Library.vue'
import Settings from '@components/instance/Settings.vue'
import Upload from '@components/instance/Upload.vue'
import Download from '@components/instance/Download.vue'
import Shortcut from '@components/instance/Shortcut.vue'
import MarkdownTools from '@components/MarkdownTools.vue'
import Editor from '@components/Editor.vue'
import CpntEditor from '@components/CpntEditor.vue'
import Console from '@components/Console.vue'
import FullScreenBar from '@components/FullScreenBar.vue'
/* scripts */
import { compileHTML, compileCSS, compileJS, compileVue2, compileVue3 } from '@utils/compiler'
import { deepCopy } from '@utils/tools'
import SyncScroll from '@utils/syncScroll'
import IframeHandler from '@utils/handleInstanceView'
import IframeConsole from '@utils/console'
import ShortcutHandler from '@utils/handleShortcut'
import { iframeLinks } from '@utils/cdn'
import handleLoop from '@utils/handleLoop'
import { judgeMode } from '@utils/judgeMode'

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
    Templates,
    Preprocessor,
    Library,
    Settings,
    Upload,
    Download,
    Shortcut,
    FullScreenBar,
    InstanceFooter,
    MarkdownTools,
    CpntEditor,
  },
  mounted() {
    this.$nextTick(() => {
      this.isChildrenMounted = true
      /**
       * Initialize the shortcut key
       * 初始化快捷键
       */
      new ShortcutHandler().install()
      /**
       * Initialize console and execute the code once
       * 一开始就初始化console并执行代码
       */
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
      'cpntMode',
      'cpntName',
      'cpntCode'
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
      /**
       * Drag the dividing line with mouse to change the width of iframe and editor
       * 用鼠标拖动分割线改变编辑器和预览窗口的宽度
       */

      /**
       * Display the mask on iframe, otherwise it will effect mouse drag
       * 拖动时需要在iframe上显示一个遮罩层，否则鼠标滑动到iframe中会影响拖动事件监听
       */
      this.handleIframeScreenVisible(true)
      /**
       * Display the current width of iframe
       * 拖动时显示预览窗口宽度
       */
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
          /**
           * Refresh the codemirror to update editor after drag is over
           * 在拖动时由于编辑窗口宽度改变，需要刷新codemirror来适应新的宽度
           */
          const index = this.preprocessor.indexOf(this.currentTab)
          this.getCodeMirror(index).refresh()
        }
      }
    },
    async runCode() {
      /**
       * Display the compile load animation at instance footer
       * 执行代码时，在底部的信息栏展示loading动画
       */
      this.isCompiling = true
      const iframe = this.$refs.iframeBox
      const docConsole = new IframeConsole()
      let HTMLCode = '',
        CSSCode = '',
        JSCode = ''
      const code = this.instanceCode
      const prep = this.preprocessor
      let links = {}
      const isMD = this.isMD
      /**
       * No need to reload iframe when execute code at first time or when preprocessor is markdown
       * 在markdown模式下不需要重新引入iframe，因为改变的只是html而已
       */
      if (!isMD || this.cpntMode) {
        if (this.iframeInit) {
          /**
           * Reload is essential because the old javascript code has effective for iframe
           * 在非markdown模式下必须重新加载iframe来避免上一次执行的javascript代码影响到新代码的执行结果
           */
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
        if (this.cpntMode) {
          switch (this.cpntName) {
            case 'Vue2': {
              ;({HTMLCode, CSSCode, JSCode} = compileVue2(this.cpntCode))
              break
            }
            case 'Vue3': {
              ;({HTMLCode, CSSCode, JSCode} = compileVue3(this.cpntCode))
              break
            }
          }
          
        } else {
          await compileCSS(code.CSS, prep[1]).then((res) => {
            CSSCode = res
          })
          await compileJS(code.JavaScript, prep[2]).then((res) => {
            /**
             * Switch raw JavaScript code to code that prevents infinite loops
             * 将JavaScript源代码通过AST在内部插入可以监听并阻止死循环的代码
             */
            JSCode = handleLoop(res)
          })
        }
        /**
         * Deep copy the external links to avoid the effect state
         * 因为接下来可能需要动态修改外部链接，因此这里需要深拷贝一下
         */
        links = deepCopy(this.instanceExtLinks)
        /**
         * add common js to links
         * 除了用户添加的自定义脚本链接，还有一些公共的内部脚本需要导入
         */
        links.JSLinks = [...links.JSLinks, ...iframeLinks.commonJS]
      } else {
        /**
         * Load the highlight and KaTeX when the preprocessor is markdown
         * 为markdown加载代码高亮和KaTeX公式转换功能
         */
        links.cssLinks = iframeLinks.mdCSS
        links.JSLinks = iframeLinks.mdJS
      }
      if(!this.cpntMode){
        await compileHTML(code.HTML, prep[0]).then((res) => {
          HTMLCode = res
        })
      }
      setTimeout(async () => {
        const handler = new IframeHandler(iframe)
        const headTags = this.instanceSetting.headTags
        const onerror = (msg, _, row, col) => {
          docConsole.consoleInfo.push({
            type: 'system-error',
            content: msg,
            row,
            col,
          })
          return void 0
        }
        const onunhandledrejection = (e) => {
          docConsole.consoleInfo.push({
            type: 'error',
            content: `Unhandled promise rejection: ${e.reason}`,
          })
        }
        await handler
          .insertCode(
            { HTMLCode, CSSCode, JSCode },
            links,
            isMD,
            headTags,
            onerror,
            onunhandledrejection
          )
          .then((callback) => {
            callback()
          })
        let logs = docConsole.getLogs()
        /**
         * Error alarms are generated when the number of logs exceeds 1000
         * 日志超出1000条弹出错误警报
         */
        if (logs.length > 1000) {
          logs = logs.slice(0, 999)
          logs.push({
            type: 'error',
            content: 'You have over 1000 logs on the Console, rendering too many logs will cause the page to stage. please use your browser Console to view more logs!'
          })
        }
        this.calcConsoleInfoCount(logs)
        this.consoleInfo = logs
        if (isMD) this.initSyncScroll(iframe)
        this.isCompiling = false
      }, 200)
    },
    initSyncScroll(iframe) {
      /**
       * Initialize the sync scroll for markdown
       * 初始化markdown同步滚动功能
       */
      if (!iframe) iframe = this.$refs.iframeBox
      new SyncScroll(this.getCodeMirror(0), iframe)
    },
    changeFullScreenState(visible) {
      this.iframeFullScreen = visible
    },
    selectTool(toolName){
      if(this.isChildrenMounted){
        switch(toolName){
          case 'format': {
            const mode = judgeMode(this.currentTab)
            const tabs = [ 'HTML', 'CSS', 'JavaScript' ]
            const index = tabs.indexOf(mode)
            this.$refs[`editor${index}`][0].format()
          }
        }
      }
    },
    getCodeMirror(index) {
      /**
       * Get the instance of cm after the child components mounted successful
       * 仔codemirror组件挂载完毕，获取其内部方法
       */
      if (this.isChildrenMounted) {
        if (this.cpntMode) {
          return this.$refs.cpntEditor.getCodeMirror()
        } else {
          return this.$refs[`editor${index}`][0].getCodeMirror()
        }
      }
      return void 0
    },
    getIframeBody() {
      return this.$refs.iframeBox
    },
    cursorPosChanged(pos) {
      this.cursorPos = pos
    },
    calcConsoleInfoCount(consoleInfo) {
      const consoleInfoCount = {
        error: 0,
        warn: 0,
        info: 0,
        sum: consoleInfo.length,
      }
      for (let item of consoleInfo) {
        const type = item.type
        switch (item.type) {
          case 'error':
          case 'warn':
          case 'info':
            consoleInfoCount[type]++
            break
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
