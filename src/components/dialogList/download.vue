<template>
  <div id="download" class="flex flex-clo">
    <div class="simple flex flex-ai">
      <i class="icon iconfont icon-wenjian"></i>
      <div class="describe-box flex flex-clo">
        <span class="title">{{downloadInfo.singleFileTitle}}</span>
        <span class="describe">{{downloadInfo.singleFileDescribe}}</span>
        <el-checkbox class="checkbox" v-model="single.unCompiled">{{downloadInfo.beforeCompile}}</el-checkbox>
      </div>
      <button class="btn-def" @click="singleDownload">
        <i class="icon iconfont icon-xiazai"></i>
        {{downloadInfo.downloadBtn}}
      </button>
    </div>
    <div class="multi flex flex-ai">
      <i class="icon iconfont icon-wenjianjia"></i>
      <div class="describe-box flex flex-clo">
        <span class="title">{{downloadInfo.multiFileTitle}}</span>
        <span class="describe">{{downloadInfo.multiFileDescribe}}</span>
        <el-checkbox class="checkbox" v-model="zip.unCompiled">{{downloadInfo.beforeCompile}}</el-checkbox>
      </div>
      <button class="btn-def" @click="zipDownLoad">
        <i class="icon iconfont icon-xiazai"></i>
        {{downloadInfo.downloadBtn}}
      </button>
    </div>
  </div>
</template>

<script>
import * as downloadFiles from '@/utils/downloadFiles'
export default {
  data(){
    return {
      single: {
        unCompiled: false
      },
      zip: {
        unCompiled: false
      }
    }
  },
  computed:{
    downloadInfo(){
      return window.Global.language.dialogInfo.download
    }
  },
  methods: {
    singleDownload() {
      downloadFiles.singleDownLoad(this.single.unCompiled)
      const commit = this.$store.commit
      commit('updateCurrentDialog', '')
      commit('updateShowBg', false)
    },
    zipDownLoad() {
      downloadFiles.zipDownLoad(this.zip.unCompiled)
      const commit = this.$store.commit
      commit('updateCurrentDialog', '')
      commit('updateShowBg', false)
    }
  }
}
</script>

<style lang="scss" scoped>
#download{
  .simple, .multi{
    @include setWAndH(100%, 100px);
    .describe-box {
      @include setWAndH(300px);
      .title{
        color: $afterFocus;
        margin-bottom: 5px;
      }
      .checkbox{
        margin-top: 5px;
        color: $afterFocus;
      }
    }
    &>i{
      font-size: 50px;
      margin-right: 10px;
      color: $afterFocus;
    }
    &>button{
      @include setWAndH(100px,30px);
    }
  }
}
</style>