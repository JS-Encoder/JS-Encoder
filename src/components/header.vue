<template>
  <div class="flex flex-ai" id="header">
    <div @click="showSlider" class="slider-menu">
      <i class="icon iconfont icon-menu"></i>
    </div>
    <span class="header-title noselect flex">
      <img alt class="logo" src="../assets/logo.svg" />
    </span>
    <ul class="header-menu flex">
      <li @click="openUpload">
        <i class="icon iconfont icon-feiji" style="font-size:20px"></i>
      </li>
      <li @click="openDownload">
        <i class="icon iconfont icon-baocun" style="font-size:23px"></i>
      </li>
      <li @click="openConfig">
        <i class="icon iconfont icon-config"></i>
      </li>
      <li @click="openHelp">
        <i class="icon iconfont icon-help"></i>
      </li>
    </ul>
    <slider :sliderConf="sliderConf" @triggerOpt="triggerOpt" class="noselect"></slider>
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
              <input id multiple="multiple" name ref="fileInput" type="file" />choose
            </a>
            <button @click="uploadFile" class="upload-btn">
              <i class="icon iconfont icon-shangchuan"></i> upload
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
          <button @click="singleDownload">
            <i class="icon iconfont icon-xiazai"></i>download
          </button>
        </div>
        <div class="files-download flex flex-clo flex-ai">
          <i class="icon iconfont icon-youxidefuben" style="font-size:40px;color:#333333"></i>
          <span>Multi-file download</span>
          <span class="describe">Separate HTML, CSS, JS into multiple files and put them in a folder</span>
          <button @click="filesDownload">
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
          <div :key="index" class="cdn-in flex flex-ai" v-for="(item, index) in showCdnInput">
            <el-input placeholder="your CDN" size="small" v-model="cdnJs[index]"></el-input>
            <i @click="delCDN(index)" class="icon iconfont icon-Clear"></i>
          </div>
          <div @click="addCDN" class="add-link flex flex-ai flex-jcc">+ Add more links</div>
        </div>
        <div class="line"></div>
        <div class="add-css">
          <h4 class="title">Add external styles</h4>
          <div
            class="describe"
          >The links added here are all run in order before running CSS, links that support the HTTP or HTTPS protocols</div>
          <div :key="index" class="css-in flex flex-ai" v-for="(item, index) in showCssInput">
            <el-input placeholder="your CSS link" size="small" v-model="cssLinks[index]"></el-input>
            <i @click="delCssLink(index)" class="icon iconfont icon-Clear"></i>
          </div>
          <div @click="addCssLink" class="add-link flex flex-ai flex-jcc">+ Add more links</div>
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
    <popUp :pop="help" class="noselect">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item name="1" title="Shortcut Key">
          <div>TAB ------------------------------- Indent code</div>
          <div>Ctrl + Space -------------------------- Format code</div>
          <div>CTRL + ALT ---------------------------- Trun on smart tips</div>
          <div>CTRL + Q ---------------------------- Fold the code</div>
          <div>CTRL + / ---------------- Toggle comment on selected lines</div>
          <div>CTRL + SHIFT + D ---------------- Duplicate line</div>
          <div>CTRL + D ---------------- Select the current row</div>
          <div>Shift + Ctrl + Up ---------------- Swap line up</div>
          <div>Shift + Ctrl+ Down ---------------- Swap line down</div>
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
          <div class="rgb-info flex flex-ai">
            R:
            <el-input class="rgb-input" size="mini" type="text" v-model="rgbInfo.r" />G:
            <el-input class="rgb-input" size="mini" type="text" v-model="rgbInfo.g" />B:
            <el-input class="rgb-input" size="mini" type="text" v-model="rgbInfo.b" />
            <div @click="switchHEX" class="color-switch flex flex-ai">
              <i class="icon iconfont icon-zhuanhua_huaban"></i>
            </div>
          </div>
          <div class="hex-info flex flex-ai">
            HEX:
            <el-input class="hex-input" size="mini" type="text" v-model="hexInfo" />
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
  </div>
</template>
<script>
import popUp from './popUp'
import slider from './slider'
import { saveAs } from 'file-saver'
import colorInfo from '../utils/colorInfo'
import * as downloadFiles from '../utils/downloadFiles'
const JSZip = require('jszip')
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
        isShow: false
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
      limiteType: [
        'html',
        'css',
        'js',
        'md',
        'sass',
        'scss',
        'less',
        'styl',
        'ts',
        'coffee'
      ]
    }
  },
  components: {
    popUp,
    slider
  },
  computed: {
    showConfig() {
      return this.config.isShow
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
  methods: {
    showSlider() {
      this.sliderConf.isShow = true
    },
    triggerOpt(title) {
      if (title === 'github') {
        window.open('https://github.com/Longgererer/JS-Encoder', '_blank')
        return
      }
      this[title].isShow = true
    },
    openConfig() {
      this.config.isShow = true
    },
    openHelp() {
      this.help.isShow = true
    },
    openDownload() {
      this.download.isShow = true
    },
    openUpload() {
      this.upload.isShow = true
    },
    chooseFile() {
      const input = this.$refs.fileInput
      const files = input.files
      const limiteType = this.limiteType
      for (let i = 0; i < files.length; i++) {
        const name = this.getMimeType(files[i].name)
        if (limiteType.includes(name)) {
          this.chooseFiles.push(files[i])
        }
      }
    },
    uploadFile() {
      const files = this.chooseFiles
      if (!files.length) return
      const limiteType = this.limiteType
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader()
        reader.readAsText(files[i], 'UTF-8')
        reader.onload = e => {
          const fileString = e.target.result
          this.updateEditorContent(fileString, this.getMimeType(files[i].name))
        }
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
      switch (type) {
        case 'html':
        case 'md':
          type = 'HTML'
          break
        case 'css':
        case 'sass':
        case 'scss':
        case 'less':
        case 'styl':
          type = 'CSS'
          break
        case 'js':
        case 'ts':
        case 'coffee':
          type = 'JavaScript'
          break
      }
      this.$store.commit('change', {
        [type]: content
      })
    },
    singleDownload() {
      downloadFiles.singleDownLoad(this.$store.state)
      this.download.isShow = false
    },
    filesDownload() {
      downloadFiles.zipDownLoad(this.$store.state)
      this.download.isShow = false
    },
    addCDN() {
      this.showCdnInput++
    },
    delCDN(index) {
      if (this.showCdnInput > 1) this.showCdnInput--
      this.cdnJs.splice(index, 1)
    },
    addCssLink() {
      this.showCssInput++
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
      if (!this.hexInfo) return
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
        this.hexInfo
      )
      if (result) {
        this.rgbInfo = {
          r: parseInt(result[1], 16) + '',
          g: parseInt(result[2], 16) + '',
          b: parseInt(result[3], 16) + ''
        }
      } else {
        return null
      }
    },
    switchHEX() {
      const rgb = this.rgbInfo
      if (!(rgb.r && rgb.g && rgb.b)) return
      const r = parseInt(rgb.r)
      const g = parseInt(rgb.g)
      const b = parseInt(rgb.b)
      const hex =
        '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      if (hex) {
        this.hexInfo = hex
      } else {
        return null
      }
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
<style lang="scss" scoped>
@media screen and (max-width: 500px) {
  .logo {
    width: 150px !important;
  }
  #header {
    height: 40px !important;
    padding: 5px 5px !important;
  }
  .header-menu {
    margin: 9px 0;
    li {
      margin: 0 10px !important;
    }
  }
}
.el-collapse {
  margin: 20px 0;
  border: none;
}
.describe {
  display: block;
  font-size: 12px;
  color: #999999;
  margin-bottom: 5px;
}
.title {
  margin: 5px 0;
}
#header {
  @include setWAndH(100%, 50px);
  background-color: $dominantHue;
  padding: 10px 20px;
  border-bottom: 2px solid #999999;
  box-sizing: border-box;
  position: relative;
  font-family: $josefinSans !important;
  .slider-menu {
    color: $primaryHued;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
  .header-title {
    color: $primaryHued;
    cursor: pointer;
    font-size: 22px;
    .logo {
      @include setWAndH(200px, 100%);
    }
  }
  .header-menu {
    position: absolute;
    right: 20px;
    top: 0px;
    li {
      list-style: none;
      margin: 0 15px;
      @include setTransition(all, 0.3s, ease);
      color: #ccc;
      cursor: pointer;
      &:hover {
        color: $primaryHued;
      }
      i {
        font-size: 20px;
      }
      .github-link {
        color: #ccc;
        @include setTransition(all, 0.3s, ease);
        &:hover {
          color: $primaryHued;
        }
      }
    }
  }
  .config-box {
    width: 100%;
    max-height: 500px;
    overflow: auto;
    .run-time {
      margin: 10px 0;
    }
    .line {
      border-top: 1px dashed #999;
      @include setWAndH(100%, 0);
    }
    .another-cfg {
      margin: 10px 0;
    }
    .add-cdn {
      .cdn-in {
        margin-bottom: 5px;
        i {
          margin-left: 5px;
          color: $dominantHue;
        }
      }
      .add-link {
        width: 100px;
        font-size: 12px;
        padding: 5px;
        margin-bottom: 5px;
        background-color: $dominantHue;
        color: $primaryHued;
        &:hover {
          background-color: #ccc;
        }
      }
    }
    .add-css {
      .css-in {
        margin-bottom: 5px;
        i {
          margin-left: 5px;
          color: $dominantHue;
        }
      }
      .add-link {
        width: 100px;
        background-color: $dominantHue;
        color: #fff;
        font-size: 12px;
        padding: 5px;
        margin-bottom: 5px;
      }
      .add-link:hover {
        background-color: #999999;
      }
    }
    .preprocessor {
      .prep-box {
        margin: 5px 0;
        .prep-title {
          display: inline-block;
          width: 100px;
        }
      }
    }
  }
  .upload-pop {
    .upload {
      margin: 10px 0;
      width: 100%;
      .upload-content {
        .upload-box {
          margin: 5px 0;
          .upload-input {
            padding: 4px 20px;
            height: 20px;
            line-height: 20px;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            display: inline-block;
            @include setButton(4px, 1px solid $dominantHue);
            @include setTransition(all, 0.3s, ease);
            &:hover {
              color: $dominantHue;
              background-color: $primaryHued;
            }
            input {
              position: absolute;
              font-size: 100px;
              right: 0;
              top: 0;
              opacity: 0;
              filter: alpha(opacity=0);
              cursor: pointer;
            }
          }
          .upload-btn {
            margin: 0 5px;
            padding: 4px;
            @include setButton(4px, 1px solid $dominantHue);
            @include setTransition(all, 0.3s, ease);
          }
          .upload-btn:hover {
            color: $dominantHue;
            background-color: $primaryHued;
          }
        }
      }
      .choose {
        ul {
          padding: 0;
          li {
            margin: 4px 0;
          }
        }
      }
    }
  }
  .download-pop {
    .download-box {
      @include setWAndH(100%, 200px);
      .file-download,
      .files-download {
        font-size: 15px;
        @include setWAndH(200px, 150px);
        padding: 10px;
        .describe {
          color: #999999;
          font-size: 12px;
          height: 50px;
          margin: 5px 0;
        }
        button {
          padding: 5px 10px;
          border: none;
          background-color: $dominantHue;
          color: $primaryHued;
          @include setTransition(all, 0.3s, ease);
          &:hover {
            background-color: #999999;
          }
        }
      }
      .files-download {
        border-left: 1px dashed #999999;
      }
    }
  }
  .color-table {
    width: 100%;
    .color {
      width: 100%;
      margin: 15px 0;
      max-height: 500px;
      overflow: auto;
      .line {
        @include setWAndH(100%, 0);
        border-top: 1px dashed #999;
      }
      .title {
        margin: 5px 0;
      }
      .color-info {
        max-width: 280px;
        .rgb-info {
          width: 100%;
          margin: 10px 0;
          .rgb-input {
            margin: 0 10px;
          }
        }
        .hex-info {
          width: 100%;
          margin: 10px 0;
          .hex-input {
            margin: 0 10px;
          }
        }
      }
      .color-switch {
        cursor: pointer;
        @include setTransition(all, 0.5s, ease);
        i {
          display: block;
          font-size: 20px;
          font-weight: 600;
        }
      }
      .color-switch:hover {
        @include setTransform(rotate(360deg));
      }
      .color-table-content {
        width: 100%;
        box-sizing: border-box;
        padding: 10px;
        .table {
          width: 100%;
          padding: 0;
          .row {
            @include setWAndH(100%, 20px);
            list-style: none;
            margin: 1px 0;
            .clo {
              display: inline-block;
              height: 100%;
              margin: 0 0.5px;
              @include setTransition(all, 0.3s, ease);
              &:hover {
                @include setTransform(scale(1.5));
                box-shadow: 0px 0px 2px $primaryHued;
              }
            }
          }
        }
      }
    }
  }
}
</style>
