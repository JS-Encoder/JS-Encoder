<template>
  <div :ref="title" :style="{width:textBoxW[initTitle]}" class="flex flex-clo" id="textareaBox">
    <div class="title noselect flex flex-ai">
      <span>{{title}}</span>
      <div class="iframe-width" v-if="initTitle === 'Output'">{{ iframeWidth}}</div>
    </div>
    <div :class="title === 'Console'?'bgc':''" :ref="'textbox'+index" class="text-box flex">
      <codemirror
        :options="cmOptions"
        :value="message"
        class="code"
        ref="editor"
        v-if="showCode"
        v-model="message"
      ></codemirror>
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
    this.initTitle = judge.judgeMode(this.title)
    this.init()
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
    'content.HTML': function(newVal) {
      if (this.initTitle === 'HTML') {
        this.message = newVal
      }
    },
    'content.CSS': function(newVal) {
      if (this.initTitle === 'CSS') {
        this.message = newVal
      }
    },
    'content.JavaScript': function(newVal) {
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
      if (!(title === 'Console' || title === 'Output')) {
        this.cmOptions.tabSize = this.space
        this.cmOptions.indentUnit = this.space
      }
    },
    message(newVal) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$store.commit('change', {
          [this.initTitle]: newVal
        })
      }, this.waitTime)
    },
    content: {
      deep: true,
      handler: function() {
        if (this.$store.state.autoUp && this.showIframe) {
          this.reSetConsole()
          this.spliceHtml()
        }
      }
    },
    replace(newVal) {
      if (this.$refs.editor) {
        this.cmOptions.indentWithTabs = newVal
      }
    },
    run(newVal) {
      if (this.title === 'Output') {
        if (newVal) {
          this.reSetConsole()
          this.spliceHtml(100)
        }
      }
    }
  },
  methods: {
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
        return
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
      const state = this.$store.state
      // get code
      let codeObj
      await getCompiledCode(state).then(obj => {
        codeObj = obj
      })

      // url format check
      let validCss = []
      const cssLinks = state.cssLinks
      judgeFormat(cssLinks, function(item) {
        validCss.push(item)
      })
      let validCDN = []
      const cdnJs = state.cdnJs
      judgeFormat(cdnJs, function(item) {
        validCDN.push(item)
      })

      // waitTime
      let waitTime = null
      !time ? (waitTime = this.waitTime) : (waitTime = 0)

      // splice html, css and js
      setTimeout(() => {
        const content = state.textBoxContent
        const iframe = this.$refs.iframeBox
        const document = iframe.contentWindow.document

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

        // init style
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
        const code = `\n(()=>{\n${codeObj.JSCode}\n${exeCode}\n})()\n`

        document.body.innerHTML = codeObj.HTMLCode

        for (let item of validCDN) {
          createTag.createLinkOrCDN(iframe, 'script', item)
        }
        createTag.createStyleOrScript(iframe, 'script', 'src', code)
        const info = iframe.contentWindow.consoleInfo
        this.$store.commit('updateConsole', info)
      }, waitTime)
    },
    reSetConsole() {
      this.$refs.iframeBox.contentWindow.consoleInfo = []
      this.$store.state.consoleInfo = []
    }
  }
}
</script>

<style lang="scss" src="./componentStyle/textareaBox.scss" scoped></style>
