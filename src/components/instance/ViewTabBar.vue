<template>
  <div id="viewTabBar" class="flex noselect flex-sh">
    <div class="tab flex flex-1">
      <div class="browser-tab flex flex-ai flex-jcc" :class="showView?'active-tab':''">
        <i class="el-icon-view"></i>
        View
      </div>
    </div>
    <div class="tools flex flex-sh">
      <div class="flex flex-ai flex-jcc" :title="viewToolsLang.refresh" @click="refresh">
        <i class="icon iconfont icon-zhongzhi"></i>
      </div>
      <div class="flex flex-ai flex-jcc" :title="viewToolsLang.fullScreen" @click="fullScreen">
        <i class="icon iconfont icon-fangda"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showView: true
    }
  },
  computed: {
    viewToolsLang() {
      return this.$t('instance').viewTools
    }
  },
  methods: {
    refresh() {
      this.$emit('runCode')
    },
    fullScreen() {
      this.$emit('fullScreen', true)
    }
  },
  components: {}
}
</script>

<style lang="scss" scoped>
#viewTabBar {
  width: 100%;
  height: 30px;
  background-color: $secondColor;
  .tab {
    .browser-tab {
      padding: 0 20px;
      color: $beforeFocus;
      background-color: $thirdColor;
      font-size: 14px;
      cursor: pointer;
      i {
        margin-right: 5px;
        font-size: 16px;
      }
      &:hover {
        color: $afterFocus;
      }
    }
    .active-tab {
      background-color: $mainColor;
      color: $afterFocus;
    }
  }
  .tools {
    font-size: 18px;
    color: $beforeFocus;
    & > div {
      width: 40px;
      cursor: pointer;
      i {
        font-size: 18px;
      }
      &:hover {
        color: $afterFocus;
      }
    }
  }
}
</style>
