<template>
  <div class="flex flex-ai" id="header">
    <span class="header-title noselect flex">
      <img alt class="logo" src="../assets/logo.svg" />
    </span>
    <ul class="header-menu flex">
      <li @click="openDownload">
        <i class="icon iconfont icon-baocun" style="font-size:23px"></i>
      </li>
      <li>
        <a class="github-link" href="https://github.com/Longgererer/Compiler-ol" target="black">
          <i class="icon iconfont icon-git" style="font-size:22px"></i>
        </a>
      </li>
      <li @click="openConfig">
        <i class="icon iconfont icon-config"></i>
      </li>
      <li @click="openHelp">
        <i class="icon iconfont icon-help"></i>
      </li>
    </ul>
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
  </div>
</template>
<script>
import popUp from './popUp'
import { saveAs } from 'file-saver'
const JSZip = require('jszip')
export default {
  data() {
    return {
      download: {
        isShow: false
      },
      help: {
        isShow: false
      },
      config: {
        isShow: false
      },
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
      autoUp: true
    }
  },
  components: {
    popUp
  },
  computed: {
    showConfig() {
      return this.config.isShow
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
    openConfig() {
      this.config.isShow = true
    },
    openHelp() {
      this.help.isShow = true
    },
    openDownload() {
      this.download.isShow = true
    },
    singleDownload() {
      // Single file download
      // requires writing all HTML,CSS and JavaScript to a single file
      // if user uses preprocessing language,so first compile the preprocessing language

      // css link
      const cssLinks = this.$store.state.cssLinks
      let validCss = ''

      if (cssLinks.length) {
        for (let item of cssLinks) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCss += `<link rel="stylesheet" href="${item}">`
        }
      }

      // js cdn
      const cdnJs = this.$store.state.cdnJs
      let validCDN = ''
      if (cdnJs.length) {
        for (let item of cdnJs) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCDN += `<script src="${item}"><\/script>\n\t`
        }
      }

      // create an a tag,splicing file content and trigger click event
      const aTag = document.createElement('a')
      const content = this.$store.state.textBoxContent
      const htmlCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t<title>Document</title>\n\t<style>\n\t${
        content.CSS
      }\n\t</style>\n</head>\n<body>\n\t${content.HTML +
        validCDN}\n\t<script>\n\t${
        content.JavaScript
      }\n\t<\/script>\n</body>\n</html>`
      let blob = new Blob([htmlCode])
      aTag.download = 'index.html'
      aTag.href = URL.createObjectURL(blob)
      aTag.click()
      URL.revokeObjectURL(blob)
      this.download.isShow = false
    },
    filesDownload() {
      // files download
      const cssLinks = this.$store.state.cssLinks
      let validCss = ''

      // css link
      if (cssLinks.length) {
        for (let item of cssLinks) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCss += `<link rel="stylesheet" href="${item}">`
        }
      }

      // js cdn
      const cdnJs = this.$store.state.cdnJs
      let validCDN = ''
      if (cdnJs.length) {
        for (let item of cdnJs) {
          if (!item) continue
          if (item.indexOf('https://') != -1 || item.indexOf('http://') != -1)
            validCDN += `<script src="${item}"><\/script>\n\t`
        }
      }

      // put all files in one folder and converted to compressed file by jszip
      const zip = new JSZip()
      let code = zip.folder('code')
      const content = this.$store.state.textBoxContent
      const htmlCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t<title>Document</title>\n\t<link rel="stylesheet" href="./index.css">\n</head>\n<body>\n\t${content.HTML +
        validCDN}\n\t<script src="./index.js"><\/script>\n</body>\n</html>`
      const cssCode = content.CSS
      const jsCode = content.JavaScript
      code.file('index.html', htmlCode)
      code.file('index.css', cssCode)
      code.file('index.js', jsCode)
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'code.zip')
      })
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
      // obj为prep中的属性名称
      const value = this.prep[obj].value
      this.$store.commit('updateStateAttr', { attr: obj, value })
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
    padding: 5px 10px !important;
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
  color: #909399;
  margin-bottom: 5px;
}
.title {
  margin: 5px 0;
}
#header {
  width: 100%;
  height: 50px;
  background-color: #1e1e1e;
  padding: 10px 20px;
  border-bottom: 2px solid #999999;
  box-sizing: border-box;
  position: relative;
  font-family: 'Josefin Sans', sans-serif !important;
  .header-title {
    color: #f2f2f2;
    cursor: pointer;
    font-size: 22px;
    .logo {
      width: 200px;
      height: 100%;
    }
  }
  .header-menu {
    position: absolute;
    right: 20px;
    top: 0px;
    li {
      list-style: none;
      margin: 0 15px;
      transition: all 0.3s ease;
      color: #ccc;
      cursor: pointer;
      i {
        font-size: 20px;
      }
      .github-link {
        color: #ccc;
        text-decoration: none;
        transition: all 0.3s ease;
      }
    }
    li:hover,
    .github-link:hover {
      color: #f2f2f2;
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
      width: 100%;
      height: 0;
      border-top: 1px dashed #999;
    }
    .another-cfg {
      margin: 10px 0;
    }
    .add-cdn {
      .cdn-in {
        margin-bottom: 5px;
        i {
          margin-left: 5px;
          color: #1e1e1e;
        }
      }
      .add-link {
        width: 100px;
        background-color: #1e1e1e;
        color: #fff;
        font-size: 12px;
        padding: 5px;
        margin-bottom: 5px;
      }
      .add-link:hover {
        background-color: #999999;
      }
    }
    .add-css {
      .css-in {
        margin-bottom: 5px;
        i {
          margin-left: 5px;
          color: #1e1e1e;
        }
      }
      .add-link {
        width: 100px;
        background-color: #1e1e1e;
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
  .download-pop {
    .download-box {
      width: 100%;
      height: 200px;
      .file-download,
      .files-download {
        font-size: 15px;
        width: 200px;
        height: 150px;
        padding: 10px;
        .describe {
          color: gray;
          font-size: 12px;
          height: 50px;
          margin: 5px 0;
        }
        button {
          padding: 5px 10px;
          border: none;
          background-color: #1e1e1e;
          color: #f2f2f2;
          transition: 0.3s all ease;
        }
        button:hover {
          background-color: #999999;
        }
      }
      .files-download {
        border-left: 1px dashed #999999;
      }
    }
  }
}
</style>
