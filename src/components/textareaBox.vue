<template>
  <div :ref="title" :style="{width:textBoxW[title]}" id="textareaBox">
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
      <iframe
        allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
        frameborder="0"
        id="iframe"
        name="iframe"
        ref="iframeBox"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
        scrolling="yes"
        src="../../static/html/runner.html"
        v-if="showIframe"
      ></iframe>
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
import htmlMethods from './cmpsMethods/htmlMethods'
import cssMethods from './cmpsMethods/cssMethods'
import jsMethods from './cmpsMethods/jsMethods'
import consoleMethods from './cmpsMethods/consoleMethods'
import outputMethods from './cmpsMethods/outputMethods'
import publicMethods from './cmpsMethods/publicMethods'
import Console from './console'
import { codemirror } from 'vue-codemirror'
require('codemirror/mode/javascript/javascript.js')
require('codemirror/mode/xml/xml.js')
require('codemirror/mode/css/css.js')
require('codemirror/keymap/vim.js')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/display/fullscreen.js')
require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/anyword-hint.js')
require('codemirror/addon/search/searchcursor.js')
require('codemirror/addon/dialog/dialog.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/edit/closetag.js')
require('codemirror/addon/edit/closebrackets.js')
require('codemirror/addon/selection/active-line.js')
require('codemirror/addon/edit/matchtags')
require('codemirror/addon/edit/matchbrackets')

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
      message: '',
      cmOptions: {
        tabSize: this.space, // tab缩进空格数
        mode: '', // 模式
        theme: 'monokai', // 主题
        smartIndent: true, // 是否智能缩进
        lineNumbers: true, // 显示行号
        matchBrackets: true, // 匹配符号
        lineWiseCopyCut: true, // 如果在复制或剪切时没有选择文本，那么就会自动操作光标所在的整行
        lineWrapping: true, // 在长行时文字是换行(wrap)还是滚动(scroll)
        indentWithTabs: true, // 在缩进时，是否需要把 n*tab宽度个空格替换成n个tab字符
        electricChars: true, // 在输入可能改变当前的缩进时，是否重新缩进
        indentUnit: 4, // 缩进单位，默认2
        autoCloseTags: true, // 自动关闭标签 addon/edit/
        autoCloseBrackets: true, // 自动输入括弧  addon/edit/
        foldGutter: true, // 允许在行号位置折叠
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // 用来添加额外的gutter
        extraKeys: { 'Ctrl-Space': 'autocomplete' }, // 给编辑器绑定与前面keyMap配置不同的快捷键
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
  watch: {
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
      }, 1000)
    },
    content: {
      deep: true,
      handler: function() {
        if (this.showIframe) {
          this.spliceHtml()
        }
      }
    }
  },
  computed: {
    textBoxW() {
      return this.$store.state.textBoxW
    },
    content() {
      return this.$store.state.textBoxContent
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
      const starY = e.clientY
      const elInfo = this.$refs[this.title]
      const starW = elInfo.offsetWidth
      const starH = elInfo.offsetHeight
      const starLeft = elInfo.offsetWidth + elInfo.offsetLeft
      const starTop = elInfo.offsetHeight + elInfo.offsetTop
      const nextBox = this.typeList[this.index + 1]
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
      document.onmouseup = function() {
        document.onmousemove = null
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
    spliceHtml() {
      setTimeout(() => {
        this.$refs.iframeBox.contentDocument.getElementById('compOlCss').innerText = this.$store.state.textBoxContent.CSS
        let script = this.$refs.iframeBox.contentDocument.getElementById('src')
        const code = `
        (function(){
          ${this.$store.state.textBoxContent.JavaScript}
        })()
        `
        if (script) script.parentNode.removeChild(script)
        this.$refs.iframeBox.contentDocument.body.innerHTML = this.$store.state.textBoxContent.HTML
        this.createScript('script', 'src', code)
        const info = this.$refs.iframeBox.contentWindow.consoleInfo
        this.$store.commit('updateConsole', info)
      }, 1000)
    },
    clearConsole() {
      this.$refs.iframeBox.contentWindow.consoleInfo = []
    },
    createScript(element, id, code) {
      let ele = this.$refs.iframeBox.contentDocument.createElement(element)
      ele.id = id
      ele.text = code
      this.$refs.iframeBox.contentDocument.body.appendChild(ele)
    }
  }
}
</script>

<style lang="scss" scoped>
.bgc {
  background-color: #1e1e1e;
}
#textareaBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  box-sizing: border-box;
  .title {
    span {
      color: #fff;
      font-size: 12px;
      background-color: #1e1e1e;
      padding: 1px 10px;
      display: inline-block;
      line-height: 20px;
      height: 20px;
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
      background-color: #333333;
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
    iframe {
      width: 100%;
      height: 100%;
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
