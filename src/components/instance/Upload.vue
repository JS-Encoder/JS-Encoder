<template>
  <el-dialog :title="uploadLang.title" :visible="visibleDialog === name" @close="closeDialog">
    <div class="upload-content flex flex-clo">
      <div>
        <span class="describe">{{uploadLang.preDescribe}}</span>
        <span class="mime-type">{{uploadLang.mimeType}}</span>
        <span class="describe">{{uploadLang.aftDescribe}}</span>
      </div>
      <div class="resolve flex flex-clo">
        <el-checkbox v-model="resolve">{{uploadLang.resolveHTML}}</el-checkbox>
        <span class="describe">{{uploadLang.resolveDescribe}}</span>
      </div>
      <a title="" href="javascript:;" class="borbox upload flex flex-jcc" @change="chooseFile">
        <input type="file" class="upload-input" ref="fileInput" multiple="multiple">
        {{uploadLang.chooseBtn}}
      </a>
      <div class="file-list flex flex-clo flex-ai" v-if="fileList.length">
        <span class="title">{{uploadLang.fileList}}</span>
        <ul>
          <li v-for="(item, index) in fileList" :key="index" class="flex flex-ai">
            <i class="icon iconfont icon-wenjian1"></i>
            <span class="file-name">{{item.name}}</span>
            <i @click="delFile(index)" class="el-icon-close"></i>
          </li>
        </ul>
        <el-button class="def-btn" @click="upload">{{uploadLang.uploadBtn}}</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { limitMimeType } from '@utils/publicData'
import uploader from '@utils/uploader'
export default {
  data() {
    return {
      name: 'upload',
      fileList: [],
      resolve: true,
    }
  },
  computed: {
    ...mapState(['visibleDialog', 'resolveHTML', 'language']),
    uploadLang() {
      return this.$t('dialogs').upload
    },
  },
  methods: {
    ...mapMutations([
      'handleDialogState',
      'handleResolveHTML',
      'handleInstanceExtLinks',
      'handleInstanceCode',
      'handlePreprocessor',
      'handleCurrentTab',
      'handleHasUploadCode',
    ]),
    chooseFile() {
      /**
       * Get files which want to upload and judge the mimetype whether satisfy the condition or not
       * 判断上传的文件中哪些是符合后缀名要求的
       */
      const input = this.$refs.fileInput
      const files = input.files
      if (!files.length) return
      for (let i = 0, k = files.length; i < k; i++) {
        const name = this.getMimeType(files[i].name)
        if (limitMimeType.includes(name)) {
          this.fileList.push(files[i])
        }
      }
    },
    getMimeType(fileName) {
      const pos = fileName.lastIndexOf('.')
      return fileName.substring(pos + 1)
    },
    delFile(index) {
      /**
       * Clear the input, because if it is not cleared, the change event will not be triggered when the same file is uploaded next time
       * 清除input中上一次传入的文件，因为如果不清除，下次上传同一个文件时不会触发change事件
       */
      this.fileList.splice(index, 1)
      const input = this.$refs.fileInput
      input.value = ''
    },
    async upload() {
      /**
       * Upload the file, change the preprocessing language according to the file suffix, and render the content of the file to the editing window
       * After the upload is successful, a prompt will pop up and the uploaded file list will be cleaned up
       * 上传文件，根据文件后缀更改预处理语言，将文件内容渲染到编辑窗口
       * 上传成功后会弹出提示并清理上传的文件列表
       */
      try {
        const fileList = this.fileList
        const resolve = this.resolve
        const codeObj = {}
        this.handleHasUploadCode(false)
        await uploader(fileList, resolve).then((res) => {
          let visibleTab = ''
          const { HTML, CSS, JavaScript } = res
          if (HTML) {
            const content = HTML.content
            if (this.resolve && HTML.type === 'html') {
              const { html, css, js, links, scripts } = content
              if (html) {
                codeObj.HTML = html
                this.handlePreprocessor({ index: 0, newPrep: 'HTML' })
              }
              if (css) {
                codeObj.CSS = css
                this.handlePreprocessor({ index: 1, newPrep: 'CSS' })
              }
              if (js) {
                codeObj.JavaScript = js
                this.handlePreprocessor({ index: 2, newPrep: 'JavaScript' })
              }
              if (links && links.length) {
                this.handleInstanceExtLinks({ name: 'cssLinks', list: links })
              }
              if (scripts && scripts.length) {
                this.handleInstanceExtLinks({ name: 'JSLinks', list: scripts })
              }
              visibleTab = 'HTML'
            } else {
              codeObj.HTML = content
              this.handlePreprocessor({ index: 0, newPrep: HTML.type })
              visibleTab = HTML.type
            }
          }
          if (CSS) {
            codeObj.CSS = CSS.content
            this.handlePreprocessor({ index: 1, newPrep: CSS.type })
            visibleTab = CSS.type
          }
          if (JavaScript) {
            codeObj.JavaScript = JavaScript.content
            this.handlePreprocessor({ index: 2, newPrep: JavaScript.type })
            visibleTab = JavaScript.type
          }
          this.handleCurrentTab(visibleTab)
        })
        for (let lang in codeObj) {
          this.handleInstanceCode({
            mode: lang,
            code: codeObj[lang],
          })
        }
        this.fileList = []
        let title, message
        if (this.language === 'zh') {
          title = '上传成功'
          message = '所有文件已全部上传完毕！'
        } else {
          title = 'Success'
          message = 'All files have been uploaded!'
        }
        this.notifyInstance = this.$notify.success({
          title,
          message,
          duration: 5000,
          position: 'top-right',
          offset: 23,
        })
        this.$refs.fileInput.value = ''
        this.handleHasUploadCode(true)
      } catch (err) {
        let title, message
        if (this.language === 'zh') {
          title = '上传失败'
          message = '文件上传过程出错！'
        } else {
          title = 'Failure'
          message = 'Error during file upload!'
        }
        this.notifyInstance = this.$notify.error({
          title,
          message,
          duration: 5000,
          position: 'top-right',
          offset: 23,
        })
      }
    },
    closeDialog() {
      this.handleResolveHTML(this.resolve)
      this.handleDialogState('')
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  width: 450px !important;
  max-height: 450px;
  overflow-y: auto;
  .el-dialog__body {
    padding-top: 0 !important;
  }
  .upload-content {
    font-size: 14px;
    .mime-type {
      color: $beforeFocus;
    }
    .resolve {
      margin: 10px 0;
    }
  }
  .upload {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: $beforeFocus;
    background-color: $thirdColor;
    font-size: 14px;
    border-radius: 4px;
    position: relative;
    margin-top: 10px;
    border: 1px solid $thirdColor;
    @include setTransition(all, 0.3s, ease);
    &:hover {
      color: $afterFocus;
      border-color: $primary;
    }
    .upload-input {
      width: 100%;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  .file-list {
    margin-top: 15px;
    .title {
      color: $beforeFocus;
    }
    ul {
      li {
        margin-bottom: 10px;
        .file-name {
          color: $beforeFocus;
          margin: 0 5px;
          width: 150px;
          display: inline-block;
          @include text-ellipsis();
        }
        i {
          font-weight: 550;
          color: $beforeFocus;
        }
        .el-icon-close {
          font-size: 16px;
          cursor: pointer;
          &:hover {
            color: $danger;
          }
        }
      }
    }
  }
}
</style>
