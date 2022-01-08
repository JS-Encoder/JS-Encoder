<template>
  <div id="editor">
    <codemirror :style="fontStyle" :options="codeOptions" :value="code" v-model="code"
      @cursorActivity="cursorPosChanged" class="code" :class="mdToolbarVisible&&index===0?'md-active':''"
      ref="codeArea">
    </codemirror>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { codemirror } from 'vue-codemirror'
import cmConfig, { formatCode } from '@utils/editorOptions'
import { judgeMode, modeStyleList } from '@utils/judgeMode'
import { debounce } from '@utils/tools'
import { changeFormatOptions } from '@utils/codeFormatter'
export default {
  props: {
    codeMode: String,
    index: Number,
    showCodeArea: Boolean,
  },
  data() {
    return {
      codeOptions: {},
      code: '',
      lintList: ['HTML', 'CSS', 'JavaScript'], // Current languages which has lint function
    }
  },
  created() {
    this.initEditor()
    this.code = this.codeContent
  },
  mounted() {
    const cm = this.getCodeMirror()
    if (judgeMode(this.codeMode) !== 'HTML') {
      cm.on('inputRead', this.autoComplete)
    }
    if (this.index === 2) {
      cm.on('cursorActivity', (cm) => {
        window.ternServer.updateArgHints(cm)
      })
    }
    setTimeout(() => {
      if (this.showCodeArea) {
        const codeArea = this.$refs.codeArea
        codeArea.refresh()
        codeArea.codemirror.focus()
      }
    }, 3100)
  },
  computed: {
    ...mapState([
      'instanceCode',
      'instanceSetting',
      'mdToolbarVisible',
      'currentTab',
      'hasUploadCode',
    ]),
    fontStyle() {
      const { fontFamily, fontSize } = this.instanceSetting
      return {
        fontFamily,
        fontSize: `${fontSize}px`,
      }
    },
    codeContent() {
      const mode = judgeMode(this.codeMode)
      return this.instanceCode[mode]
    },
  },
  watch: {
    hasUploadCode(status) {
      if (status) this.code = this.codeContent
    },
    codeMode(newMode) {
      const codeOptions = this.codeOptions
      codeOptions.mode = modeStyleList[newMode]
      codeOptions.lint = this.getLintOpts(newMode)
    },
    showCodeArea(newState) {
      /**
       * Make the current display editor get focus
       * 确保当前编辑窗口获取焦点
       */
      if (newState) {
        const codeArea = this.$refs.codeArea
        codeArea.refresh()
        codeArea.codemirror.focus()
      }
    },
    currentTab() {
      /**
       * Update cursor position of footer when the current tab changed
       * 当编辑窗口改变时更新光标在底部信息栏显示的位置
       */
      if (!this.showCodeArea) return void 0
      const cm = this.getCodeMirror()
      this.cursorPosChanged(cm)
    },
    'instanceSetting.autoComplete'(newState) {
      /**
       * Monitor input event of editor and provide hint function
       * 监听编辑器input事件并提供hint提示列表
       */
      const cm = this.getCodeMirror()
      if (newState && judgeMode(this.codeMode) !== 'HTML') {
        cm.on('inputRead', this.autoComplete)
      } else {
        cm.off('inputRead', this.autoComplete)
      }
    },
    'instanceSetting.tabIndent'(newState) {
      this.codeOptions.indentWithTabs = newState
    },
    'instanceSetting.indentSpaces'(newState) {
      const codeOptions = this.codeOptions
      codeOptions.tabSize = newState
      codeOptions.indentUnit = newState
      changeFormatOptions({
        attr: 'indent_size',
        val: newState,
      })
    },
    'instanceSetting.lineWrap'(newState) {
      this.codeOptions.lineWrapping = newState
    },
    'instanceSetting.lint'(newState) {
      this.codeOptions.lint = newState && this.getLintOpts(this.codeMode)
    },
    'instanceSetting.delayTime'(newState) {
      this.watchCode()
      this.watchCode = this.$watch(
        'code',
        debounce(function (code) {
          const mode = judgeMode(this.codeMode)
          this.handleInstanceCode({ mode, code })
          if (this.instanceSetting.autoExecute) this.$emit('runCode')
        }, newState)
      )
    },
  },
  methods: {
    ...mapMutations(['handleInstanceCode']),
    initEditor() {
      /**
       * Initialize the code and configuration of editor
       * 初始化编辑器配置
       */
      const instanceCode = this.instanceCode
      const codeMode = this.codeMode
      const mode = judgeMode(codeMode)
      this.codeOptions = cmConfig(mode)
      const codeOptions = this.codeOptions
      codeOptions.mode = modeStyleList[codeMode]
      codeOptions.lint = this.getLintOpts(codeMode)
      this.code = instanceCode[mode]
      /**
       * Observer will be triggered when the editor initialized
       * so it needs to be define after waiting for initialization is complete
       * 观察者会在组件初始化完就执行，因此需要在给编辑器赋予初始代码之后才执行
       */
      this.watchCode = this.$watch(
        'code',
        debounce(function (code) {
          const mode = judgeMode(this.codeMode)
          this.handleInstanceCode({ mode, code })
          if (this.instanceSetting.autoExecute) this.$emit('runCode')
        }, this.instanceSetting.delayTime)
      )
    },
    getCodeMirror() {
      return this.$refs.codeArea.codemirror
    },
    format() {
      const mode = judgeMode(this.codeMode)
      formatCode(this.getCodeMirror(), mode)
    },
    autoComplete(cm, changeObj) {
      /**
       * There is no need to show hint when type is comment or when input characters are non-English
       * 在写注释的时候或者输入字符不是英文的时候不需要提示
       */
      if (cm.state.completionActive) return void 0
      const token = cm.getTokenAt(cm.getCursor())
      if (token.type && token.type !== 'comment') {
        if (/^[a-zA-Z]/.test(changeObj.text[0])) {
          cm.showHint()
        }
      }
    },
    getLintOpts(codeMode) {
      let lint = false
      if (this.lintList.includes(codeMode)) {
        switch (codeMode) {
          case 'JavaScript': {
            lint = {
              esversion: 2021,
            }
            break
          }
          default: {
            lint = true
          }
        }
      }
      return this.instanceSetting.lint && lint
    },
    cursorPosChanged(cm) {
      /**
       * Monitor the change of cursor position, judge whether any text was selected or not
       * If multiple paragraphs of text was selected, calculate the number and length of paragraphs
       * If only one paragraph was selected, calculate the length of paragraph and get position of cursor
       * If no paragraph was selected, only get position of cursor
       * 监听光标位置的改变，判断是否有文本被选中。如果选中多行，计算它们的长度；选中一行，计算选中文本的长度和光标位置；没选中则只获取光标位置
       */
      if (cm.somethingSelected()) {
        const selectArr = cm.listSelections()
        const selections = selectArr.length
        const selectVal = cm.getSelection()
        let selected = 0
        if (selections > 1) {
          /**
           * In the situation of multiple paragraphs of text was selected
           * getSelection will add a enter character at tail of per paragraph, therefore, the ultimate length should exclude that.
           * 在多行文本被选中的情况下，计算长度会包含回车符，因此要减掉回车符
           */
          selected = selectVal.length - selections + 1
          this.$emit('cursorPosChanged', {
            selections,
            selected,
          })
        } else {
          selected = selectVal.length
          this.$emit('cursorPosChanged', {
            ...this.getCursorPos(cm),
            selected,
          })
        }
      } else {
        this.$emit('cursorPosChanged', this.getCursorPos(cm))
      }
    },
    getCursorPos(cm) {
      const cursor = cm.getCursor()
      let { ch: col, line: ln } = cursor
      col++
      ln++
      return { col, ln }
    },
  },
  components: {
    codemirror,
  },
}
</script>

<style lang="scss" scoped>
/deep/.code {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::-webkit-scrollbar {
    outline: none;
    width: 12px;
    height: 12px;
    background-color: transparent;
    @include setTransition(all, 0.3s, ease);
  }
  ::-webkit-scrollbar-track {
    background-color: rgba(30, 30, 30, 0);
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(80, 80, 80, 0.3);
  }
  ::-webkit-scrollbar-thumb:hover {
    outline: none;
    background-color: rgba(80, 80, 80, 0.7);
  }
  .CodeMirror {
    height: calc(100vh - 91px) !important;
    resize: none;
    outline: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
  }
  .CodeMirror-scroll {
    height: 100%;
    overflow-y: hidden;
  }
}
/deep/.md-active {
  .CodeMirror {
    height: calc(100vh - 121px) !important;
  }
}
#editor {
  width: 100%;
  height: calc(100% - 30px);
}
</style>
