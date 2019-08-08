<template>
  <div :ref="title" :style="{width:textBoxW[initTitle]}" class="flex flex-clo" id="textareaBox">
    <div class="title noselect flex flex-ali">
      <span>{{title}}</span>
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
      <div
        @mousedown="boxMouseDown"
        @mouseout="boxMouseOut"
        @mouseover="boxMouseOver"
        class="resize flex flex-jcc"
        v-if="index!=len-1"
      >
        <div class="resize-line" ref="line"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Console from './console'
import { codemirror } from 'vue-codemirror'
import CodeMirror from 'codemirror'
import { mapState } from 'vuex'
import * as compiler from '../utils/compiler'
import * as createTag from '../utils/createTags'
import * as judge from '../utils/judgeMode'
import getCompiledCode from '../utils/getCompiledCode'
import getEditor from '../utils/codeEditor'

export default {
  props: {
    index: Number,
    title: String,
    len: Number,
    typeList: Array,
    space: Number,
    extraConsole: String
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
    })
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
      this.sendCodeToIframe(newVal)
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
    boxMouseOver(e) {
      this.$refs.line.style.border = '.5px dashed #65d3fd'
    },
    boxMouseOut(e) {
      this.$refs.line.style.border = '.5px solid #999999'
    },
    boxMouseDown(e) {
      const starX = e.clientX
      const elInfo = this.$refs[this.title]
      const title = this.initTitle
      const starW = elInfo.offsetWidth
      let nextBox = judge.judgeMode(this.typeList[this.index + 1])

      // The event binding for this page does not affect the iframe, events are disabled when the mouse is moved over iframe,
      // screen will appears when the mouseDown event is triggers
      if (nextBox === 'Output') this.$store.commit('updateScreen', true)

      // Calculate the total width of two divs
      const wholeW =
        parseFloat(this.textBoxW[nextBox]) + parseFloat(this.textBoxW[title])
      document.onmousemove = ev => {
        let iEvent = ev || event
        const finW = starW + (iEvent.clientX - starX)
        if (finW > 100 && wholeW - finW > 100) {
          const store = this.$store
          store.commit('updateTextBoxW', {
            attr: title,
            value: finW + 'px'
          })
          store.commit('updateTextBoxW', {
            attr: nextBox,
            value: wholeW - finW + 'px'
          })
        }
      }

      // screen will hides when mouseUp event is triggers
      document.onmouseup = () => {
        document.onmousemove = null
        this.$store.commit('updateScreen', false)
      }
      return false
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
    sendCodeToIframe(exeCode) {
      if (this.initTitle === 'Output') {
        this.spliceHtml(0, exeCode)
      }
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

      // css link
      // url format check
      let validCss = []
      if (this.HTMLPrep !== 'MarkDown') {
        const cssLinks = state.cssLinks
        if (cssLinks.length) {
          for (let item of cssLinks) {
            if (!item) continue
            if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
              validCss.push(item)
          }
        }
      }

      // js cdn
      // url format check
      const cdnJs = state.cdnJs
      let validCDN = []
      if (cdnJs.length) {
        for (let item of cdnJs) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCDN.push(item)
        }
      }

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

        createTag.createLinkOrCDN(iframe, 'link', '../css/runner.css')

        let style = document.getElementById('compOlCss')
        if (style) style.parentNode.removeChild(style)
        createTag.createStyleOrScript(
          iframe,
          'style',
          'compOlCss',
          codeObj.CSSCode
        )

        let script = document.getElementById('src')
        const code = `
        (function(){
          ${codeObj.JSCode}\n${exeCode}
        })()
`
        if (script) script.parentNode.removeChild(script)
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
      this.$store.state.consoleInfo = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 600px) {
  .title {
    span {
      font-size: 10px !important;
    }
  }
  #textareaBox {
    width: 100% !important;
  }
}
.bgc {
  background-color: $dominantHue;
}
#textareaBox {
  height: 100%;
  min-width: 72px;
  box-sizing: border-box;
  .title {
    position: relative;
    span {
      color: $primaryHued;
      font-size: 12px;
      line-height: 20px;
      background-color: $dominantHue;
      padding: 1px 10px;
      display: inline-block;
      height: 20px;
      font-family: $josefinSans !important;
    }
    .type-box {
      @include setWAndH(100px, 100px);
      background-color: $primaryHued;
      position: absolute;
      z-index: 100;
      top: 100%;
    }
  }
  .text-box {
    @include setWAndH(100%, 100%);
    position: relative;
    .code {
      @include setWAndH(100%, 100%);
      background-color: $dominantHue;
      resize: none;
      outline: none;
      border: none;
      color: $primaryHued;
    }
    iframe {
      @include setWAndH(100%, 100%);
      background-color: #fff;
    }
    .screen-box {
      @include setWAndH(100%, 100%);
      position: absolute;
      z-index: 10;
    }
    .resize {
      @include setWAndH(5px, 100%);
      box-sizing: border-box;
      position: relative;
      cursor: e-resize;
      position: absolute;
      right: 0;
      z-index: 1000;
      .resize-line {
        @include setWAndH(1px, 100%);
        border: 0.5px solid #999999;
        box-sizing: border-box;
        cursor: e-resize;
        position: absolute;
        right: 0;
      }
    }
  }
}
</style>
