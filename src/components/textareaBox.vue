<template>
  <div :ref="title" :style="{width:textBoxW[initTitle]}" class="flex flex-clo" id="textareaBox">
    <div class="title noselect flex flex-ai">
      <span>{{title}}</span>
      <div class="iframe-width" v-if="initTitle === 'Output'">{{ iframeWidth}}</div>
    </div>
    <div :class="title === 'Console'?'bgc':''" :ref="'textbox'+index" class="text-box flex" id="textBox">
      <codemirror :options="cmOptions" :value="message" class="code" ref="editor" v-if="showCode" v-model="message"></codemirror>
      <Console @updateConsole="updateConsole" v-if="title === 'Console'"></Console>
      <iframe
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
        frameborder="0"
        id="iframe"
        name="iframe"
        ref="iframeBox"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
        scrolling="yes"
        src="static/html/runner.html"
        v-if="showIframe"
      ></iframe>
      <div class="screen-box" v-if="showScreen && title === 'Output'"></div>
      <div @mousedown="boxMouseDown" class="resize flex flex-jcc" v-if="index!=len-1">
        <div class="resize-line" ref="line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Console from './console'
import CodeMirror from 'codemirror'
import { codemirror } from 'vue-codemirror'
import { mapState } from 'vuex'
import getCompiledCode from '@/utils/getCompiledCode'
import getEditor from '@/utils/codeEditor'
import judgeFormat from '@/utils/judgeUrlFormat'
import exeCode from '@/utils/console'
import * as compiler from '@/utils/compiler'
import * as createTag from '@/utils/createTags'
import * as judge from '@/utils/judgeMode'

export default {
  props: {
    index: Number,
    title: String,
    len: Number,
    typeList: Array,
    space: Number,
    extraConsole: Array
  },
  data() {
    return {
      src: 'hello world',
      showCode: true, // Whether to display the code window
      showIframe: false, // Whether to display the iframe
      message: '', // original text
      initTitle: '',
      later: true,
      timer: null,
      cmOptions: {}
    }
  },
  components: {
    codemirror,
    Console
  },
  mounted() {
    const title = this.title
    this.initTitle = judge.judgeMode(this.title)
    this.init()

    if (title !== 'Console' && title !== 'Output') this.changeCodeLineStyle()
  },
  computed: {
    ...mapState({
      HTMLPrep: 'HTMLPrep',
      CSSPrep: 'CSSPrep',
      JSPrep: 'JSPrep',
      textBoxW: 'textBoxW',
      content: 'textBoxContent',
      showScreen: 'showScreen',
      waitTime: 'waitTime',
      replace: 'replace',
      autoUp: 'autoUp',
      run: 'isRun'
    }),
    iframeWidth() {
      return `${parseInt(this.textBoxW[this.initTitle])}px`
    }
  },
  watch: {
    'content.HTML': function (newVal) {
      if (this.initTitle === 'HTML') {
        this.message = newVal
      }
    },
    'content.CSS': function (newVal) {
      if (this.initTitle === 'CSS') {
        this.message = newVal
      }
    },
    'content.JavaScript': function (newVal) {
      if (this.initTitle === 'JavaScript') {
        this.message = newVal
      }
    },
    extraConsole(newVal) {
      if (this.initTitle === 'Output') {
        const len = newVal.length
        this.sendCodeToIframe(newVal[len - 1])
      }
    },
    space() {
      // watch tab-space value changes and resetting tab-space config
      const title = this.initTitle
      if (title === 'Console' || title === 'Output') return
      const space = this.space
      this.cmOptions.tabSize = space
      this.cmOptions.indentUnit = space
    },
    message(newVal) {
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$store.commit('change', {
          [this.initTitle]: newVal
        })
      }, this.waitTime)
    },
    content: {
      deep: true,
      handler() {
        if (!(this.$store.state.autoUp && this.showIframe)) return
        this.reSetConsole()
        this.spliceHtml()
      }
    },
    replace(newVal) {
      if (!this.$refs.editor) return
      this.cmOptions.indentWithTabs = newVal
    },
    async run(newVal) {
      if (!(this.title === 'Output' && newVal)) return
      this.reSetConsole()
      await this.spliceHtml()
    }
  },
  methods: {
    changeCodeLineStyle() {
      // 给每一个代码窗的代码加上 padding-bottom 防止代码打到窗口底部才显示滚动条
      const el = this.$el
      const textBox = el.querySelector('#textBox')
      const textBoxHeight = parseInt(window.getComputedStyle(textBox).height)
      const codeLines = el.querySelectorAll('.CodeMirror-lines')[0]

      codeLines.style.paddingBottom = `${(textBoxHeight * 4) / 5}px`
    },
    boxMouseDown(e) {
      const starX = e.clientX
      const elInfo = this.$refs[this.title]
      const title = this.initTitle
      const starW = elInfo.offsetWidth
      const nextBox = judge.judgeMode(this.typeList[this.index + 1])
      const commit = this.$store.commit

      // The event binding for this page does not affect the iframe, events are disabled when the mouse is moved over iframe,
      // screen will appears when the mouseDown event is triggers
      if (nextBox === 'Output') commit('updateScreen', true)

      // Calculate the total width of two divs
      const wholeW =
        parseFloat(this.textBoxW[nextBox]) + parseFloat(this.textBoxW[title])
      document.onmousemove = ev => {
        const iEvent = ev || event
        const finW = starW + (iEvent.clientX - starX)
        if (finW > 100 && wholeW - finW > 100) {
          commit('updateTextBoxW', {
            attr: title,
            value: finW + 'px'
          })
          commit('updateTextBoxW', {
            attr: nextBox,
            value: wholeW - finW + 'px'
          })
        }
      }

      // screen will hides when mouseUp event is triggers
      document.onmouseup = () => {
        document.onmousemove = null
        commit('updateScreen', false)
      }
    },
    init() {
      if (this.initTitle === 'Console' || this.initTitle === 'Output') {
        this.showCode = false
        if (this.initTitle === 'Output') {
          this.showIframe = true
        }
        return void 0
      }

      this.cmOptions = getEditor(this.initTitle)

      //Page initializes the execution function
      const initText = this.$store.state.textBoxContent
      const title = this.title

      this.message = initText[judge.judgeMode(title)]
      this.cmOptions.mode = judge.getStyleMode(title)

      if (title === 'Console' || title === 'Output') {
        this.showCode = false
        if (title === 'Output') {
          this.showIframe = true
        }
      }
    },
    sendCodeToIframe(code) {
      this.spliceHtml(0, exeCode(code))
    },
    updateConsole(exeCode) {
      this.$emit('updateConsole', exeCode)
    },
    async spliceHtml(time, exeCode = '') {
      const iframe = this.$refs.iframeBox
      const state = this.$store.state

      // 重新引入iframe
      // 原因在于：之前js代码对iframe产生的改变不会因为删除了原本的js代码而消失，必须重新引入
      iframe.contentWindow.location.reload(true)

      // 获取已经编译成为html、css、js的代码
      let codeObj
      await getCompiledCode(state).then(obj => {
        codeObj = obj
      })

      // 外部引入路径的格式检查，只允许http和https
      let validCss = []
      const cssLinks = state.cssLinks
      judgeFormat(cssLinks, function (item) {
        validCss.push(item)
      })
      let validCDN = []
      const cdnJs = state.cdnJs
      judgeFormat(cdnJs, function (item) {
        validCDN.push(item)
      })

      // 延迟执行时间
      let waitTime = null
      !time ? (waitTime = this.waitTime) : (waitTime = 0)

      // 拼接代码到iframe
      setTimeout(() => {
        const content = state.textBoxContent
        const document = iframe.contentWindow.document

        // 如果当前使用语言为MarkDown就不需要引入外部css和js，而是引入是用于md样式的css
        if (this.HTMLPrep !== 'MarkDown') {
          let linkArr = document.getElementsByTagName('link')
          if (linkArr.length) {
            for (let i = linkArr.length - 1; i >= 0; i--) {
              linkArr[i].parentNode.removeChild(linkArr[i])
            }
          }
          for (let item of validCss) {
            createTag.createLinkOrCDN(iframe, 'link', item)
          }
        } else {
          createTag.createLinkOrCDN(
            iframe,
            'link',
            '../css/github-markdown.css'
          )
        }

        createTag.createLinkOrCDN(iframe, 'link', '../css/runner.css')

        const style = document.getElementById('compOlCss')
        if (style) style.parentNode.removeChild(style)

        createTag.createStyleOrScript(
          iframe,
          'style',
          'compOlCss',
          codeObj.CSSCode
        )

        const script = document.getElementById('src')
        if (script) script.parentNode.removeChild(script)
        const code = `\n${codeObj.JSCode}\n${exeCode}\n`
        document.body.innerHTML = codeObj.HTMLCode
        for (let item of validCDN) {
          createTag.createLinkOrCDN(iframe, 'script', item)
        }
        createTag.createStyleOrScript(iframe, 'script', 'src', code)
        // 获取console输出值放入state
        const info = iframe.contentWindow.consoleInfo
        this.$store.commit('updateConsole', info)
      }, waitTime)
    },
    reSetConsole() {
      // 重置console信息
      this.$refs.iframeBox.contentWindow.consoleInfo = []
      this.$store.state.consoleInfo = []
    }
  }
}
</script>

<style lang='scss' src='./componentStyle/textareaBox.scss' scoped></style>
