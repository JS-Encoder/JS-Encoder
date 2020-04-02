<template>
  <div id="moreOpt" class="flex flex-clo">
    <div class="run-time">
      <span class="title">{{ moreOptInfo.waitTime }}</span><br />
      <span class="describe">{{ moreOptInfo.waitTimeDescribe }}</span><br />
      <el-input-number class="el-input-number" :min="200" :step="50" size="small" v-model="waitTime">
      </el-input-number>
      (ms)
    </div>
    <div class="another-cfg">
      <el-checkbox class="el-checkbox" v-model="replace">{{
        moreOptInfo.replaceTab
      }}</el-checkbox>
    </div>
    <div class="another-cfg flex flex-clo">
      <el-checkbox v-model="autoUp">{{ moreOptInfo.autoExecute }}</el-checkbox>
      <div class="describe">{{ moreOptInfo.autoExecuteDescribe }}</div>
    </div>
    <div class="another-cfg flex flex-clo">
      <el-checkbox v-model="showHistoryLog">{{ moreOptInfo.showHistoryLog }}</el-checkbox>
      <div class="describe">{{ moreOptInfo.showHistoryLogDescribe }}</div>
    </div>
    <div class="another-cfg flex flex-clo">
      <span class="title">{{ moreOptInfo.tabIndent }}</span>
      <el-slider class="tab-slider" v-model="tabIndent" :min="0" :step="1" :max="8" show-stops>
      </el-slider>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      replace: false,
      autoUp: false,
      waitTime: 0,
      showHistoryLog: false,
      tabIndent: 2
    }
  },
  mounted() {
    // 从state初始化设置数据
    const codeOptions = this.codeOptions
    this.replace = codeOptions.replace
    this.autoUp = codeOptions.autoUp
    this.waitTime = codeOptions.waitTime
    this.showHistoryLog = codeOptions.showHistoryLog
    this.tabIndent = codeOptions.tabIndent
  },
  computed: {
    moreOptInfo() {
      return window.Global.language.dialogInfo.more
    },
    codeOptions() {
      return this.$store.state.codeOptions
    }
  },
  beforeDestroy() {
    // 销毁组件时(关闭设置窗口)，将新的设置更新到state
    const commit = this.$store.commit
    const codeOptions = this.codeOptions
    const replace = this.replace
    const autoUp = this.autoUp
    const waitTime = this.waitTime
    const showHistoryLog = this.showHistoryLog
    const tabIndent = this.tabIndent
    // 只向state提交已改变的配置
    if (replace !== codeOptions.replace) {
      commit('updateCodeOptions', {
        option: 'replace',
        conf: replace
      })
    }
    if (autoUp !== codeOptions.autoUp) {
      commit('updateCodeOptions', {
        option: 'autoUp',
        conf: autoUp
      })
    }
    if (waitTime !== codeOptions.waitTime) {
      commit('updateCodeOptions', {
        option: 'waitTime',
        conf: waitTime
      })
    }
    if (showHistoryLog !== codeOptions.showHistoryLog) {
      commit('updateCodeOptions', {
        option: 'showHistoryLog',
        conf: showHistoryLog
      })
    }
    if (tabIndent !== codeOptions.tabIndent) {
      commit('updateCodeOptions', {
        option: 'tabIndent',
        conf: tabIndent
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#moreOpt {
  .run-time,
  .another-cfg {
    margin-top: 10px;
    color: $afterFocus;
    span {
      margin-top: 5px;
    }
    .title {
      font-weight: 600;
      font-size: 17px;
      color: $afterFocus;
      margin-top: 5px;
    }
    .describe {
      font-size: 12px;
      color: $describe;
      margin-top: 5px;
    }
    .el-input-number {
      margin-top: 5px;
    }
    .el-checkbox {
      color: $afterFocus;
    }
    .tab-slider {
      width: 300px;
    }
  }
}
</style>