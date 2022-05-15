<template>
  <el-dialog id="versionLogs" @close="closeDialog()" :visible="isDialogVisible" :title="versionLogsLang.title">
    <div v-for="(item, index) in logs" :key="index" class="log flex flex-clo borbox">
      <div class="log-header flex flex-ai flex-jcb">
        <span class="log-title">{{item.title}}</span>
        <span class="log-time">{{item.pubTime}}</span>
      </div>
      <div class="log-content">
        <div v-html="item.content"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { get } from '@utils/axiosApi'
import { compileHTML } from '@utils/compiler'
import storage from '@utils/localStorage'
export default {
  data() {
    return {
      name: 'versionLogs',
      lastestV : '',
      logs: []
    }
  },
  created() {
    this.getVersionLogs()
  },
  computed: {
    ...mapState(['visibleDialog']),
    versionLogsLang() {
      return this.$t('dialogs').versionLogs
    },
    isDialogVisible() {
      return this.visibleDialog === this.name
    },
  },
  watch: {
    isDialogVisible(status) {
      if (status) {
        // 存储最新版本到本地
        storage.set('version', this.lastestV)
      }
    },
    lastestV(newV) {
      if (this.isDialogVisible) {
        storage.set('version', newV)
      }
    }
  },
  methods: {
    ...mapMutations(['handleDialogState']),
    closeDialog() {
      this.handleDialogState('')
    },
    async getVersionLogs() {
      const logs = await get('/githubApi/repositories/190842308/releases')
      const res = []
      for(let log of logs){
        let { name: title, tag_name: version, body: content, published_at: pubTime } = log
        content = await compileHTML(content, 'Markdown')
        res.push({ title, version, content, pubTime: pubTime.slice(0, 10) })
      }
      this.lastestV = res[0].version
      this.logs = res
    }
  }
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog {
  width: 650px !important;
  color: $afterFocus;
  max-height: 70%;
  overflow-y: auto;
  overflow-x: hidden;
  .el-dialog__body {
    padding-top: 0 !important;
  }
  .log {
    background-color: $secondColor;
    margin-top: 8px;
    padding: 8px;
    color: $afterFocus;
    .log-title {
      font-weight: bold;
      font-size: 18px;
    }
    .log-time {
      color: $describe;
    }
    .log-content {
      ol, ul {
        padding-left: 16px;
      }
      ol li {
        list-style-type: decimal;
      }
      ul li {
        list-style-type: disc;
      }
      img {
        max-width: 90%;
      }
    }
  }
}
</style>