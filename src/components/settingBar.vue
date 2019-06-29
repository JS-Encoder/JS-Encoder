<template>
  <div class="noselect" id="settingBar">
    <div class="setting flex flex-w flex-jca">
      <div class="type-setting">
        <el-checkbox-group size="mini" v-model="checkType">
          <el-checkbox-button :key="item" :label="item" v-for="item in types">{{item}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="tab-space">
        <span>tab-space:</span>
        <el-radio-group size="mini" v-model="applySpace">
          <el-radio-button :key="item" :label="item" v-for="item in space">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="run">
        <el-button @click="run" size="mini" type="primary">
          <span class="btn-txt">
            Run
            <i class="icon iconfont icon-o-run"></i>
          </span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      types: ['HTML', 'CSS', 'JavaScript', 'Console', 'Output'],
      space: [2, 4],
      checkType: ['HTML', 'CSS', 'JavaScript', 'Console', 'Output'],
      applySpace: 2,
      isRun: false
    }
  },
  watch: {
    checkType() {
      this.$emit('hasChanged', this.checkType)
    },
    applySpace() {
      this.$emit('changeTab', this.applySpace)
    },
    isRun(newVal) {
      this.$store.commit('updateRun', newVal)
    }
  },
  methods: {
    run() {
      if (this.isRun) return
      this.isRun = true
      setTimeout(() => {
        this.isRun = false
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 500px) {
  #settingBar{
    padding-bottom: 5px !important;
  }
  .type-setting,.tab-space,.run {
    margin-top: 5px !important;
  }
}
#settingBar {
  padding-bottom: 10px;
  border-bottom: 2px solid #1e1e1e;
  font-family: 'Josefin Sans', sans-serif !important;
  .setting {
    min-width: 360px;
    .type-setting{
      margin-top: 10px;
    }
    .tab-space {
      display: flex;
      align-items: center;
      margin-top: 10px;
      span {
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .run {
      margin-top: 10px;
      .btn-txt{
        font-family: 'Josefin Sans', sans-serif !important;
      }
      i {
        font-size: 12px;
      }
    }
  }
}
</style>
