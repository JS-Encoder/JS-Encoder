<template>
  <div id="codeArea">
    <codemirror :options="cmOptions" :value="message" v-model="message" class="code" ref="codeArea"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import getEditor from '@/utils/codeEditor'
import { mapState } from 'vuex'
import * as judge from '@/utils/judgeMode'
import { changeFormatOptions } from '@/utils/prettyFormat'
export default {
  props: {
    codeMode: String,
    index: Number,
    showCodeArea: Boolean
  },
  data() {
    return {
      cmOptions: {},
      message: '',
      updateCode: null,
      init: false,
      firstUpdate: true
    }
  },
  mounted() {
    this.initCoder()
    this.setCodeAreaBottom(this.codeAreaHeight)
  },
  computed: {
    ...mapState({
      codeOptions: 'codeOptions',
      showSaveTip: 'showSaveTip',
      language: 'language',
      loginStatus: 'loginStatus',
      codeAreaHeight: 'codeAreaHeight'
    }),
    currentPrep() {
      return this.$store.state.preprocess[this.index]
    },
    codeAreaContent() {
      const mode = judge.judgeMode(this.codeMode)
      return this.$store.state.codeAreaContent[mode]
    }
  },
  watch: {
    currentPrep(newVal) {
      this.cmOptions.mode = judge.getStyleMode(newVal)
    },
    showCodeArea(newVal) {
      if (newVal) {
        this.refreshCodeArea()
        this.getFocus()
      }
    },
    codeAreaHeight(newHeight) {
      newHeight >= 50 && this.setCodeAreaBottom(newHeight)
    },
    codeAreaContent(newVal) {
      this.message = newVal
      if (this.firstUpdate) {
        this.firstUpdate = false
        return void 0
      }
      const commit = this.$store.commit
      if (this.loginStatus) {
        commit('updateShowSaveBtn', true)

        // 项目改变弹出提示框
        if (this.showSaveTip) {
          const language = this.language === 'zh'
          this.$notify({
            title: language ? '提示' : 'Tip',
            message: language
              ? '项目已发生改变，请在在完成后储存到云端'
              : 'The project has changed, please save to the cloud after completion',
            position: 'bottom-right',
            duration: 5000
          })
          commit('updateShowSaveTip', false)
        }
      }
    },
    'codeOptions.replace': {
      handler(newVal) {
        this.cmOptions.indentWithTabs = newVal
      }
    },
    'codeOptions.tabIndent': {
      handler(newVal) {
        const cmOptions = this.cmOptions
        cmOptions.tabSize = newVal
        cmOptions.indentUnit = newVal
        changeFormatOptions({
          attr: 'indent_size',
          val: newVal
        })
      }
    }
  },
  methods: {
    initCoder() {
      // 初始化代码及编辑器配置
      if (this.unwatch) this.unwatch()
      const content = this.$store.state.codeAreaContent
      const codeMode = this.codeMode
      this.cmOptions = getEditor(judge.judgeMode(codeMode))
      this.cmOptions.mode = judge.getStyleMode(codeMode)
      this.message = content[judge.judgeMode(codeMode)]
      // 第一次初始化完毕再开始监听内容变化
      this.unwatch = this.$watch('message', this.messageChangeHandler)
    },
    setCodeAreaBottom(newHeight) {
      // 设置代码框的底边距
      const codeWindow = document.querySelectorAll('.CodeMirror-lines')[
        this.index
      ]
      codeWindow.style.paddingBottom = `${newHeight - 20}px`
    },
    refreshCodeArea() {
      // 使用v-show切换codemirror元素显示时，会出现需要点击才能显示内容的问题，需要在显示的时候执行刷新
      this.$refs.codeArea.refresh()
    },
    getFocus() {
      // 使当前显示的代码窗口获取焦点
      this.$refs.codeArea.codemirror.focus()
    },
    runCode() {
      // 内容改变，执行父组件的方法来更新视图
      this.$emit('runCode')
    },
    messageChangeHandler(newVal) {
      // 防抖，监听代码内容变化更新state
      const codeOptions = this.codeOptions
      if (this.updateCode) clearTimeout(this.updateCode)
      this.updateCode = setTimeout(() => {
        const mode = judge.judgeMode(this.codeMode)
        this.$store.commit('updateCodeAreaMessage', {
          mode,
          message: newVal
        })
        if (codeOptions.autoUp) this.runCode()
      }, codeOptions.waitTime)
    }
  },
  components: {
    codemirror
  }
}
</script>

<style lang="scss" scoped>
#codeArea {
  @include setWAndH(100%, 100%);
  .code {
    @include setWAndH(100%, 100%);
    background-color: $dominantHue;
    resize: none;
    outline: none;
    border: none;
    color: $primaryHued;
  }
}
</style>
