<template>
  <div :ref="title" :style="{width:textBoxW[initTitle]}" id="textareaBox">
    <div class="title noselect flex flex-ali">
      <span>{{title}}</span>
    </div>
    <div :class="title === 'Console'?'bgc':''" :ref="'textbox'+index" class="text-box">
      <codemirror
        :options="cmOptions"
        :value="message"
        class="code"
        ref="editor"
        v-if="showCode"
        v-model="message"
      ></codemirror>
      <Console v-if="title === 'Console'"></Console>
      <button
        @click="reSetConsole"
        class="clear noselect"
        v-if="showClear && this.title === 'Output'"
      >
        <i class="icon iconfont icon-lajitong"></i>
        <span class="clear-txt">Clear</span>
      </button>
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
        class="resize"
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
import { mapState } from 'vuex'
import * as compiler from '../../static/js/compiler.js'
export default {
  props: {
    index: Number,
    title: String,
    len: Number,
    typeList: Array,
    space: Number
  },
  data() {
    return {
      src: 'hello world',
      showCode: true, // Whether to display the code window
      showIframe: false, // Whether to display the iframe
      showClear: true, // Whether to display the clear button
      message: '', // original text
      initTitle: '',
      cmOptions: {
        // codemirror config
        flattenSpans: false, // 默认情况下，CodeMirror会将使用相同class的两个span合并成一个。通过设置此项为false禁用此功能
        tabSize: 2, // tab缩进空格数
        mode: '', // 模式
        theme: 'monokai', // 主题
        smartIndent: true, // 是否智能缩进
        lineNumbers: true, // 显示行号
        matchBrackets: true, // 匹配符号
        lineWiseCopyCut: true, // 如果在复制或剪切时没有选择文本，那么就会自动操作光标所在的整行
        indentWithTabs: true, // 在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符
        electricChars: true, // 在输入可能改变当前的缩进时，是否重新缩进
        indentUnit: 2, // 缩进单位，默认2
        autoCloseTags: true, // 自动关闭标签 addon/edit/
        autoCloseBrackets: true, // 自动输入括弧  addon/edit/
        foldGutter: true, // 允许在行号位置折叠
        cursorHeight: 1, // 光标高度
        keyMap: 'sublime', // 快捷键集合
        extraKeys: {
          'Ctrl-Alt': 'autocomplete',
          'Ctrl-Q': cm => {
            cm.foldCode(cm.getCursor())
          }
        }, //智能提示
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // 用来添加额外的gutter
        styleActiveLine: true // 激活当前行样式
      },
      later: true,
      timer: null
    }
  },
  components: {
    codemirror,
    Console
  },
  mounted() {
    let initTitle
    switch (this.title) {
      case 'HTML':
      case 'MarkDown':
        this.initTitle = 'HTML'
        break
      case 'CSS':
      case 'Sass':
      case 'Scss':
      case 'Less':
      case 'Stylus':
        this.initTitle = 'CSS'
        break
      case 'JavaScript':
      case 'TypeScript':
      case 'CoffeeScript':
        this.initTitle = 'JavaScript'
        break
      case 'Console':
        this.initTitle = 'Console'
        break
      case 'Output':
        this.initTitle = 'Output'
        break
    }
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
    space() {
      // watch tab-space value changes and resetting tab-space config
      if (this.$refs.editor) {
        const options = this.$refs.editor.$options.parent.cmOptions
        options.tabSize = this.space
        options.indentUnit = this.space
      }
    },
    typeList(newVal) {
      // clear button is only displayed when console is displayed
      const index = newVal.indexOf('Console')
      index === -1 ? (this.showClear = false) : (this.showClear = true)
    },
    message(newVal) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$store.commit('change', {
          title: this.initTitle,
          newVal
        })
      }, this.waitTime)
    },
    content: {
      deep: true,
      handler: function() {
        if (this.$store.state.autoUp && this.showIframe) {
          this.spliceHtml()
        }
      }
    },
    replace(newVal) {
      if (this.$refs.editor) {
        this.changeOptions('indentWithTabs', newVal)
      }
    },
    run(newVal) {
      if (this.title === 'Output') {
        if (newVal) {
          this.spliceHtml(100)
        }
      }
    }
  },
  methods: {
    async judgeMode() {
      const state = this.$store.state
      const content = state.textBoxContent
      const HTMLPrep = state.HTMLPrep
      const CSSPrep = state.CSSPrep
      const JSPrep = state.JSPrep
      let HTMLCode = '',
        CSSCode = '',
        JSCode = ''

      if (HTMLPrep === 'HTML') {
        HTMLCode = content.HTML
      } else if (HTMLPrep === 'MarkDown') {
        await compiler
          .compileMarkDown(content.HTML)
          .then(code => {
            HTMLCode = code
          })
          .catch(err => {
            console.log(err)
          })
      }

      if (CSSPrep === 'CSS') {
        CSSCode = content.CSS
      } else if (CSSPrep === 'Sass' || CSSPrep === 'Scss') {
        await compiler
          .compileSass(content.CSS)
          .then(code => {
            CSSCode = code
          })
          .catch(err => {
            console.log(err)
          })
      } else if (CSSPrep === 'Less') {
        await compiler
          .compileLess(content.CSS)
          .then(code => {
            CSSCode = code.css
          })
          .catch(err => {
            console.log(err)
          })
      } else if (CSSPrep === 'Stylus') {
        await compiler
          .compileStylus(content.CSS)
          .then(code => {
            CSSCode = code
          })
          .catch(err => {
            console.log(err)
          })
      }

      if (JSPrep === 'JavaScript') {
        JSCode = content.JavaScript
      } else if (JSPrep === 'TypeScript') {
        JSCode = compiler.compileTypeScript(content.JavaScript)
      } else if (JSPrep === 'CoffeeScript') {
        await compiler
          .compileCoffeeScript(content.JavaScript)
          .then(code => {
            JSCode = code
          })
          .catch(err => {
            console.log(err)
          })
      }
      return {
        HTMLCode,
        CSSCode,
        JSCode
      }
    },
    changeOptions(key, val) {
      this.$refs.editor.$options.parent.cmOptions[key] = val
    },
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
      let nextBox = this.typeList[this.index + 1]

      switch (nextBox) {
        case 'HTML':
        case 'MarkDown':
          nextBox = 'HTML'
          break
        case 'CSS':
        case 'Sass':
        case 'Scss':
        case 'Less':
        case 'Stylus':
          nextBox = 'CSS'
          break
        case 'JavaScript':
        case 'TypeScript':
        case 'CoffeeScript':
          nextBox = 'JavaScript'
          break
        case 'Console':
          nextBox = 'Console'
          break
        case 'Output':
          nextBox = 'Output'
          break
      }

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
      //Page initializes the execution function
      const initText = this.$store.state.textBoxContent
      const title = this.title
      switch (this.title) {
        case 'HTML':
          this.message = initText.HTML
          this.cmOptions.mode = 'text/html'
          break
        case 'MarkDown':
          this.message = initText.HTML
          this.cmOptions.mode = 'text/x-markdown'
          break
        case 'CSS':
          this.message = initText.CSS
          this.cmOptions.mode = 'css'
          break
        case 'Sass':
          this.message = initText.CSS
          this.cmOptions.mode = 'text/x-sass'
          break
        case 'Scss':
          this.message = initText.CSS
          this.cmOptions.mode = 'text/x-scss'
          break
        case 'Less':
          this.message = initText.CSS
          this.cmOptions.mode = 'text/x-less'
          break
        case 'Stylus':
          this.message = initText.CSS
          this.cmOptions.mode = 'text/x-styl'
          break
        case 'JavaScript':
          this.message = initText.JavaScript
          this.cmOptions.mode = 'text/javascript'
          break
        case 'TypeScript':
          this.message = initText.JavaScript
          this.cmOptions.mode = 'text/typescript'
          break
        case 'CoffeeScript':
          this.message = initText.JavaScript
          this.cmOptions.mode = 'text/coffeescript'
          break
        default:
          this.showCode = false
          this.cmOptions = ''
          if (title === 'Output') {
            this.showIframe = true
          }
          break
      }
    },
    async spliceHtml(time) {
      // get code
      let codeObj
      await this.judgeMode().then(obj => {
        codeObj = obj
      })

      // css link
      // url format check
      const cssLinks = this.$store.state.cssLinks
      let validCss = []
      if (cssLinks.length) {
        for (let item of cssLinks) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCss.push(item)
        }
      }

      // js cdn
      // url format check
      const cdnJs = this.$store.state.cdnJs
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
        const content = this.$store.state.textBoxContent
        const iframe = this.$refs.iframeBox
        let linkArr = iframe.contentWindow.document.getElementsByTagName('link')
        if (linkArr.length) {
          for (let i = linkArr.length - 1; i >= 0; i--) {
            linkArr[i].parentNode.removeChild(linkArr[i])
          }
        }
        for (let item of validCss) {
          this.createLink('link', item)
        }

        let style = iframe.contentWindow.document.getElementById('compOlCss')
        if (style) style.parentNode.removeChild(style)
        this.createStyle('style', 'compOlCss', codeObj.CSSCode)

        let script = iframe.contentWindow.document.getElementById('src')
        const code = `
        (function(){
          ${codeObj.JSCode}
        })()
`
        if (script) script.parentNode.removeChild(script)
        iframe.contentWindow.document.body.innerHTML = codeObj.HTMLCode
        for (let item of validCDN) {
          this.createCDN('script', item)
        }
        this.createScript('script', 'src', code)

        const info = iframe.contentWindow.consoleInfo
        this.$store.commit('updateConsole', info)
      }, waitTime)
    },
    clearConsole() {
      this.$refs.iframeBox.contentWindow.consoleInfo = []
    },
    createScript(element, id, code) {
      let iframe = this.$refs.iframeBox
      let ele = iframe.contentWindow.document.createElement(element)
      ele.id = id
      ele.text = code
      iframe.contentWindow.document.body.appendChild(ele)
    },
    createStyle(element, id, code) {
      let iframe = this.$refs.iframeBox
      let ele = iframe.contentWindow.document.createElement(element)
      ele.id = id
      ele.innerText = code
      iframe.contentWindow.document.head.appendChild(ele)
    },
    createCDN(element, url) {
      let iframe = this.$refs.iframeBox
      let ele = iframe.contentWindow.document.createElement(element)
      ele.src = url
      iframe.contentWindow.document.body.appendChild(ele)
    },
    createLink(element, url) {
      let iframe = this.$refs.iframeBox
      let ele = iframe.contentWindow.document.createElement(element)
      ele.href = url
      ele.rel = 'stylesheet'
      iframe.contentWindow.document.head.appendChild(ele)
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
  .clear {
    left: -31px !important;
    .clear-txt {
      display: none;
    }
  }
  #textareaBox {
    width: 100% !important;
  }
}
.bgc {
  background-color: #1e1e1e;
}
#textareaBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 72px;
  box-sizing: border-box;
  .title {
    position: relative;
    span {
      color: #fff;
      font-size: 12px;
      background-color: #1e1e1e;
      padding: 1px 10px;
      display: inline-block;
      line-height: 20px;
      height: 20px;
      font-family: 'Josefin Sans', sans-serif !important;
    }
    .type-box {
      width: 100px;
      height: 100px;
      background-color: #fff;
      position: absolute;
      z-index: 100;
      top: 100%;
    }
  }
  .text-box {
    display: flex;
    height: 100%;
    width: 100%;
    position: relative;
    .code {
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
      resize: none;
      outline: none;
      border: none;
      color: #fff;
    }
    textarea {
      width: 100%;
      height: 100%;
      background-color: #1e1e1e;
      resize: none;
      outline: none;
      border: none;
      color: #fff;
    }
    .clear {
      position: absolute;
      height: 20px;
      top: -21px;
      left: -68px;
      background-color: #1e1e1e;
      border: 1px solid #1e1e1e;
      color: #f2f2f2;
      outline: none;
      font-family: 'Josefin Sans', sans-serif !important;
    }
    .clear:active {
      background-color: #eee;
    }
    iframe {
      width: 100%;
      height: 100%;
      background-color: #fff;
    }
    .screen-box {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 10;
    }
    .resize {
      height: 100%;
      width: 5px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      position: relative;
      cursor: e-resize;
      position: absolute;
      right: 0;
      z-index: 1000;
      .resize-line {
        height: 100%;
        width: 1px;
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
