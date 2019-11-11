<template>
  <div class="noselect" id="settingBar">
    <div class="setting flex flex-w flex-jca">
      <div class="type-setting">
        <el-checkbox-group size="mini" v-model="checkType">
          <el-checkbox-button :key="item" :label="item" v-for="item in types">{{item}}</el-checkbox-button>
        </el-checkbox-group>
      </div>
      <div class="tab-space flex flex-ai">
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
      <div class="reset">
        <el-button @click="resetEdit" size="mini" type="primary">
          <span class="btn-txt">
            Reset
            <i class="icon iconfont icon-chongzhi"></i>
          </span>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      types: [],
      space: [2, 4],
      checkType: [],
      applySpace: 2,
      isRun: false
    }
  },
  computed: {
    ...mapState({
      HTMLPrep: 'HTMLPrep',
      CSSPrep: 'CSSPrep',
      JSPrep: 'JSPrep'
    })
  },
  created() {
    this.types = [this.HTMLPrep, this.CSSPrep, this.JSPrep, 'Console', 'Output']
    this.checkType = [
      this.HTMLPrep,
      this.CSSPrep,
      this.JSPrep,
      'Console',
      'Output'
    ]
  },
  watch: {
    HTMLPrep(newVal, oldVal) {
      this.changeTypeList(newVal, oldVal, 0)
    },
    CSSPrep(newVal, oldVal) {
      this.changeTypeList(newVal, oldVal, 1)
    },
    JSPrep(newVal, oldVal) {
      this.changeTypeList(newVal, oldVal, 2)
    },
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
      // 防抖
      if (this.isRun) return null
      this.isRun = true
      setTimeout(() => {
        this.isRun = false
      }, 500)
    },
    changeTypeList(newVal, oldVal, index) {
      // change this.types and this.checkType, modifying array elements directly does not trigger listening, arrays must be modified by $set or splice
      let ctIndex
      this.checkType.forEach((item, i) => {
        if (item === oldVal) {
          ctIndex = i
        }
      })
      this.types[index] = newVal
      if (this.checkType.indexOf(oldVal) !== -1) {
        this.checkType.splice(ctIndex, 1, newVal)
      }
    },
    resetEdit() {
      this.$store.commit('change', {
        HTML: '',
        CSS: '',
        JavaScript: ''
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 500px) {
  #settingBar {
    padding-bottom: 5px !important;
  }
  .type-setting,
  .tab-space,
  .run,
  .reset {
    margin-top: 5px !important;
  }
}

#settingBar {
  padding-bottom: 10px;
  border-bottom: 2px solid $dominantHue;
  font-family: $josefinSans !important;
  .setting {
    min-width: 360px;
    .type-setting {
      margin-top: 10px;
    }
    .tab-space {
      margin-top: 10px;
      span {
        font-size: 14px;
        margin-right: 10px;
      }
    }
    .run,
    .reset {
      margin-top: 10px;
      .btn-txt {
        font-family: $josefinSans !important;
      }
      i {
        font-size: 12px;
      }
    }
  }
}
</style>
