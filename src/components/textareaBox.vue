<template>
  <div :ref="title" :style="{width:textBoxW[title]}" id="textareaBox">
    <div class="title noselect flex flex-ali">
      <span>{{preprocessor}}</span>
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
import marked from 'marked'
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
      showCode: true,
      showIframe: false,
      showClear: true,
      message: '',
      preprocessor: this.title,
      cmOptions: {
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
    this.init()
  },
  computed: {
    textBoxW() {
      return this.$store.state.textBoxW
    },
    content() {
      return this.$store.state.textBoxContent
    },
    showScreen() {
      return this.$store.state.showScreen
    },
    waitTime() {
      return this.$store.state.waitTime
    },
    replace() {
      return this.$store.state.replace
    },
    autoUp() {
      return this.$store.state.autoUp
    },
    run() {
      return this.$store.state.isRun
    },
    HTMLPrep() {
      return this.$store.state.HTMLPrep
    },
    CSSPrep() {
      return this.$store.state.CSSPrep
    },
    JSPrep() {
      return this.$store.state.JSPrep
    }
  },
  watch: {
    space() {
      if (this.$refs.editor) {
        const options = this.$refs.editor.$options.parent.cmOptions
        options.tabSize = this.space
        options.indentUnit = this.space
      }
    },
    typeList(newVal) {
      const index = newVal.indexOf('Console')
      index === -1 ? (this.showClear = false) : (this.showClear = true)
    },
    message(newVal) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        const title = this.title
        this.$store.commit('change', {
          title,
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
    },
    HTMLPrep(newVal) {
      if (this.title === 'HTML')
        if (newVal === 'none') this.preprocessor = 'HTML'
        else this.preprocessor = newVal
    },
    CSSPrep(newVal) {
      if (this.title === 'CSS')
        if (newVal === 'none') this.preprocessor = 'CSS'
        else this.preprocessor = newVal
    },
    JSPrep(newVal) {
      if (this.title === 'JavaScript')
        if (newVal === 'none') this.preprocessor = 'JavaScript'
        else this.preprocessor = newVal
    },
    preprocessor(newVal) {
      if (this.title === 'HTML') {
        if (newVal === 'HTML') {
          this.changeOptions('mode', 'text/html')
        } else if (newVal === 'MarkDown') {
          // 设置markdown参数
          marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight(code) {
              return Hljs.highlightAuto(code).value
            }
          })
          this.changeOptions('mode', 'text/x-markdown')
        }
      } else if (this.title === 'CSS') {
        if (newVal === 'CSS') {
          this.changeOptions('mode', 'css')
        } else if (newVal === 'Sass') {
          this.changeOptions('mode', 'text/x-sass')
        }
      } else if (this.title === 'JS') {
        if (newVal === 'JavaScript') {
          this.changeOptions('mode', 'javascript')
        }
      }
    }
  },
  methods: {
    judgeMode() {
      const content = this.$store.state.textBoxContent
      const prep = this.$store.state.HTMLPrep
      if (prep === 'none') {
        return content.HTML
      } else if (prep === 'MarkDown') {
        return marked(content.HTML, { sanitize: true })
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
      const starY = e.clientY
      const elInfo = this.$refs[this.title]
      const starW = elInfo.offsetWidth
      const starH = elInfo.offsetHeight
      const starLeft = elInfo.offsetWidth + elInfo.offsetLeft
      const starTop = elInfo.offsetHeight + elInfo.offsetTop
      const nextBox = this.typeList[this.index + 1]
      if (nextBox === 'Output') this.$store.commit('updateScreen', true)
      const wholeW =
        parseFloat(this.textBoxW[nextBox]) +
        parseFloat(this.textBoxW[this.title])
      document.onmousemove = ev => {
        let iEvent = ev || event
        const finW = starW + (iEvent.clientX - starX)
        if (finW > 100 && wholeW - finW > 100) {
          this.$store.state.textBoxW[this.title] = finW + 'px'
          this.$store.state.textBoxW[nextBox] = wholeW - finW + 'px'
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        this.$store.commit('updateScreen', false)
      }
      return false
    },
    init() {
      //页面初始化执行函数
      const initText = this.$store.state.textBoxContent
      const title = this.title
      if (title === 'HTML') {
        this.message = initText.HTML
        this.cmOptions.mode = 'text/html'
      } else if (title === 'CSS') {
        this.message = initText.CSS
        this.cmOptions.mode = 'css'
      } else if (title === 'JavaScript') {
        this.message = initText.JavaScript
        this.cmOptions.mode = 'javascript'
      } else {
        this.showCode = false
        this.cmOptions = ''
        if (title === 'Output') {
          this.showIframe = true
        }
      }
    },
    spliceHtml(time) {
      const cssLinks = this.$store.state.cssLinks
      let validCss = []

      if (cssLinks.length) {
        for (let item of cssLinks) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCss.push(item)
        }
      }
      const cdnJs = this.$store.state.cdnJs
      let validCDN = []
      if (cdnJs.length) {
        for (let item of cdnJs) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCDN.push(item)
        }
      }
      let waitTime = null
      !time ? (waitTime = this.waitTime) : (waitTime = 0)
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
        this.createStyle('style', 'compOlCss', content.CSS)

        let script = iframe.contentWindow.document.getElementById('src')
        const code = `
        (function(){
          ${content.JavaScript}
        })()
`
        if (script) script.parentNode.removeChild(script)
        iframe.contentWindow.document.body.innerHTML = this.judgeMode()
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
