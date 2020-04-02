<template>
  <div id="jsEncoderConsole" ref="resize">
    <div class="console-tab flex flex-ai noselect">
      <i class="icon iconfont icon-console"></i>
      <span>console</span>
      <div class="resize-box flex flex-ai" @mousedown="boxMouseDown">
        <i class="icon iconfont icon-resize"></i>
      </div>
      <div class="console-options">
        <div @click.stop class="filter-options flex flex-ai flex-jcc" :class="isFilterShow?'filter-options-active':''">
          <el-checkbox-group v-model="passOptions" @change="changeFilterList">
            <el-checkbox class="el-checkbox" v-for="opt in filterOptions" :label="opt" :key="opt" size="mini">{{opt}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <i class="icon iconfont icon-filter1" title="filter" @click.stop="openFilter"></i>
        <i class="icon iconfont icon-recyclebin" title="clear" @click="clearConsole"></i>
      </div>
    </div>
    <div class="console-body" id="console" ref="console">
      <div class="CodeMirror cm-s-monokai">
        <div v-for="(item, index) in consoleInfo" :key="index" class="log-list">
          <div v-if="item.type==='log' || item.type==='dir'" v-show="isFilter(item.type)" class="log flex flex-ai">
            <i class="icon iconfont icon-shuchu"></i>
            <pre v-for="(value, index) in item.logs" :key="index" v-html="value" class="CodeMirror-line"></pre>
          </div>
          <div v-if="item.type==='mixed'" class="mixed flex flex-ai">
            <i class="icon iconfont icon-shuchu"></i>
            <codemirror :options="cmOptions" :value="item.content" class="code-log" ref="codeArea"></codemirror>
          </div>
          <div v-if="item.type==='info'" v-show="isFilter(item.type)" class="info flex flex-ai">
            <i class="icon iconfont icon-info"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='system-error'" v-show="isFilter('error')" class="system-error flex flex-ai">
            <i class="icon iconfont icon-error1"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
              <span class="row">row: {{item.row}}</span>
              <span class="col">col: {{item.col}}</span>
            </pre>
          </div>
          <div v-if="item.type==='error'" v-show="isFilter(item.type)" class="error flex flex-ai">
            <i class="icon iconfont icon-error1"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='warn'" v-show="isFilter(item.type)" class="warn flex flex-ai">
            <i class="icon iconfont icon-warn1"></i>
            <pre class="CodeMirror-line flex">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='print'" class="print flex flex-ai">
            <i class="icon iconfont icon-shuru"></i>
            <pre class="CodeMirror-line flex" v-html="item.logs[0]">
              <span class="content">{{item.content}}</span>
            </pre>
          </div>
          <div v-if="item.type==='mixedPrint'" class="mixed-print flex flex-ai">
            <i class="icon iconfont icon-shuru"></i>
            <codemirror :options="cmOptions" :value="item.content" class="code-log" ref="codeArea"></codemirror>
          </div>
        </div>
      </div>
      <div class="textarea-box flex flex-ai">
        <i class="icon iconfont icon-lfmonth print-icon"></i>
        <textarea rows="1" ref="commandArea" autoHeight="true" data-min-rows="1" @keydown="checkKeyPress($event)"
          v-model="consoleMessage"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import consoleTool from '@/utils/consoleTool'
import { codemirror } from 'vue-codemirror'
import getEditor from '@/utils/codeEditor'
import iframeConsole from '@/utils/console'
export default {
  data() {
    return {
      temporaryCommand: '',
      cmOptions: {},
      consoleMessage: '',
      filterOptions: ['log', 'info', 'warn', 'error'],
      passOptions: ['log', 'info', 'warn', 'error'],
      historyCmd: [],
      currentConsoleCmd: 0
    }
  },
  watch: {
    consoleMessage(newVal) {
      const historyCmd = this.historyCmd
      const len = historyCmd.length
      historyCmd.splice(len - 1, 1, newVal)
    }
  },
  computed: {
    ...mapState({
      consoleInfo: 'consoleInfo',
      isFilterShow: 'isFilterShow'
    })
  },
  methods: {
    isFilter(str) {
      // 判断该类型日志是否被过滤
      if (this.passOptions.indexOf(str) > -1) return true
      return false
    },
    boxMouseDown(e) {
      // 拖拉console栏改变代码窗口和console的高度
      const store = this.$store
      const state = store.state
      const commit = store.commit
      // 在iframe上面显示遮罩层，否则会影响窗口拖拉
      commit('updateIframeScreen', true)
      // 显示iframe的高度
      commit('updateShowIframeHeight', true)
      const starY = e.clientY
      const consoleSize = state.consoleSize
      const codeAreaHeight = state.codeAreaHeight
      const wholeSize = codeAreaHeight + consoleSize
      document.onmousemove = ev => {
        const iEvent = ev || event
        const finSize = consoleSize - iEvent.clientY + starY
        if (finSize > 25 && wholeSize - finSize > 0) {
          commit('updateConsoleSize', finSize)
          commit('updateCodeAreaHeight', wholeSize - finSize)
        }
        document.onmouseup = () => {
          document.onmousemove = null
          commit('updateIframeScreen', false)
          commit('updateShowIframeHeight', false)
        }
      }
    },
    checkKeyPress(e) {
      // 禁用控制台回车事件
      const et = e || window.event
      const keycode = et.charCode || et.keyCode
      const commandArea = this.$refs.commandArea
      const consoleMessage = this.consoleMessage ? this.consoleMessage : ''
      /**
       * 监听策略
       * 回车时将命令发送给iframe执行并清空textarea(textarea为空时不做操作)
       * 方向键上(当焦点在0处)显示上一个历史命令，直到最早的历史命令
       * 方向键下(当焦点在最后)显示下一个历史命令，直到最后一个历史命令，再次按下方向键显示原来的textarea
       */
      switch (keycode) {
        case 13: {
          // enter
          if (window.event) {
            window.event.returnValue = false
          } else {
            e.preventDefault()
          }
          if (this.consoleMessage) {
            this.sendConsoleCode()
            this.consoleMessage = ''
            this.historyCmd.push('')
            this.currentConsoleCmd = this.historyCmd.length - 1
          }
          break
        }
        case 38: {
          // up
          const cursorPos = this.getCursorPosition(commandArea)
          if (cursorPos !== 0) return
          const cmd = this.handleHistoryCmd(-1)
          if (cmd) this.consoleMessage = cmd
          break
        }
        case 40: {
          // down
          const cursorPos = this.getCursorPosition(commandArea)
          if (cursorPos > consoleMessage.length) return
          const cmd = this.handleHistoryCmd(1)
          if (cmd || cmd === '') this.consoleMessage = cmd
          break
        }
      }
    },
    getCursorPosition(commandArea) {
      // 获取光标在textarea中的位置
      let cursorPos = 0
      if (document.selection) {
        const sel = document.selection.createRange() // 创建选定区域
        sel.moveStart('character', -commandArea.value.length) // 移动开始点到最左边位置
        cursorPos = sel.text.length
      } else if (
        commandArea.selectionStart ||
        commandArea.selectionStart == '0'
      ) {
        cursorPos = commandArea.selectionStart
      }
      return cursorPos
    },
    handleHistoryCmd(order) {
      /**
       * 处理console历史命令
       * 根据order的值判断寻找上一个历史还是下一个
       * 如果已经到了最后一个历史命令，寻找下一个历史命令就直接返回consoleMessage
       * 如果已经到了第一个历史命令，寻找上一个历史命令就直接返回第一个历史命令
       */
      const list = this.historyCmd
      const newIndex = this.currentConsoleCmd + order + 1
      const history = list[newIndex]
      if (history || history === '') this.currentConsoleCmd += order
      return history ? history : ''
    },
    sendConsoleCode() {
      const cmd = this.consoleMessage
      new iframeConsole().executeCommand(cmd)
    },
    clearConsole() {
      new iframeConsole().setConsoleInfo('')
      this.$store.commit('updateConsoleInfo', [])
    },
    openFilter() {
      const commit = this.$store.commit
      commit('updateIsFilterShow', true)
      commit('updateIframeScreen', true)
    },
    changeFilterList(newVal) {
      this.$store.commit('updateFilterList', newVal)
    },
    initCmOpt() {
      this.cmOptions = getEditor('JavaScript')
      this.cmOptions.mode = 'text/javascript'
      this.cmOptions.lineNumbers = false
      this.cmOptions.readOnly = 'nocursor'
    }
  },
  mounted() {
    const consoleH = this.$refs.resize.offsetHeight
    this.$store.commit('updateConsoleSize', 150)
    this.initCmOpt()
  },
  components: {
    codemirror
  }
}
</script>

<style lang="scss" scoped>
#jsEncoderConsole {
  @include setWAndH(100%, 100%);
  min-height: 20px;
  .console-tab {
    @include setWAndH(100%, 25px);
    background-color: $primaryHued;
    color: $afterFocus;
    box-sizing: border-box;
    padding-left: 20px;
    position: relative;
    & > i {
      font-size: 15px;
      margin-right: 5px;
    }
    & > span {
      font-size: 14px;
      margin-left: 5px;
    }
    .resize-box {
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      color: gray;
      cursor: n-resize;
      @include setTransition(all, 0.3s, ease);
      & > i {
        font-size: 8px;
      }
      &:hover {
        color: $afterFocus;
      }
    }
    .console-options {
      position: absolute;
      right: 10px;
      .filter-options {
        @include setWAndH(280px, 35px);
        position: absolute;
        background-color: #333333;
        border-radius: 5px;
        z-index: 999;
        right: 0;
        top: -20px;
        @include setTransition(all, 0.3s, ease);
        box-shadow: 0px 0px 5px 0px $dominantHue;
        visibility: hidden;
        transform: scale(0.5);
        transform-origin: bottom right;
        opacity: 0;
        .el-checkbox {
          font-size: 12px;
          color: $afterFocus;
        }
      }
      .filter-options-active {
        transform: scale(1);
        visibility: visible;
        opacity: 1;
        top: -45px;
      }
      & > i {
        color: gray;
        @include setTransition(all, 0.3s, ease);
        cursor: pointer;
        margin-left: 10px;
        &:hover {
          color: $afterFocus;
        }
      }
    }
  }
  .console-body {
    @include setWAndH(100%, calc(100% - 25px));
    overflow: auto;
    .textarea-box {
      @include setWAndH(100%, auto);
      border-top: 2px solid $primaryHued;
      border-bottom: 2px solid $primaryHued;
      box-sizing: border-box;
      textarea {
        @include setWAndH(100%, auto);
        white-space: pre-line;
        box-sizing: border-box;
        border: none;
        display: table-cell;
        vertical-align: middle;
        line-height: 22px;
        resize: none;
        color: $afterFocus;
        background: $dominantHue;
        outline: none;
        overflow: hidden;
      }
      & > i {
        color: #ae81ff;
        bottom: 6px;
        left: 2px;
      }
    }
    & > .CodeMirror {
      @include setWAndH(100%, calc(100% - 30px) !important);
      overflow: auto;
      .log-list {
        font-size: 13px;
        .log,
        .system-error,
        .error,
        .warn,
        .mixed,
        .info,
        .print,
        .mixed-print {
          box-sizing: border-box;
          padding: 0 10px;
          min-height: 25px;
          span::selection {
            background-color: $describe;
          }
          span {
            white-space: pre-wrap !important;
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
            @include setWAndH(100%);
            .content {
              @include setWAndH(100%, 100%);
              word-wrap: break-word;
              white-space: normal;
              color: #ef6066;
              display: block;
              margin-right: 10px;
            }
          }
        }
        .log,
        .mixed {
          @include setWAndH(100%);
          border-bottom: 1px solid $primaryHued;
          & > .icon-shuchu {
            color: $describe;
            font-size: 12px;
            margin-right: 10px;
          }
          pre {
            @include setWAndH(100%);
            white-space: pre-wrap;
            .cm-string {
              white-space: pre;
              max-width: 100% !important;
              word-wrap: break-word !important;
            }
          }
        }
        .mixed {
          .code-log {
            background-color: #fff !important;
          }
        }
        .info {
          @include setWAndH(100%);
          border-bottom: 1px solid #2a53cd;
          background-color: #202d39;
          color: #aad0f3;
          & > .icon-info {
            color: #2a53cd;
            font-size: 12px;
            margin-right: 10px;
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
            @include setWAndH(100%);
            .content {
              @include setWAndH(100%, 100%);
              word-wrap: break-word;
              white-space: normal;
              color: #dfc185;
              display: block;
              margin-right: 10px;
            }
          }
          & > .icon-warn1 {
            color: #f5bd00;
            font-size: 12px;
            margin-right: 10px;
          }
        }
        .print,
        .mixed-print {
          border-bottom: 1px solid $beforeFocus;
          & > .icon-shuru {
            color: $beforeFocus;
            font-size: 12px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
.js-encoder-console-string {
  color: #c39162;
}
.js-encoder-console-boolean {
  color: #ae81ff;
}
.js-encoder-console-symbol {
  color: #dd0a20;
}
.js-encoder-console-null {
  color: #ae81ff;
}
.js-encoder-console-undefined {
  color: #333333;
}
</style>