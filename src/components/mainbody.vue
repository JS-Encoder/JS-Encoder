<template>
  <div id="mainbody" class="flex flex-clo">
    <div class="tabs-list flex">
      <div class="tabs flex">
        <Tabs :key="index" :tabInfo="item" v-for="(item, index) in tabsInfo"></Tabs>
      </div>
      <div class="tabs-commands flex">
        <div @click="saveProject" v-show="showSaveBtn" class="save flex-ai flex-jcc" title="Save">
          <i class="icon iconfont icon-gengxin1"></i>
          <span>{{langSave}}</span>
        </div>
        <div v-for="(item, index) in tabsCommands" :key="index" :title="tabsLang[index]" class="flex-ai flex-jcc"
          @click="judgeTabsCommands(item.name)">
          <i class="icon iconfont" :class="item.class"></i>
        </div>
        <div class="user flex-ai flex-jcc" title="User" @click="showUserMenu">
          <i v-if="!avatar" class="icon iconfont icon-user"></i>
          <img class="avatar" v-if="avatar" :src="avatar" alt="">
        </div>
      </div>
    </div>
    <div class="code-area-box flex" ref="codeArea" :style="{ height: codeAreaHeight+'px'}">
      <CodeArea v-for="(item, index) in preprocess" :key="index" :codeMode="item" :style="{width: codeAreaWidth+'px'}"
        v-show="item === currentTab" :showCodeArea="item === currentTab" :index="index" @runCode="runCode"></CodeArea>
      <div v-if="showResize" class="resize" @mousedown="boxMouseDown"></div>
      <div v-show="showIframe" class="iframe-box" :style="{ height: codeAreaHeight+'px', width: iframeWidth+'px'}">
        <div class="iframe-screen" v-show="iframeScreen"></div>
        <div class="iframe-size-height" v-show="showIframeHeight">{{codeAreaHeight+'px'}}</div>
        <div class="iframe-size-width" v-show="showIframeWidth">{{iframeWidth+'px'}}</div>
        <iframe
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media"
          frameborder="0" id="iframe" name="iframe" ref="iframeBox"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
          scrolling="yes" src="static/html/runner.html"></iframe>
      </div>
    </div>
    <div class="console-box" :style="{ height: consoleSize + 'px' }">
      <Console></Console>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tabs from './tabs.vue'
import Console from './console.vue'
import CodeArea from './codeArea.vue'
import handleIframe from '@/utils/handleIframe'
import getCompiledCode from '@/utils/getCompiledCode'
import reqUserInfo from '@/utils/requestUserInfo'
import iframeConsole from '@/utils/console'
import handleShortcut from '@/utils/handleShortcut'
import handleIframeImage from '@/utils/handleIframeImage'
import handleCookie from '@/utils/handleCookie'
export default {
  data() {
    return {
      tabsCommands: [
        {
          name: 'run',
          class: 'icon-zhihang'
        },
        {
          name: 'reset',
          class: 'icon-zhongzhi'
        }
      ],
      consoleInfo: [],
      init: false,
      showResize: true,
      isSmallScreen: false,
      showIframe: true
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
    const codeAreaH = document.body.clientHeight - 180
    this.updateDisplay(this.clientWidth)
    commit('updateCodeAreaHeight', codeAreaH)
    new iframeConsole(this.$refs.iframeBox)
    new handleShortcut().init()
    this.runCode().then(consoleInfo => {
      this.consoleInfo = consoleInfo
      this.init = true
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
      if (preprocess[0] === 'MarkDown') iconHTML = 'icon-markdown'
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
    avatar() {
      return this.$store.state.userInfo.avatarUrl
    }
  },
  watch: {
    consoleInfo(newInfo) {
      this.$store.commit('updateConsoleInfo', newInfo)
    },
    currentTab(newTab) {
      this.judgeIframeShows(newTab)
    },
    clientWidth(newWidth) {
      this.updateDisplay(newWidth)
    }
  },
  methods: {
    updateDisplay(clientWidth) {
      clientWidth = clientWidth ? clientWidth : document.body.clientWidth
      const commit = this.$store.commit
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
        iframeWidth = (clientWidth - 50 - 4) / 2
        if (this.currentTab === 'Output') {
          commit('updateCurrentTab', this.preprocess[0])
        }
      }
      this.judgeIframeShows(this.currentTab)
      commit('updateIframeWidth', iframeWidth)
      commit('updateCodeAreaWidth', iframeWidth)
    },
    judgeIframeShows(newTab) {
      if (this.isSmallScreen) {
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
      iframeBody.style.width = '1200px'
      iframeBody.style.height = '666px'
      // 截图
      handleIframeImage.getIframeImage(iframeBody, async dataURL => {
        let imgUrl = ''
        iframeBody.style.width = ''
        iframeBody.style.height = ''
        if (this.isSmallScreen) commit('updateCurrentTab', currentTab)
        // 获取七牛云token
        let token = handleCookie.getCookieValue('qnyToken')
        if (!token) {
          await handleIframeImage.getToken().then(res => {
            token = res
          })
          handleCookie.setCookie('qnyToken', token, 1 / 24)
        }
        // 获取七牛云返回的图片链接
        await handleIframeImage
          .sendImageToQiNiuYun(dataURL, token)
          .then(res => {
            if (res.error) {
              // 弹出错误提示
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
        // 将图片链接连带项目更新至数据库
        await reqUserInfo
          .updateProjectDetail({
            poster: imgUrl,
            id: this.projectId,
            name: this.projectName,
            prep: this.preprocess,
            content: this.codeAreaContent,
            CDNList: this.CDNList,
            linkList: this.linkList
          })
          .then(res => {
            // 弹出提示消息
            this.$notify({
              message: language ? '项目已保存' : 'Project saved',
              position: 'bottom-right',
              duration: 1500
            })
            // 删除旧封面
            handleIframeImage.deleteOldPoster(this.posterKey).then(res => {
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
          document.onmousemove = null
          commit('updateIframeScreen', false)
          commit('updateShowIframeWidth', false)
        }
      }
    },
    judgeTabsCommands(cmdName) {
      switch (cmdName) {
        case 'run':
          this.runCode(500)
          break
        case 'reset':
          this.resetCode()
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
      let link = state.linkList
      let cdn = state.CDNList
      // 传入waitTime参数代表立即显示效果(仍然有500ms延迟)，否则按照设置的时间延迟显示效果
      waitTime = waitTime ? waitTime : codeOptions.waitTime
      // 重新引入iframe，之前的js代码不会因为删除了原本的js代码而消失，必须重新引入
      // 第一次执行代码时不需要重新载入iframe
      if (this.init) await handleIframe.refresh(iframe)
      iframe.onload = () => {
        new iframeConsole().refreshConsole(iframe)
        if (!codeOptions.showHistoryLog) this.cleanConsoleInfo()
      }
      // 获取已经编译成为html、css、js的代码。判断是否使用预处理语言，如果使用，将预处理语言编译完成后返回，否则直接返回
      let finCode
      await getCompiledCode(codeAreaContent, preprocessor).then(code => {
        finCode = code
      })
      // 如果html预处理为markdown，不引入外部css和js
      if (preprocessor[0] === 'MarkDown') {
        link = ['../css/github-markdown.css']
        cdn = []
      }
      // 重新加载iframe会有延迟，不加定时器会导致写入到iframe的代码消失
      await setTimeout(() => {
        handleIframe.sendCodeToIframe(iframe, finCode, link, cdn)
      }, waitTime)
      return this.getConsoleInfo()
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
    }
  },
  components: {
    Tabs,
    Console,
    CodeArea
  }
}
</script>
<style lang="scss" src="./componentStyle/mainbody.scss" scoped></style>
<style lang="scss" scoped>
@keyframes shining {
  0%,
  100% {
    color: #ae81ff;
  }
  50% {
    color: $afterFocus;
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
        display: inline-block;
        text-align: center;
        cursor: pointer;
        i {
          font-size: 25px;
        }
        &:hover {
          background-color: $dominantHue;
          color: $afterFocus;
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
      iframe {
        @include setWAndH(100%, 100%);
      }
    }
  }
  .console-box {
    @include setWAndH(100%, 150px);
  }
}
</style>