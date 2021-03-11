<template>
  <div id="console">
    <div class="console-tab borbox flex flex-ai noselect">
      <div class="title">
        <i class="icon iconfont icon-console"></i>
        <span>Console</span>
      </div>
      <div class="resize flex flex-ai" @mousedown="resize">
        <i class="icon iconfont icon-resize"></i>
      </div>
      <div class="options flex">
        <div :title="consoleLang.tools.filters">
          <el-dropdown class="filter-dropdown" trigger="click" :hide-on-click="false">
            <i class="icon iconfont icon-filter1"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in filterList" :key="index" class="flex flex-ai"
                style="font-family:Consolas, Monaco" :class="filter[item]?'active-dropdown-item':''"
                @click.native="filter[item]=!filter[item]">
                <span class="flex-1">{{item}}</span>
                <i class="el-icon-check" v-show="filter[item]"></i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div :title="consoleLang.tools.settings" @click="closeSettings">
          <i class="icon iconfont icon-config1" :class="settingsVisible?'active-opt':''"></i>
        </div>
        <div :title="consoleLang.tools.recycle" @click="clearLogs">
          <i class="icon iconfont icon-recycle"></i>
        </div>
        <div :title="consoleLang.tools.minimal" @click="minimalConsole">
          <i class="icon iconfont icon-zuixiaohua"></i>
        </div>
      </div>
    </div>
    <div class="console-body flex flex-clo">
      <div class="cm-list flex-1 CodeMirror cm-s-default" ref="consoleList" v-show="!settingsVisible">
        <div v-for="(item, index) in consoleInfo" :key="index" class="log-list">
          <div v-if="item.type==='log'|| item.type==='dir'" v-show="filter.Log" class="log flex flex-ai">
            <i class="icon iconfont icon-lfmonth"></i>
            <pre v-for="(value, index) in item.logs" :key="index" v-html="value" class="CodeMirror-line"></pre>
          </div>
          <div v-if="item.type==='mix'" class="mix flex flex-ai">
            <i class="icon iconfont icon-lfmonth"></i>
            <codemirror :options="codeOptions" @hook:mounted="cmMounted(index)" v-show="settings.highlight" v-once
              :value="item.content" class="code-log" :ref="`logArea${index}`">
            </codemirror>
            <div class="code-log" v-show="!settings.highlight" v-once>{{item.content}}</div>
          </div>
          <div v-if="item.type==='info'" v-show="filter.Info" class="info flex flex-ai">
            <i class="icon iconfont icon-info"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='system-error'" v-show="filter.Error" class="system-error flex flex-ai">
            <i class="icon iconfont icon-error1"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
              <span class="row">row: {{item.row}}</span>
              <span class="col">col: {{item.col}}</span>
            </pre>
          </div>
          <div v-if="item.type==='error'" v-show="filter.Error" class="error flex flex-ai">
            <i class="icon iconfont icon-error1"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='warn'" v-show="filter.Warning" class="warn flex flex-ai">
            <i class="icon iconfont icon-warn1"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='print'" class="print flex flex-ai">
            <i class="icon iconfont icon-lfmonth"></i>
            <pre class="CodeMirror-line flex" v-html="item.logs[0]">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='mixPrint'" class="mix-print flex flex-ai">
            <i class="icon iconfont icon-lfmonth"></i>
            <codemirror :options="codeOptions" @hook:mounted="cmMounted(index)" v-show="settings.highlight" v-once
              :value="item.content" class="code-log" :ref="`logArea${index}`">
            </codemirror>
            <div class="code-log" v-show="!settings.highlight" v-once>{{item.content}}</div>
          </div>
        </div>
      </div>
      <div class="settings borbox flex-1 flex flex-clo" v-show="settingsVisible">
        <el-checkbox v-model="settings.clear">{{consoleLang.settings.clear.title}}</el-checkbox>
        <span class="describe">{{consoleLang.settings.clear.describe}}</span>
        <el-checkbox v-model="settings.highlight">{{consoleLang.settings.highlight.title}}</el-checkbox>
        <span class="describe">{{consoleLang.settings.highlight.describe}}</span>
      </div>
      <div class="textarea-box borbox flex flex-ai flex-sh">
        <i class="icon iconfont icon-lfmonth print-icon"></i>
        <codemirror :options="cmdOptions" :value="consoleMsg" @keydown.native="handleCmd" v-model="consoleMsg"
          class="cmd-codemirror" ref="cmdArea">
        </codemirror>
        <el-button size="mini" class="flex-sh run-btn" :class="consoleMsg?'pmy-btn':'disable-btn'" @click="exeCmd">Run
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import IframeConsole from '@utils/console'
import { codemirror } from 'vue-codemirror'
export default {
  data() {
    return {
      filterList: ['Info', 'Log', 'Warning', 'Error'],
      filter: {
        Info: true,
        Log: true,
        Warning: true,
        Error: true,
      },
      tmpCommand: '',
      consoleMsg: '',
      settingsVisible: false,
      settings: {
        clear: true,
        highlight: true,
      },
      historyCmd: [''],
      currentCmdIndex: 0,
      codeOptions: {},
      cmdOptions: {},
      preCursorPos: {
        line: 0,
        ch: 0,
      },
    }
  },
  created() {
    this.settings = this.consoleSettings
    this.initOptions()
  },
  mounted() {
    setTimeout(() => {
      const codeArea = this.$refs.cmdArea
      codeArea.refresh()
    }, 3200)
  },
  computed: {
    ...mapState([
      'iframeHeight',
      'consoleHeight',
      'consoleSettings',
      'consoleInfo',
    ]),
    consoleLang() {
      return this.$t('console')
    },
  },
  watch: {
    currentCmdIndex(newIndex) {
      this.consoleMsg = this.historyCmd[newIndex]
      this.$refs.cmdArea.codemirror.setCursor({ line: 0, ch: 0 })
    },
  },
  methods: {
    ...mapMutations([
      'handleIframeH',
      'handleConsoleH',
      'handleIframeScreenVisible',
      'handleIframeHVisible',
      'handleConsoleSettings',
      'handleConsoleInfo',
      'handleConsoleInfoCount',
    ]),
    resize(e) {
      /**
       * Drag the divide line of console to change the height of iframe and console
       * The screen is must be displayed when draggling, because mousedown event is undefined in iframe, drag will be stopped when mouse enter the iframe
       */
      this.handleIframeScreenVisible(true)
      this.handleIframeHVisible(true)
      const starY = e.clientY
      const consoleH = this.consoleHeight
      const iframeH = this.iframeHeight
      const viewH = consoleH + iframeH
      document.onmousemove = (ev) => {
        const iEvent = ev || event
        const finH = consoleH - iEvent.clientY + starY
        if (finH > 25 && viewH - finH > 0) {
          this.handleConsoleH(finH)
          this.handleIframeH(viewH - finH)
        }
        document.onmouseup = () => {
          this.handleIframeScreenVisible(false)
          this.handleIframeHVisible(false)
          document.onmouseup = null
          document.onmousemove = null
        }
      }
    },
    minimalConsole() {
      const consoleH = this.consoleHeight
      const iframeH = this.iframeHeight
      const viewH = consoleH + iframeH
      this.handleConsoleH(25)
      this.handleIframeH(viewH - 25)
    },
    scrollToBottom() {
      const logList = this.$refs.consoleList.querySelectorAll('.log-list')
      logList[logList.length - 1].scrollIntoView(false)
    },
    closeSettings() {
      this.handleConsoleSettings(this.settings)
      this.settingsVisible = !this.settingsVisible
    },
    initOptions() {
      const codeOptions = {
        mode: 'text/javascript',
        readOnly: 'nocursor',
        matchBrackets: false,
        scrollPastEnd: false,
        scrollbarStyle: 'null',
        lineWrapping: true,
        foldGutter: true,
        gutters: ['CodeMirror-foldgutter'],
      }
      this.codeOptions = codeOptions
      const cmdOptions = {
        mode: 'text/javascript',
        lineWrapping: true,
      }
      this.cmdOptions = cmdOptions
    },
    handleCmd(e) {
      const key = e.keyCode
      const cm = this.$refs.cmdArea.codemirror
      switch (key) {
        case 38: {
          const { line, ch } = cm.getCursor()
          if (line === 0 && ch === 0) {
            if (this.currentCmdIndex >= 1) this.currentCmdIndex--
          }
          break
        }
        case 40: {
          const outside = cm.getCursor().outside
          if (outside === 1) {
            if (this.currentCmdIndex < this.historyCmd.length - 1)
              this.currentCmdIndex++
          }
          break
        }
      }
    },
    exeCmd() {
      const cmd = this.consoleMsg
      if (cmd) {
        const list = this.historyCmd
        new IframeConsole().exeCmd(cmd)
        this.consoleMsg = ''
        list.pop()
        list.push(cmd)
        list.push('')
        if (this.currentCmdIndex !== list.length - 2) {
          this.currentCmdIndex = list.length - 1
        } else {
          this.currentCmdIndex++
        }
        // The reason of use nextTick is vue cannot render the view immediately when command is executed
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    },
    clearLogs() {
      new IframeConsole().clear()
      this.handleConsoleInfo([])
      this.handleConsoleInfoCount({
        error: 0,
        warn: 0,
        info: 0,
      })
    },
    cmMounted(index) {
      // The codemirror instances of console will be fold after the instance was mounted
      this.$refs[`logArea${index}`][0].codemirror.execCommand('foldAll')
    },
  },
  components: {
    codemirror,
  },
}
</script>

<style lang="scss" scoped>
/deep/.CodeMirror {
  .CodeMirror-gutter-elt {
    left: 1px !important;
  }
}
.cmd-codemirror {
  width: calc(100% - 80px);
  height: auto;
  /deep/.CodeMirror {
    width: 100%;
    height: auto;
    max-height: 90px;
    font-size: 14px;
    font-family: $codeFont;
    ::-webkit-scrollbar {
      outline: none;
      width: 6px;
      height: 6px;
      background-color: $mainColor;
    }
    ::-webkit-scrollbar-track {
      background-color: $mainColor;
    }
    ::-webkit-scrollbar-thumb {
      background-color: $thirdColor;
      border-radius: 3px;
    }
    ::-webkit-scrollbar-thumb:hover {
      outline: none;
      background-color: rgba(80, 80, 80, 1);
    }
    .CodeMirror-vscrollbar {
      border: none;
    }
    .CodeMirror-scroll {
      height: auto;
      max-height: 90px;
    }
  }
}
/deep/.el-checkbox {
  .el-checkbox__label {
    color: $afterFocus !important;
  }
}
/deep/.el-textarea {
  .el-textarea__inner {
    &::-webkit-scrollbar {
      outline: none;
      width: 10px;
      height: 4px;
      background-color: $mainColor;
    }
    &::-webkit-scrollbar-track {
      background-color: $mainColor;
    }
    &::-webkit-scrollbar-thumb {
      background-color: $thirdColor;
    }
    &::-webkit-scrollbar-thumb:hover {
      outline: none;
      background-color: rgba(80, 80, 80, 1);
    }
  }
}
.el-dropdown-menu {
  width: 120px !important;
}
.el-dropdown-menu__item {
  background-color: $thirdColor !important;
}
.active-dropdown-item {
  background-color: $deep !important;
  color: $afterFocus !important;
}
#console {
  width: 100%;
  height: 100%;
  min-height: 25px;
  .console-tab {
    height: 25px;
    background-color: $secondColor;
    color: $beforeFocus;
    padding-left: 15px;
    position: relative;
    font-family: $codeFont;
    border-left: 1px solid $mainColor;
    .title {
      i {
        font-size: 14px;
        margin-right: 5px;
      }
      span {
        font-size: 14px;
        margin-left: 5px;
      }
    }
    .resize {
      height: 100%;
      cursor: n-resize;
      @include positionMiddle();
      @include setTransition(all, 0.3s, ease);
      i {
        font-size: 8px;
      }
      &:hover {
        color: $afterFocus;
      }
    }
    .options {
      position: absolute;
      right: 0px;
      & > div {
        height: 100%;
        width: 30px;
        i {
          color: $beforeFocus;
          cursor: pointer;
          &:hover {
            color: $afterFocus;
          }
        }
        .active-opt {
          color: $primary;
        }
      }
    }
  }
  .console-body {
    height: calc(100% - 25px);
    .cm-list {
      overflow: auto;
      &::-webkit-scrollbar {
        outline: none;
        width: 10px;
        height: 4px;
        background-color: $mainColor;
      }
      &::-webkit-scrollbar-track {
        background-color: $mainColor;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $thirdColor;
      }
      &::-webkit-scrollbar-thumb:hover {
        outline: none;
        background-color: rgba(80, 80, 80, 1);
      }
      font-family: $codeFont;
      .log-list {
        font-size: 12px;
        .log,
        .system-error,
        .error,
        .warn,
        .mix,
        .info,
        .print,
        .mix-print {
          box-sizing: border-box;
          padding: 0 10px;
          min-height: 25px;
          /deep/.vue-codemirror {
            width: 100%;
            .CodeMirror {
              height: auto;
              .CodeMirror-scroll {
                position: static;
              }
            }
          }
          i {
            font-size: 12px;
            margin-right: 10px;
          }
          span::selection {
            background-color: $describe;
          }
        }
        .system-error,
        .error {
          background-color: #290000;
          border-bottom: 1px solid #5c0000;
          & > .icon-error1 {
            color: #ef6066;
            font-size: 12px;
            margin-right: 10px;
          }
          pre {
            width: 100%;
            .content {
              width: 100%;
              height: 100%;
              word-wrap: break-word;
              white-space: normal;
              color: #ef6066;
              display: block;
              margin-right: 10px;
            }
          }
        }
        .log,
        .mix {
          width: 100%;
          height: auto;
          border-bottom: 1px solid $thirdColor;
          & > .icon-lfmonth {
            color: $describe;
          }
          pre {
            white-space: pre-wrap;
            .cm-string {
              white-space: pre;
              max-width: 100% !important;
              word-wrap: break-word !important;
            }
          }
        }
        .mix {
          .code-log {
            background-color: #fff !important;
          }
        }
        .info {
          width: 100%;
          border-bottom: 1px solid $deepBlue;
          color: #aad0f3;
          & > .icon-info {
            color: $deepBlue;
          }
        }
        .system-error {
          pre {
            .row,
            .col {
              margin: 0 5px;
              color: $describe;
              white-space: nowrap !important;
            }
          }
        }
        .warn {
          background-color: #332b00;
          border-bottom: 1px solid #665500;
          pre {
            width: 100%;
            .content {
              width: 100%;
              height: 100%;
              word-wrap: break-word;
              white-space: normal;
              color: $orange;
              display: block;
              margin-right: 10px;
            }
          }
          & > .icon-warn1 {
            color: $orange;
          }
        }
        .print,
        .mix-print {
          border-bottom: 1px solid $describe;
          & > .icon-lfmonth {
            color: $beforeFocus;
            transform: rotate(180deg);
          }
        }
      }
    }
    .settings {
      padding: 0 15px;
      overflow: auto;
      font-family: $codeFont;
      &::-webkit-scrollbar {
        outline: none;
        width: 10px;
        height: 4px;
        background-color: $mainColor;
      }
      &::-webkit-scrollbar-track {
        background-color: $mainColor;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $thirdColor;
      }
      &::-webkit-scrollbar-thumb:hover {
        outline: none;
        background-color: rgba(80, 80, 80, 1);
      }
      .el-checkbox {
        margin: 15px 0 5px 0;
      }
    }
    .textarea-box {
      border-top: 2px solid $secondColor;
      border-bottom: 2px solid $secondColor;
      .print-icon {
        color: $primary;
        margin-left: 5px;
      }
      /deep/.el-textarea {
        width: 100%;
        .el-textarea__inner {
          height: 100%;
          background-color: transparent !important;
          border: none !important;
          padding-left: 10px;
          font-family: $codeFont;
        }
      }
      .run-btn {
        font-family: $codeFont;
        border-radius: 0px;
        margin-left: 5px;
      }
    }
  }
}
</style>
