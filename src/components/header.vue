<template>
  <div class="flex flex-ai" id="header">
    <div @click="sliderConf.isShow = true" class="slider-menu">
      <i class="icon iconfont icon-menu"></i>
    </div>
    <span class="header-title noselect flex">
      <img alt="" class="logo" src="../assets/logo.svg">
    </span>
    <ul class="header-menu flex">
      <li @click="upload.isShow = true">
        <i class="icon iconfont icon-feiji" style="font-size:20px"></i>
      </li>
      <li @click="download.isShow = true">
        <i class="icon iconfont icon-baocun" style="font-size:23px"></i>
      </li>
      <li @click="config.isShow = true">
        <i class="icon iconfont icon-config"></i>
      </li>
      <li @click="help.isShow = true">
        <i class="icon iconfont icon-help"></i>
      </li>
      <li @click.stop="showAccount">
        <i class="icon iconfont icon-weidenglutouxiang" id="account" style="font-size:23px"></i>
      </li>
    </ul>
    <slider :sliderConf="sliderConf" @triggerOpt="triggerOpt" class="noselect"></slider>
    <!-- login -->
    <accountMenu v-show="accountInfo.isShow" @openLogin="openLogin"></accountMenu>
    <!-- menu -->
    <popUp :pop="upload" class="noselect upload-pop">
      <div class="upload">
        <div class="upload-content">
          <h4 class="title">Upload</h4>
          <span
            class="describe"
          >Upload Local File, the format contains html, css, js, md, sass, scss, less, styl, ts and coffee. The file content overwrites the editor content.</span>
          <div class="flex flex-ai upload-box">
            <a @change="chooseFile" class="upload-input" href="javascript:;">
              <input id="" multiple="multiple" name="" ref="fileInput" type="file">choose
            </a>
            <button @click="uploadFile" class="upload-btn">
              <i class="icon iconfont icon-shangchuan"></i>upload
            </button>
          </div>
          <div class="choose" v-if="chooseFiles.length > 0">
            <span class="describe">The file you selected</span>
            <span class="describe" style="color: orange">Show only files that format is right</span>
            <ul>
              <li :key="index" v-for="(item, index) in chooseFiles">
                {{item.name}}
                <i @click="delFile(index)" class="icon iconfont icon-error"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </popUp>
    <popUp :pop="download" class="noselect download-pop">
      <div class="download-box flex flex-ai flex-jcc">
        <div class="file-download flex flex-clo flex-ai">
          <i class="icon iconfont icon-flie" style="font-size:40px;color:#333333"></i>
          <span>Single file download</span>
          <span class="describe">Combine HTML, CSS, JS into one file</span>
          <el-checkbox v-model="download.single.uncompiled">Download uncompiled files</el-checkbox>
          <button @click="singleDownload">
            <i class="icon iconfont icon-xiazai"></i>download
          </button>
        </div>
        <div class="files-download flex flex-clo flex-ai">
          <i class="icon iconfont icon-youxidefuben" style="font-size:40px;color:#333333"></i>
          <span>Multi-file download</span>
          <span class="describe">Separate HTML, CSS, JS into multiple files and put them in a folder</span>
          <el-checkbox v-model="download.zip.uncompiled">Download uncompiled files</el-checkbox>
          <button @click="zipDownLoad">
            <i class="icon iconfont icon-xiazai"></i>download
          </button>
        </div>
      </div>
    </popUp>
    <popUp :pop="config" class="noselect">
      <div class="config-box">
        <div class="run-time">
          <h4 class="title">Waiting time</h4>
          <span class="describe">After you finish the code,we will wait for some time to execute it</span>
          <el-input-number :min="200" :step="50" size="small" v-model="waitTime"></el-input-number>(ms)
        </div>
        <div class="line"></div>
        <div class="another-cfg">
          <el-checkbox v-model="replace">Replace Spaces equal to TAB width with TAB</el-checkbox>
        </div>
        <div class="line"></div>
        <div class="another-cfg">
          <el-checkbox v-model="autoUp">Auto-Updating</el-checkbox>
          <div
            class="describe"
          >Turning on autoexecute automatically updates the view, and turning this option off requires that the view be updated when the RUN button is clicked</div>
        </div>
        <div class="line"></div>
        <div class="add-cdn">
          <h4 class="title">Add external scripts</h4>
          <div
            class="describe"
          >The links added here are all run in order before running JavaScript, links that support the HTTP or HTTPS protocols</div>
          <el-select
            :loading="loading"
            :remote-method="remoteCDN"
            @change="addSearchCDN"
            class="search-url"
            filterable
            loading-text="loading"
            placeholder="search CDNs"
            remote
            size="small"
            v-model="chooseCDN"
          >
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in jsOptions"
            ></el-option>
          </el-select>
          <div :key="index" class="cdn-in flex flex-ai" v-for="(item, index) in showCdnInput">
            <el-input placeholder="your CDN" size="small" v-model="cdnJs[index]"></el-input>
            <i @click="delCDN(index)" class="icon iconfont icon-Clear"></i>
          </div>
          <div @click="showCdnInput++" class="add-link flex flex-ai flex-jcc">+ Add more links</div>
        </div>
        <div class="line"></div>
        <div class="add-css">
          <h4 class="title">Add external styles</h4>
          <div
            class="describe"
          >The links added here are all run in order before running CSS, links that support the HTTP or HTTPS protocols</div>
          <el-select
            :loading="loading"
            :remote-method="remoteLink"
            @change="addSearchLink"
            class="search-url"
            filterable
            loading-text="loading"
            placeholder="search links"
            remote
            size="small"
            v-model="chooseLink"
          >
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in cssOptions"
            ></el-option>
          </el-select>
          <div :key="index" class="css-in flex flex-ai" v-for="(item, index) in showCssInput">
            <el-input placeholder="your CSS link" size="small" v-model="cssLinks[index]"></el-input>
            <i @click="delCssLink(index)" class="icon iconfont icon-Clear"></i>
          </div>
          <div @click="showCssInput++" class="add-link flex flex-ai flex-jcc">+ Add more links</div>
        </div>
        <div class="line"></div>
        <div class="preprocessor">
          <h4 class="title">Preprocessor setup</h4>
          <div :key="index" class="prep-box" v-for="(item, index) in prep">
            <span class="prep-title">{{item.title}}：</span>
            <el-select
              @change="prepChange(index)"
              placeholder="none"
              size="mini"
              v-model="item.value"
            >
              <el-option :key="index" :label="i" :value="i" v-for="(i, index) in item.options"></el-option>
            </el-select>
          </div>
        </div>
      </div>
    </popUp>
    <popUp :pop="help" class="help noselect">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item name="1" title="Shortcut Key">
          <div :key="index" class="flex flex-ai key-box" v-for="(item, index) in shortcut">
            <div :key="index" v-for="(key, index) in item.keyboard">
              <kbd>{{key}}</kbd>
              <span v-if="index < item.keyboard.length - 1">+</span>
            </div>
            <span class="explain">{{item.explain}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" title="Feedback">
          <div>
            If you find bugs, you can give feedback on github
            <a
              href="https://github.com/Longgererer/Compiler-ol/issues"
              target="black"
            >issues</a>
          </div>
        </el-collapse-item>
      </el-collapse>
    </popUp>
    <!-- slider -->
    <popUp :pop="colorTable" class="noselect color-table">
      <div class="color flex flex-clo">
        <h4 class="title">Color format switch</h4>
        <span class="describe">RGB and HEX convert to each other</span>
        <div class="color-info">
          <div class="rgb-info flex flex-ai">R:
            <el-input class="rgb-input" size="mini" type="text" v-model="rgbInfo.r"/>G:
            <el-input class="rgb-input" size="mini" type="text" v-model="rgbInfo.g"/>B:
            <el-input class="rgb-input" size="mini" type="text" v-model="rgbInfo.b"/>
            <div @click="switchHEX" class="color-switch flex flex-ai">
              <i class="icon iconfont icon-zhuanhua_huaban"></i>
            </div>
          </div>
          <div class="hex-info flex flex-ai">HEX:
            <el-input class="hex-input" size="mini" type="text" v-model="hexInfo"/>
            <div @click="switchRGB" class="color-switch flex flex-ai">
              <i class="icon iconfont icon-zhuanhua_huaban"></i>
            </div>
          </div>
        </div>
        <div class="line"></div>
        <h4 class="title">Color table</h4>
        <span class="describe">Click to copy the HEX color to the clipboard</span>
        <div class="color-table-content flex flex-ai">
          <ul class="table">
            <li :key="index" class="row flex" v-for="(item, index) in colorInfo">
              <span
                :key="i"
                :style="{backgroundColor: it}"
                @click="copyHex(it)"
                class="clo flex-1"
                v-for="(it, i) in item"
              ></span>
            </li>
          </ul>
        </div>
      </div>
    </popUp>
    <popUp :pop="icons" class="noselect">
      <h4 class="title">Icons</h4>
      <a href="https://www.iconfont.cn/" target="black">more icons👉</a>
    </popUp>
    <popUp :pop="fonts" class="noselect">
      <h4 class="title">Fonts</h4>
      <a href="http://www.googlefonts.net/english" target="black">more fonts👉</a>
    </popUp>
    <popUp :pop="newFeature" class="noselect">
      <h4 class="title">New feature</h4>
      <span>new shortcut: press "Ctrl + Space" to format code</span>
    </popUp>
    <popUp :pop="login" class="noselect login flex">
      <h2 class="title flex flex-jcc">Log in</h2>
      <div class="login-content flex flex-ai flex-clo">
        <el-button @click="loginWithGitHub" size="small" type="primary">
          <span class="btn-txt">
            <i class="icon iconfont icon-git"></i>
            Log In With GitHub
          </span>
        </el-button>
      </div>
    </popUp>
  </div>
</template>
<script>
import JSZip from 'jszip'
import popUp from './popUp'
import slider from './slider'
import accountMenu from './accountMenu'
import { saveAs } from 'file-saver'
import colorInfo from '@/utils/colorInfo'
import keyboardList from '@/utils/shortcut'
import { CDN, Link } from '@/utils/selectableUrl'
import * as downloadFiles from '@/utils/downloadFiles'
import * as judge from '@/utils/judgeMode'
import * as switcher from '@/utils/switchColorFormat'
import * as uploader from '@/utils/uploadFile'
import { post, get } from '@/utils/request'
export default {
  data() {
    return {
      sliderConf: {
        isShow: false,
        event: 'triggerOpt',
        options: [
          {
            title: 'color table',
            icon: 'icon iconfont icon-tiaosepan_shixin'
          },
          {
            title: 'icons',
            icon: 'icon iconfont icon-Starlarge'
          },
          {
            title: 'fonts',
            icon: 'icon iconfont icon-font'
          },
          {
            title: 'new feature',
            icon: 'icon iconfont icon-yanjing'
          },
          {
            title: 'github',
            icon: 'icon iconfont icon-git'
          }
        ]
      },
      colorTable: {
        isShow: false
      },
      icons: {
        isShow: false
      },
      fonts: {
        isShow: false
      },
      download: {
        isShow: false,
        single: {
          uncompiled: false
        },
        zip: {
          uncompiled: false
        }
      },
      newFeature: {
        isShow: false
      },
      upload: {
        isShow: false
      },
      help: {
        isShow: false
      },
      config: {
        isShow: false
      },
      login: {
        isShow: false
      },
      rgbInfo: {
        r: '',
        g: '',
        b: ''
      },
      hexInfo: '',
      chooseFiles: [],
      prep: {
        HTMLPrep: {
          title: 'HTML',
          value: 'HTML',
          options: ['HTML', 'MarkDown']
        },
        CSSPrep: {
          title: 'CSS',
          value: 'CSS',
          options: ['CSS', 'Sass', 'Scss', 'Less', 'Stylus']
        },
        JSPrep: {
          title: 'JavaScript',
          value: 'JavaScript',
          options: ['JavaScript', 'TypeScript', 'CoffeeScript']
        }
      },
      cdnJs: [],
      cssLinks: [],
      showCdnInput: 1,
      showCssInput: 1,
      activeName: '',
      waitTime: 500,
      replace: true,
      autoUp: true,
      loading: false,
      cssOptions: [],
      jsOptions: [],
      cssUrlList: [],
      jsUrlList: [],
      chooseCDN: '',
      chooseLink: ''
    }
  },
  components: {
    popUp,
    slider,
    accountMenu
  },
  computed: {
    accountInfo() {
      return this.$store.state.accountInfo
    },
    cdn() {
      const arr = []
      for (let i in CDN) {
        arr.push(i.replace('_', '-'))
      }
      return arr
    },
    link() {
      const arr = []
      for (let i in Link) {
        arr.push(i.replace('_', '-'))
      }
      return arr
    },
    showConfig() {
      return this.config.isShow
    },
    limitType() {
      return uploader.limitType
    },
    shortcut() {
      return keyboardList
    },
    colorInfo() {
      return colorInfo
    }
  },
  watch: {
    showConfig(newVal) {
      if (!newVal) {
        const store = this.$store
        store.commit('updateTime', this.waitTime)
        store.commit('updateReplace', this.replace)
        store.commit('updateAutoUp', this.autoUp)
        store.commit('updateCDN', this.cdnJs)
        store.commit('updateCssLinks', this.cssLinks)
      }
    }
  },
  mounted() {
    this.cssUrlList = this.link.map(item => {
      return { value: item, label: item }
    })
    this.jsUrlList = this.cdn.map(item => {
      return { value: item, label: item }
    })
  },
  methods: {
    async loginWithGitHub() {
      const clientInfo = await require('@/info/clientInfo.json')
      get('https://github.com/login/oauth/authorize', {
        client_id: clientInfo.clientID,
        scope: 'user,public_repo'
      })
        .then(res => {
          this.login.isShow = false
          console.log(res)
        })
        .catch(err => {
          this.$message({
            message: 'Connect Github Failed',
            type: 'error',
            center: true
          })
        })
    },
    openLogin() {
      this.login.isShow = true
    },
    showAccount() {
      const commit = this.$store.commit
      commit('updateAccountInfo', {
        attr: 'isShow',
        value: true
      })
      commit('updateScreen', true)
    },
    remoteCDN(query) {
      this.remoteMethod(query, 'jsOptions', this.jsUrlList)
    },
    remoteLink(query) {
      this.remoteMethod(query, 'cssOptions', this.cssUrlList)
    },
    remoteMethod(query, options, list) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this[options] = list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this[options] = []
      }
    },
    addSearchLink() {
      const link = Link[this.chooseLink.replace('-', '_')]
      const cssLinks = this.cssLinks
      const index = this.checkInputContent(cssLinks)
      if (index !== null) {
        cssLinks[index] = link
      } else {
        cssLinks.push(link)
        this.showCssInput++
      }
    },
    addSearchCDN() {
      const cdn = CDN[this.chooseCDN.replace('-', '_')]
      const cdnJs = this.cdnJs
      const index = this.checkInputContent(cdnJs)
      if (index !== null) {
        cdnJs[index] = cdn
      } else {
        cdnJs.push(cdn)
        this.showCdnInput++
      }
    },
    checkInputContent(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '') return i
      }
      return null
    },
    triggerOpt(title) {
      if (title === 'github') {
        window.open('https://github.com/Longgererer/JS-Encoder', '_blank')
        return
      }
      this[title].isShow = true
    },
    chooseFile() {
      const input = this.$refs.fileInput
      const files = input.files
      const limitType = this.limitType
      for (let i = 0; i < files.length; i++) {
        const name = this.getMimeType(files[i].name)
        if (limitType.includes(name)) {
          this.chooseFiles.push(files[i])
        }
      }
    },
    async uploadFile() {
      const files = this.chooseFiles
      if (!files.length) return
      for (let i = 0; i < files.length; i++) {
        let fileString, mimeType
        await uploader.readFile(files[i]).then(res => {
          if (this.getMimeType(files[i].name) === 'html') {
            for (let item in res) {
              let content = res[item].content
              const type = res[item].type
              if (type === 'css') {
                this.$store.commit('updateCssLinks', content.link)
                this.cssLinks = content.link
                if (content.link.length) this.showCssInput = content.link.length
                content = content.finCode
              } else if (type === 'js') {
                this.$store.commit('updateCDN', content.CDN)
                this.cdnJs = content.CDN
                if (content.CDN.length) this.showCdnInput = content.CDN.length
                content = content.finCode
              }
              this.updateEditorContent(content, type)
            }
            return
          }
          fileString = res.content
          mimeType = res.type
        })
        this.updateEditorContent(fileString, mimeType)
      }
    },
    getMimeType(fileName) {
      const pos = fileName.lastIndexOf('.')
      return fileName.substring(pos + 1)
    },
    delFile(index) {
      this.chooseFiles.splice(index, 1)
    },
    updateEditorContent(content, type) {
      type = judge.judgeExtension(type)
      this.$store.commit('change', {
        [type]: content
      })
    },
    singleDownload() {
      downloadFiles.singleDownLoad(
        this.$store.state,
        this.download.single.uncompiled
      )
      this.download.isShow = false
    },
    zipDownLoad() {
      downloadFiles.zipDownLoad(this.$store.state, this.download.zip.uncompiled)
      this.download.isShow = false
    },
    delCDN(index) {
      if (this.showCdnInput > 1) this.showCdnInput--
      this.cdnJs.splice(index, 1)
    },
    delCssLink(index) {
      if (this.showCssInput > 1) this.showCssInput--
      this.cssLinks.splice(index, 1)
    },
    prepChange(obj) {
      const value = this.prep[obj].value
      this.$store.commit('updateStateAttr', { attr: obj, value })
    },
    switchRGB() {
      const rgb = switcher.switchRGB(this.hexInfo)
      if (rgb) this.rgbInfo = rgb
    },
    switchHEX() {
      const hex = switcher.switchHEX(this.rgbInfo)
      if (hex) this.hexInfo = hex
    },
    copyHex(hex) {
      const input = document.createElement('input')
      input.value = hex
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$message({
        message: 'Copy success!',
        center: true,
        duration: 1000,
        iconClass: 'icon iconfont icon-success',
        customClass: 'message'
      })
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/header.scss" scoped></style>
