<template>
  <div id="editor">
    <codemirror class="code" ref="codeArea" :style="fontStyle" :options="codeOptions" :value="code" v-model="code"
      @cursorActivity="cursorPosChanged">
    </codemirror>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { codemirror } from 'vue-codemirror'
import cmConfig from '@utils/editorOptions'
import { debounce } from '@utils/tools'
import { modeStyleList } from '@utils/judgeMode'

export default {
  data () {
    return {
      codeOptions: {},
      code: '',
    }
  },
  created () {
    this.initEditor()
    this.code = this.cpntCode
  },
  computed: {
    ...mapState([
      'instanceSetting',
      'cpntName',
      'cpntCode',
      'shouldResetCode'
    ]),
    fontStyle() {
      const { fontFamily, fontSize } = this.instanceSetting
      return {
        fontFamily,
        fontSize: `${fontSize}px`,
      }
    },
  },
  watch: {
    shouldResetCode(newState) {
      if (newState) {
        this.code = this.cpntCode
        this.$nextTick(() => {
          this.handleShouldResetCode(false)
        })
      }
    }
  },
  methods: {
    ...mapMutations(['handleCpntCode', 'handleShouldResetCode']),
    initEditor () {
      /**
       * Initialize the code and configuration of editor
       * 初始化编辑器配置
       */
      const cpntName = this.cpntName
      this.codeOptions = cmConfig(cpntName)
      const codeOptions = this.codeOptions
      codeOptions.mode = modeStyleList[cpntName]
      this.code = this.cpntCode
      /**
       * Observer will be triggered when the editor initialized
       * so it needs to be define after waiting for initialization is complete
       * 观察者会在组件初始化完就执行，因此需要在给编辑器赋予初始代码之后才执行
       */
      this.watchCode = this.$watch(
        'code',
        debounce(function (code) {
          this.handleCpntCode(code)
          if (this.instanceSetting.autoExecute) this.$emit('runCode')
        }, this.instanceSetting.delayTime)
      )
    },
    cursorPosChanged (cm) {
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
    getCodeMirror () {
      return this.$refs.codeArea.codemirror
    },
    getCursorPos (cm) {
      const cursor = cm.getCursor()
      let { ch: col, line: ln } = cursor
      col++
      ln++
      return { col, ln }
    },
  },
  components: {
    codemirror,
  }
}
</script>

<style lang="scss" scoped>
::v-deep .code {
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
#editor {
  width: 100%;
  height: calc(100% - 30px);
}
</style>
