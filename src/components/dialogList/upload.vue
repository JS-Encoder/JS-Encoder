<template>
  <div id="upload" class="flex flex-clo">
    <span class="describe">{{ uploadInfo.describe }}</span>
    <div class="flex flex-ai flex-clo upload-box">
      <a @change="chooseFile" class="upload-input btn-def" href="javascript:;">
        <input class="flex flex-ai" id multiple="multiple" name ref="fileInput" type="file" />{{
          uploadInfo.chooseBtn
        }}
      </a>
      <div class="choose-list flex flex-clo flex-ai" v-if="chooseFiles.length">
        <ul>
          <li :key="index" v-for="(item, index) in chooseFiles">
            {{item.name}}
            <i @click="delFile(index)" class="icon iconfont icon-error1"></i>
          </li>
        </ul>
      </div>
      <button class="btn-def" @click="uploadFile">
        <i class="icon iconfont icon-feiji"></i>
        {{ uploadInfo.uploadBtn }}
      </button>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver'
import * as upLoader from '@/utils/uploadFile'
import * as judge from '@/utils/judgeMode'
export default {
  data() {
    return {
      chooseFiles: []
    }
  },
  methods: {
    chooseFile(){
      // 选择上传文件
      const input = this.$refs.fileInput
      const files = input.files
      if (!files.length) return

      const limitType = upLoader.limitType
      for (let i = 0, k = files.length; i < k; i++) {
        const name = this.getMimeType(files[i].name)
        if (limitType.includes(name)) {
          this.chooseFiles.push(files[i])
        }
      }
    },
    getMimeType(fileName) {
      const pos = fileName.lastIndexOf('.')
      return fileName.substring(pos + 1)
    },
    delFile(index) {
      this.chooseFiles.splice(index, 1)
      // 清空input，因为如果不清空，下次上传相同的文件就不会触发change事件
      const input = this.$refs.fileInput
      input.value = ''
    },
    async uploadFile(){
      const files = this.chooseFiles
      if (!files.length) return
      // 遍历文件对象数组
      for (let i = 0; i < files.length; i++) {
        let fileString = '', mimeType = ''
        const currentFile = files[i]
                  /**
           * 如果是html文件，就需要把里面的js，css以及外部链接分开来
           * 将链接更新至state，覆盖原本的外部链接
           * 将文件内容更新各自对应的编辑窗口中
           */
        await upLoader.readFile(currentFile).then(res => {//读取文件信息
          this.chooseFiles = []
          if(this.getMimeType(currentFile.name) === 'html'){//html文件
            const commit = this.$store.commit
            for (let item in res) {//拆分文件内容
              let content = res[item].content
              const type = res[item].type
              if (type === 'css') {
                commit('updateLinkList', content.link)
                content = content.finCode
              } else if (type === 'js') {
                commit('updateCdnJS', content.CDN)
                content = content.finCode
              }
              this.updateEditorContent(content, type)//渲染至编辑窗口
            }
            return void 0
          }
          fileString = res.content
          mimeType = res.type
        })
        if(mimeType) this.updateEditorContent(fileString, mimeType)
      }
    },
    updateEditorContent(content, type) {
      const prepType = judge.judgeModeByMimeType(type)
      type = judge.judgeExtension(type)
      const commit = this.$store.commit
      commit('updateCodeAreaMessage', {
        mode: type,
        message: content
      })
      commit('updatePreprocess', {
        index: type === 'HTML' ? 0 : type === 'CSS' ? 1 : 2,
        newPrep: prepType
      })
      const currentTab = this.$store.state.currentTab
      if(type === currentTab)commit('updateCurrentTab', prepType)
    }
  },
  components: {},
  computed: {
    uploadInfo(){
      return window.Global.language.dialogInfo.upload
    }
  }
}
</script>

<style lang="scss" scoped>
#upload{
  @include setWAndH(100%);
  &>span{
    margin-top: 5px;
  }
  .upload-box{
    margin: 5px 0;
    .upload-input{
      padding: 4px 50px;
      height: 20px;
      line-height: 20px;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      display: inline-block;
      font-size: 17px;
      font-weight: 600;
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
    .choose-list{
      color: $beforeFocus;
      i{
        color: $deepColor;
        cursor: pointer;
        @include setTransition(all, 0.3s, ease);
        &:hover{
          color: $beforeFocus;
        }
      }
    }
    button{
      margin-top: 5px;
      padding: 5px 10px;
      font-weight: 600;
    }
  }
}
</style>
