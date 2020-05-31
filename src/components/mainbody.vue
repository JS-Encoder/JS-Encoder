<template>
  <div id="mainbody" class="flex flex-clo">
    <div class="tabs-list flex">
      <MarkdownTools :cm="cm" v-show="isMD" :getIframeBody="getIframeBody"></MarkdownTools>
      <div class="tabs flex">
        <Tabs :key="index" :tabInfo="item" v-for="(item, index) in tabsInfo"
          v-show="!isMD||(preprocess[0]==='Markdown'&&(item.name==='Markdown'||item.name==='Output'))"></Tabs>
      </div>
      <div>
        <button @click="saveProject">screenshot</button>
      </div>
      <div class="tabs-commands flex">
        <div @click="saveProject" v-show="showSaveBtn" class="save flex flex-ai flex-jcc" title="Save">
          <i class="icon iconfont" :class="showSaveLoader?'icon-load1 load':'icon-gengxin1'"></i>
          <span>{{langSave}}</span>
        </div>
        <div v-for="(item, index) in tabsCommands" :key="index" :title="tabsLang[index]" class="flex flex-ai flex-jcc"
          @click="judgeTabsCommands(item.name)">
          <i class="icon iconfont" :class="item.class"></i>
        </div>
        <div class="menu flex flex-ai flex-jcc">
          <el-dropdown class="dropdown-menu flex flex-ai flex-jcc" placement="top-start" trigger="hover">
            <i class="icon iconfont icon-gengduo2 more" style="font-size:22px"></i>
            <el-dropdown-menu class="menu" slot="dropdown" placement="bottom">
              <el-dropdown-item icon="icon iconfont icon-zhongzhi" @click.native="resetCode">
                {{tabMenuLang[0]}}
              </el-dropdown-item>
              <el-dropdown-item icon="icon iconfont icon-fangda" @click.native="fullScreen">
                {{tabMenuLang[1]}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="user flex flex-ai flex-jcc" title="User" @click="showUserMenu">
          <i v-if="!avatar" class="icon iconfont icon-user"></i>
          <img class="avatar" v-if="avatar" :src="avatar" alt="">
        </div>
      </div>
    </div>
    <div class="code-area-box flex" :class="isMD?'code-area-box-full':''" ref="codeArea"
      :style="{ height: codeAreaHeight+'px'}">
      <CodeArea :ref="'codeArea'+index" v-for="(item, index) in preprocess" :key="index" :codeMode="item"
        :style="{width: codeAreaWidth+'px'}" v-show="item === currentTab" :showCodeArea="item === currentTab"
        :index="index" @runCode="runCode"></CodeArea>
      <div v-if="showResize" class="resize" @mousedown="boxMouseDown"></div>
      <div v-show="showIframe" class="iframe-box" :class="{'full-screen':iframeFullScreen,'iframe-box-full':isMD}"
        :style="{ height: codeAreaHeight+'px', width: iframeWidth+'px'}">
        <div class="iframe-screen" v-show="iframeScreen"></div>
        <div class="iframe-size-height" v-show="showIframeHeight">{{codeAreaHeight+'px'}}</div>
        <div class="iframe-size-width" v-show="showIframeWidth">{{iframeWidth+'px'}}</div>
        <div class="iframe-opt" v-show="iframeFullScreen">
          <div class="opt-list flex">
            <div class="opt flex flex-ai flex-jcc" @click="runWithFullScreen(200)">
              <i class="icon iconfont icon-zhihang"></i>
            </div>
            <div class="opt flex flex-ai flex-jcc" @click="exitFullScreen">
              <i class="icon iconfont icon-suoxiao"></i>
            </div>
          </div>
          <div class="scale-box flex flex-ai flex-jcc">
            <span class="proportion">{{iframeScale}}%</span>
            <el-slider v-model="iframeScale" :step="25" show-stops :min="25" :max="500">
            </el-slider>
          </div>
        </div>
        <iframe
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
          frameborder="0" id="iframe" name="iframe" ref="iframeBox"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
          scrolling="yes" allowfullscreen="true" src="static/html/runner.html"></iframe>
      </div>
    </div>
    <div class="console-box" :style="{ height: consoleSize + 'px' }" v-show="!isMD">
      <Console></Console>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tabs from './tabs.vue'
import Console from './console.vue'
import CodeArea from './codeArea.vue'
import MarkdownTools from './markdownTools'
import handleIframe from '@/utils/handleIframe'
import getCompiledCode from '@/utils/getCompiledCode'
import reqUserInfo from '@/utils/requestUserInfo'
import iframeConsole from '@/utils/console'
import handleShortcut from '@/utils/handleShortcut'
import handleIframeImage from '@/utils/handleIframeImage'
import handleCookie from '@/utils/handleCookie'
import SyncScroll from '@/utils/syncScroll'
export default {
  data() {
    return {
      tabsCommands: [
        {
          name: 'run',
          class: 'icon-zhihang'
        }
      ],
      consoleInfo: [],
      init: false,
      showResize: true,
      isSmallScreen: false,
      showIframe: true,
      iframeFullScreen: false,
      iframeScale: 100,
      tabMenuLang: window.Global.language.tabsMenu,
      isChildrenMounted: false,
      isMD: false,
      showSaveLoader: false
    }
  },
  created() {
    // 如果url中存在项目id，获取项目
    const path = this.$route.path
    const id = path.split('/')[2]
    id && this.getProjectDetail(id)
  },
  mounted() {
    /**
     * 响应式布局策略
     * 屏幕宽度小于768px(正常平板宽度)时，iframe和code窗口分栏布局取消
     * iframe变成code窗口一样的布局
     * 屏幕宽度小于480px(最大手机宽度)时，侧边菜单栏隐藏，点击显示按钮才会显示
     */
    const commit = this.$store.commit
    this.judgeMD(this.preprocess[0])
    const codeAreaH = document.body.clientHeight - 180
    this.updateDisplay(this.clientWidth)
    commit('updateCodeAreaHeight', codeAreaH)
    commit('updateIframeScreen', false)
    new iframeConsole(this.$refs.iframeBox)
    new handleShortcut().init()
    this.runCode().then(consoleInfo => {
      !this.isMD && (this.consoleInfo = consoleInfo)
      this.init = true
    })
    this.$nextTick(() => {
      this.isChildrenMounted = true
    })
  },
  computed: {
    tabsLang() {
      return window.Global.language.tabsCommands
    },
    ...mapState({
      consoleSize: 'consoleSize',
      codeAreaHeight: 'codeAreaHeight',
      codeAreaWidth: 'codeAreaWidth',
      iframeWidth: 'iframeWidth',
      preprocess: 'preprocess',
      currentTab: 'currentTab',
      language: 'language',
      codeOptions: 'codeOptions',
      iframeScreen: 'iframeScreen',
      showIframeHeight: 'showIframeHeight',
      showIframeWidth: 'showIframeWidth',
      showSaveBtn: 'showSaveBtn',
      codeAreaContent: 'codeAreaContent',
      projectName: 'projectName',
      tags: 'tags',
      projectId: 'projectId',
      CDNList: 'CDNList',
      linkList: 'linkList',
      posterKey: 'posterKey',
      clientWidth: 'clientWidth'
    }),
    langSave() {
      return this.language === 'zh' ? '保存' : 'Save'
    },
    tabsInfo() {
      const preprocess = this.preprocess
      let iconHTML = 'icon-html',
        iconCSS = 'icon-style',
        iconJavaScript = 'icon-javascript'
      if (preprocess[0] === 'Markdown') iconHTML = 'icon-markdown'
      switch (preprocess[1]) {
        case 'Sass':
        case 'Scss':
          iconCSS = 'icon-Sass'
          break
        case 'Stylus':
          iconCSS = 'icon-stylus'
          break
        case 'Less':
          iconCSS = 'icon-less'
      }
      switch (preprocess[2]) {
        case 'TypeScript':
          iconJavaScript = 'icon-typescript-def'
          break
        case 'CoffeeScript':
          iconJavaScript = 'icon-coffeescript'
      }
      const finArr = [
        {
          name: preprocess[0],
          class: iconHTML
        },
        {
          name: preprocess[1],
          class: iconCSS
        },
        {
          name: preprocess[2],
          class: iconJavaScript
        }
      ]
      if (this.isSmallScreen)
        finArr.push({
          name: 'Output',
          class: 'icon-yanjing'
        })
      return finArr
    },
    firstPrep() {
      return this.preprocess[0]
    },
    avatar() {
      return this.$store.state.userInfo.avatarUrl
    },
    cm() {
      if (this.isChildrenMounted) {
        return this.getCodeMirror()
      }
    }
  },
  watch: {
    language(newLang) {
      this.tabMenuLang = window.Global.language.tabsMenu
    },
    consoleInfo(newInfo) {
      this.$store.commit('updateConsoleInfo', newInfo)
    },
    firstPrep(newPrep, oldPrep) {
      this.judgeMD(newPrep)
    },
    isMD(newVal) {
      if (newVal) {
        this.$store.commit('updateCurrentTab', 'Markdown')
        this.initSyncScroll()
      } else {
        new SyncScroll().clearScroll()
      }
    },
    currentTab(newTab) {
      this.judgeIframeShows(newTab)
    },
    clientWidth(newWidth) {
      this.updateDisplay(newWidth)
    },
    iframeScale(newP) {
      this.changeIframeProportion(newP)
    }
  },
  methods: {
    judgeMD(newPrep) {
      this.isMD = newPrep === 'Markdown'
    },
    updateDisplay(clientWidth) {
      clientWidth = clientWidth ? clientWidth : document.body.clientWidth
      const commit = this.$store.commit
      let sidebarWidth = 50
      let iframeWidth = 0
      if (clientWidth <= 485) {
        this.showResize = false
        iframeWidth = clientWidth
        this.isSmallScreen = true
      } else if (clientWidth <= 768) {
        this.showResize = false
        this.isSmallScreen = true
        iframeWidth = clientWidth
      } else {
        this.showResize = true
        this.isSmallScreen = false
        iframeWidth = (clientWidth - sidebarWidth - 4) / 2
        if (this.currentTab === 'Output') {
          commit('updateCurrentTab', this.preprocess[0])
        }
      }
      this.judgeIframeShows(this.currentTab)
      commit('updateIframeWidth', iframeWidth)
      commit('updateCodeAreaWidth', iframeWidth)
    },
    judgeIframeShows(newTab) {
      if (this.isSmallScreen && !this.iframeFullScreen) {
        this.showIframe = newTab === 'Output'
      } else {
        this.showIframe = true
      }
    },
    getProjectDetail(id) {
      // 根据url中的id获取项目详情
      reqUserInfo.getProjectDetail(id).then(res => {
        if (!res && !Object.keys(res)) return void 0
        const commit = this.$store.commit
        commit('updateCodeAreaAllMessage', res.content)
        commit('updateAllPreprocess', res.prep)
        commit('updateCdnJS', res.CDNList)
        commit('updateLinkList', res.linkList)
        commit('updateProjectId', res.projectId)
      })
    },
    saveProject() {
      /**
       * 改变iframe宽高用于截图
       * 获取base64编码和token，存入七牛云
       * token存储于cookie，有效期为1小时，时效过了向后台请求
       * 最后请求七牛云删除旧的poster
       */
      this.showSaveLoader = true
      const iframe = this.$refs.iframeBox
      const iframeStyle = iframe.style
      const iframeBody = iframe.contentWindow.document.body
      const language = this.language === 'zh'
      const commit = this.$store.commit
      // 如果当前为小屏幕（手机或平板），那么iframe可能是隐藏的，需要将iframe状态先设置为显示
      // 同时也要调整iframe大小已截出合适尺寸的图
      const currentTab = this.currentTab
      if (currentTab !== 'Output' && this.isSmallScreen) {
        commit('updateCurrentTab', 'Output')
      }
      handleIframeImage.screenshotBySVG(iframe).then(async dataUrl => {
        let imgUrl = ''
        if (this.isSmallScreen) commit('updateCurrentTab', currentTab)
        let token = handleCookie.getCookieValue('qnyToken') // 获取七牛云token
        if (!token) {
          //没有token？
          await handleIframeImage.getToken().then(res => {
            //重新请求token
            token = res
          })
          handleCookie.setCookie('qnyToken', token, 1 / 24) //设置token有效时间
        }
        await handleIframeImage
          .sendImageToQiNiuYun(dataUrl, token)
          .then(res => {
            // 获取七牛云返回的图片链接
            this.showSaveLoader = false
            if (res.error) {
              this.$notify({
                message: language ? '项目保存失败' : 'Project save failed',
                position: 'bottom-right',
                iconClass: 'icon iconfont icon-error1 error-icon',
                duration: 1500
              })
              return void 0
            }
            imgUrl = res
            commit('updateShowSaveBtn', false)
          })
        await reqUserInfo
          .updateProjectDetail({
            // 将图片链接连带项目更新至数据库
            poster: imgUrl,
            id: this.projectId,
            name: this.projectName,
            prep: this.preprocess,
            content: this.codeAreaContent,
            CDNList: this.CDNList,
            linkList: this.linkList
          })
          .then(res => {
            this.showSaveLoader = false
            // 弹出提示消息
            this.$notify({
              message: language ? '项目已保存' : 'Project saved',
              position: 'bottom-right',
              duration: 1500
            })
            handleIframeImage.deleteOldPoster(this.posterKey).then(res => {
              // 删除旧封面
              if (!res) commit('updatePosterKey', imgUrl)
            })
          })
      })
    },
    showUserMenu() {
      const commit = this.$store.commit
      commit('updateShowBg', true)
      commit('updateShowSlideUserMenu', true)
    },
    boxMouseDown(e) {
      // 拖拉中栏改变编辑窗口和iframe的宽度
      const store = this.$store
      const state = store.state
      const commit = store.commit
      // 在iframe上面显示遮罩层，否则会影响窗口拖拉
      commit('updateIframeScreen', true)
      // 显示iframe的宽度
      commit('updateShowIframeWidth', true)
      const starX = e.clientX
      const iframeWidth = this.iframeWidth
      const codeAreaWidth = this.codeAreaWidth
      const wholeSize = codeAreaWidth + iframeWidth
      document.onmousemove = ev => {
        const iEvent = ev || event
        const finSize = codeAreaWidth + iEvent.clientX - starX
        if (finSize > 100 && wholeSize - finSize > 100) {
          commit('updateCodeAreaWidth', finSize)
          commit('updateIframeWidth', wholeSize - finSize)
        }
        document.onmouseup = () => {
          commit('updateIframeScreen', false)
          commit('updateShowIframeWidth', false)
          document.onmousemove = null
        }
      }
    },
    judgeTabsCommands(cmdName) {
      switch (cmdName) {
        case 'run':
          this.runCode(500)
          break
      }
    },
    async runCode(waitTime) {
      // 执行代码，将代码写入到iframe
      const iframe = this.$refs.iframeBox
      const state = this.$store.state
      const codeAreaContent = state.codeAreaContent
      const preprocessor = state.preprocess
      const codeOptions = this.codeOptions
      const isMD = preprocessor[0] === 'Markdown'
      let link = state.linkList
      let cdn = state.CDNList
      // 传入waitTime参数代表立即显示效果(仍然有500ms延迟)，否则按照设置的时间延迟显示效果
      waitTime = waitTime ? waitTime : codeOptions.waitTime
      // 重新引入iframe，之前的js代码不会因为删除了原本的js代码而消失，必须重新引入
      // 第一次执行代码时或者预处理为markdown时不需要重新载入iframe
      if (this.init && !isMD) await handleIframe.refresh(iframe)
      iframe.onload = () => {
        if (!isMD) {
          new iframeConsole().refreshConsole(iframe)
          if (!codeOptions.showHistoryLog) this.cleanConsoleInfo()
        }
      }
      // 获取已经编译成为html、css、js的代码。判断是否使用预处理语言，如果使用，将预处理语言编译完成后返回，否则直接返回
      let finCode
      await getCompiledCode(codeAreaContent, preprocessor).then(code => {
        finCode = code
      })
      // 如果html预处理为markdown，不引入外部css和js
      if (isMD) {
        link = ['../css/github-markdown.css']
        cdn = [
          'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML',
          'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.13.0/flowchart.min.js'
        ]
      }
      // 重新加载iframe会有延迟，不加定时器会导致写入到iframe的代码消失
      await setTimeout(() => {
        handleIframe
          .sendCodeToIframe(iframe, finCode, link, cdn, isMD)
          .then(() => {
            if (isMD) {
              this.initSyncScroll()
            }
          })
      }, waitTime)
      return isMD ? void 0 : this.getConsoleInfo() // 返回Console日志列表
    },
    resetCode() {
      /**
       * 重置所有代码到初始状态
       * 先检查cookie中是否包含默认初始代码，如果有就重置为初始代码
       * 没有就全部重置为空
       */
      const commit = this.$store.commit
      let defaultCode = handleCookie.getCookieValue('defaultCode')
      let HTMLMessage = ''
      let CSSMessage = ''
      let JSMessage = ''
      if (defaultCode) {
        defaultCode = JSON.parse(defaultCode)
        HTMLMessage = defaultCode.HTML
        CSSMessage = defaultCode.CSS
        JSMessage = defaultCode.JavaScript
      }
      commit('updateCodeAreaMessage', {
        mode: 'HTML',
        message: HTMLMessage
      })
      commit('updateCodeAreaMessage', {
        mode: 'CSS',
        message: CSSMessage
      })
      commit('updateCodeAreaMessage', {
        mode: 'JavaScript',
        message: JSMessage
      })
    },
    getConsoleInfo() {
      return new iframeConsole().getConsoleInfo()
    },
    cleanConsoleInfo() {
      new iframeConsole().setConsoleInfo([])
      this.$store.commit('updateConsoleInfo', [])
    },
    fullScreen() {
      // 将iframe全屏显示
      this.showIframe = true
      this.iframeFullScreen = true
    },
    exitFullScreen() {
      // 退出全屏
      this.showIframe = false
      this.iframeFullScreen = false
      const iframe = this.$refs.iframeBox
      iframe.contentWindow.document.body.style.transformOrigin = ''
      this.iframeScale = 100
      this.judgeIframeShows(this.currentTab)
    },
    runWithFullScreen() {
      // 由于重载iframe会导致放大缩小比例回到100%，所以需要重新设置
      this.runCode(500).then(() => {
        this.$refs.iframeBox.onload = () => {
          this.changeIframeProportion(this.iframeScale)
        }
      })
    },
    changeIframeProportion(newP) {
      // 改变iframe显示比例
      const iframe = this.$refs.iframeBox
      const bodyStyle = iframe.contentWindow.document.body.style
      newP /= 100
      !bodyStyle.transformOrigin && (bodyStyle.transformOrigin = 'top left')
      bodyStyle.transform = `scale(${newP})`
    },
    initSyncScroll() {
      const iframe = this.$refs.iframeBox
      const el = this.getCodeEditor()
      const cm = this.getCodeMirror()
      const docWindow = iframe.contentWindow
      const { documentElement: docEle, body: docBody } = docWindow.document
      new SyncScroll({ el, cm }, { docEle, docBody, docWindow })
    },
    getCodeEditor() {
      return this.$refs.codeArea0[0].getCodeEditor()
    },
    getCodeMirror() {
      return this.$refs.codeArea0[0].getCodeMirror()
    },
    getIframeBody() {
      return this.$refs.iframeBox
    }
  },
  components: {
    Tabs,
    Console,
    CodeArea,
    MarkdownTools
  }
}
</script>
<style lang="scss" src="./componentStyle/mainbody.scss" scoped></style>
<style lang="scss" scoped>
.el-dropdown-menu {
  position: absolute;
  transform: translateX(-35%);
  transform-origin: top right;
  width: 150px;
  background-color: $primaryHued;
  border: none;
  color: $describe;
  overflow: hidden;
  font-size: 14px;
  outline: none;
  & >>> .el-dropdown-menu__item {
    outline: none;
    @include setTransition(all, 0.3s, ease);
    i {
      font-size: 18px;
      @include setTransition(all, 0.3s, ease);
    }
    &:hover {
      background-color: $deepColor;
      color: $afterFocus;
      i {
        color: $afterFocus;
      }
    }
  }
}
@keyframes shining {
  0%,
  100% {
    color: #ae81ff;
  }
  50% {
    color: $afterFocus;
  }
}
@keyframes rotate {
  0% {
    transform: (0);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
#mainbody {
  @include setWAndH(calc(100% - 50px), 100%);
  .tabs-list {
    width: 100%;
    height: 30px;
    background-color: $primaryHued;
    position: relative;
    .tabs {
      background-color: $dominantHue;
    }
    .tabs-commands {
      position: absolute;
      right: 0;
      @include setWAndH(auto, 100%);
      text-align: right;
      div {
        @include setWAndH(50px, 100%);
        @include setTransition(all, 0.3s, ease);
        color: $beforeFocus;
        display: inline-flex;
        text-align: center;
        cursor: pointer;
        i {
          font-size: 25px;
        }
        .icon-gengduo2 {
          font-size: 22px;
        }
        &:hover {
          background-color: $dominantHue;
          color: $afterFocus;
        }
      }
      .menu {
        position: relative;
        i:focus {
          outline: none !important;
        }
      }
      .user {
        position: relative;
        .avatar {
          position: absolute;
          @include setWAndH(20px, 20px);
          left: 50%;
          top: 50%;
          transform: translate(-50%, -55%);
          border-radius: 50%;
          overflow: hidden;
        }
      }
      .save {
        @include setWAndH(100px, 30px);
        display: inline-flex;
        color: #ae81ff;
        box-sizing: border-box;
        animation: shining 4s ease infinite;
        i {
          font-size: 22px;
          margin-right: 5px;
          @include setTransition(transform, 0.3s, ease);
          transform: rotate(0);
        }
        .load {
          animation: rotate 3s ease infinite;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .code-area-box {
    @include setWAndH(100%, calc(100% - 180px));
    .resize {
      @include setWAndH(4px, 100%);
      border: 2px solid $primaryHued;
      box-sizing: border-box;
      cursor: w-resize;
      @include setTransition(all, 0.3s, ease);
      &:hover {
        border: 2px dashed #ae81ff;
      }
    }
    .iframe-box {
      background-color: #ffffff;
      position: relative;
      overflow: hidden;
      transform-origin: top right;
      .iframe-screen {
        @include setWAndH(100%, 100%);
        position: absolute;
        z-index: 5;
      }
      .iframe-size-height,
      .iframe-size-width {
        @include setTransition(all, 0.3s, ease);
        position: absolute;
        box-sizing: border-box;
        padding: 5px;
        left: 0;
        bottom: 0;
        background-color: $primaryHued;
        color: $afterFocus;
      }
      .iframe-opt {
        @include setWAndH(100%, 30px);
        position: relative;
        background-color: $primaryHued;
        .opt-list {
          position: absolute;
          right: 0;
          .opt {
            @include setWAndH(50px, 30px);
            color: $beforeFocus;
            @include setTransition(all, 0.3s, ease);
            cursor: pointer;
            &:hover {
              background-color: $dominantHue;
              color: $afterFocus;
            }
            i {
              font-size: 22px;
            }
            .icon-zhihang {
              font-size: 24px;
            }
          }
        }
        .scale-box {
          @include setWAndH(300px, 100%);
          color: $afterFocus;
          .proportion {
            margin-right: 10px;
          }
          .el-slider {
            @include setWAndH(200px, 125%);
          }
        }
      }
      iframe {
        @include setWAndH(100%, 100%);
      }
    }
    @include keyframes(big) {
      from {
        transform: scale(0.5);
        border-radius: 50%;
        opacity: 0;
      }
      to {
        transform: scale(1);
        border-radius: 0;
        opacity: 1;
      }
    }
    .full-screen {
      opacity: 0;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2000;
      width: 100% !important;
      height: 100% !important;
      transform-origin: top right;
      border-radius: 50%;
      @include animation(big, 0.5s, ease, 0.3s, forwards);
    }
  }
  .code-area-box-full {
    height: calc(100% - 30px) !important;
  }
  .iframe-box-full {
    height: 100% !important;
  }
  .console-box {
    @include setWAndH(100%, 150px);
  }
}
</style>