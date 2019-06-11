<template>
  <div id="settingBar" class="noselect">
    <div class="setting">
      <div class="type-setting">
        <el-checkbox-group size="small" v-model="checkType">
          <el-checkbox-button :key="item" :label="item" v-for="item in types">{{item}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="tab-space">
        <span>tab-space:</span>
        <el-radio-group size="small" v-model="applySpace">
          <el-radio-button :key="item" :label="item" v-for="item in space">{{item}}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="run">
        <el-button size="small" type="primary">
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
      applySpace: 4
    }
  },
  watch: {
    checkType(){
      this.$emit('hasChanged', this.checkType)
    },
    applySpace(){
      this.$emit('changeTab', this.applySpace)
    }
  }
}
</script>
<style lang="scss" scoped>
#settingBar {
  display: flex;
  padding: 10px 20px;
  border-bottom: 2px solid #333333;
  .setting {
    display: flex;
    min-width: 600px;
    justify-content: space-around;
    .tab-space{
      display: flex;
      align-items: center;
      span{
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .run {
      i {
        font-size: 12px;
      }
    }
  }
}
</style>
