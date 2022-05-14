<template>
  <el-dialog class="noselect" @close="handleDialogState('')" :visible="visibleDialog === name"
    :title="downloadLang.title">
    <div class="download flex">
      <div class="single flex flex-clo flex-1 borbox" @click="type='single'" :class="type==='single'?'active':''">
        <div class="single-title">
          <i class="icon iconfont icon-wenjian"></i>
          <span class="title">{{downloadLang.single.title}}</span>
        </div>
        <span class="describe">{{downloadLang.single.describe}}</span>
      </div>
      <div class="multiple flex flex-clo flex-1 borbox" @click="type='multiple'" :class="type==='multiple'?'active':''">
        <div class="multiple-title">
          <i class="icon iconfont icon-wenjianjia"></i>
          <span class="title">{{downloadLang.multiple.title}}</span>
        </div>
        <span class="describe">{{downloadLang.multiple.describe}}</span>
      </div>
    </div>
    <div class="pre-compile flex flex-clo">
      <el-checkbox v-model="preCompile">{{downloadLang.preCompile.title}}</el-checkbox>
      <span class="describe">{{downloadLang.preCompile.describe}}</span>
    </div>
    <el-button class="def-btn" @click="download">{{downloadLang.downloadBtn}}</el-button>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Downloader from '@utils/instanceDownloader.js'
export default {
  data() {
    return {
      name: 'download',
      type: 'single',
      preCompile: true,
    }
  },
  computed: {
    ...mapState([
      'visibleDialog',
      'instanceExtLinks',
      'instanceCode',
      'preprocessor',
    ]),
    downloadLang() {
      return this.$t('dialogs').download
    },
  },
  methods: {
    ...mapMutations(['handleDialogState']),
    download() {
      const code = this.instanceCode
      const links = this.instanceExtLinks
      const prep = this.preprocessor
      const dwPrep = this.preCompile
      const downloader = new Downloader(code, links, prep, dwPrep)
      downloader.handle(this.type)
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 450px !important;
  color: $afterFocus;
  .el-dialog__body {
    padding-top: 0 !important;
  }
}
::v-deep .el-checkbox {
  .el-checkbox__label {
    color: $afterFocus !important;
  }
}
.el-button {
  margin-top: 15px;
  width: 100%;
}
.download {
  height: 120px;
  .single,
  .multiple {
    padding: 10px;
    border: 1px solid $thirdColor;
    border-radius: 4px;
    cursor: pointer;
    @include setTransition(all, 0.3s, ease);
    & > div {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: $afterFocus;
      margin-bottom: 10px;
      i {
        font-size: 20px;
        margin-right: 5px;
      }
    }
  }
  .active {
    border-color: $primary;
  }
  .single {
    margin-right: 5px;
  }
}
.pre-compile {
  margin-top: 15px;
  .describe {
    margin-top: 5px;
  }
}
</style>
