<template>
  <div class="flex flex-ai" id="header">
    <span class="header-title noselect flex">
      <img class="logo" src="../assets/logo.svg" alt="">
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
      </div>
    </popUp>
    <popUp :pop="help" class="noselect">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item name="1" title="shortcut key">
          <div>CTRL + ALT ---------------------------- Trun on smart tips</div>
          <div>CTRL + Q ---------------------------- Fold the code</div>
          <div>CTRL + / ---------------- Toggle comment on selected lines</div>
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
      activeName: '',
      waitTime: 1000,
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
        this.$store.commit('updateTime', this.waitTime)
        this.$store.commit('updateReplace', this.replace)
        this.$store.commit('updateAutoUp', this.autoUp)
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
      const aTag = document.createElement('a')
      const content = this.$store.state.textBoxContent
      const htmlCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t<title>Document</title>\n\t<style>\n\t${
        content.CSS
      }\n\t</style>\n</head>\n<body>\n\t${content.HTML}\n\t<script>\n\t${
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
      const zip = new JSZip()
      let code = zip.folder('code')
      const content = this.$store.state.textBoxContent
      const htmlCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<meta http-equiv="X-UA-Compatible" content="ie=edge">\n\t<title>Document</title>\n\t<link rel="stylesheet" href="./index.css">\n</head>\n<body>\n\t${
        content.HTML
      }\n\t<script src="./index.js"><\/script>\n</body>\n</html>`
      const cssCode = content.CSS
      const jsCode = content.JavaScript
      code.file('index.html', htmlCode)
      code.file('index.css', cssCode)
      code.file('index.js', jsCode)
      zip.generateAsync({ type: 'blob' }).then(function(content) {
        saveAs(content, 'code.zip')
      })
      this.download.isShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-collapse {
  margin: 20px 0;
  border: none;
}
#header {
  width: 100%;
  height: 50px;
  background-color: #1e1e1e;
  padding: 10px 20px;
  border-bottom: 2px solid #999;
  box-sizing: border-box;
  position: relative;
  .header-title {
    color: #f2f2f2;
    cursor: pointer;
    font-family: 'Merienda', cursive;
    font-size: 22px;
    img{
      width: 180px;
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
    .run-time {
      margin: 10px 0;
      .title {
        margin: 5px 0;
      }
      .describe {
        display: block;
        font-size: 12px;
        color: #909399;
        margin-bottom: 5px;
      }
    }
    .line {
      width: 100%;
      height: 0;
      border-top: 1px dashed #999;
    }
    .another-cfg {
      margin: 10px 0;
      .describe {
        display: block;
        font-size: 12px;
        color: #909399;
        margin-bottom: 5px;
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
