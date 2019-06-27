<template>
  <div class="noselect" id="settingBar">
    <div class="setting">
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
          Run
          <i class="icon iconfont icon-o-run"></i>
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
#settingBar {
  display: flex;
  padding: 10px 20px;
  border-bottom: 2px solid #1e1e1e;
  .setting {
    display: flex;
    min-width: 600px;
    justify-content: space-around;
    .type-setting {
      margin: 0 15px;
    }
    .tab-space {
      display: flex;
      align-items: center;
      margin: 0 15px;
      span {
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .run {
      margin: 0 15px;
      i {
        font-size: 12px;
      }
    }
  }
}
</style>
