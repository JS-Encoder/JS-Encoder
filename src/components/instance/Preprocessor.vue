<template>
  <el-dialog @close="handleDialogState('')" :visible="isDialogVisible" :title="prepLang.title">
    <div class="preprocessor flex flex-clo">
      <span class="describe" v-show="cpntMode">{{prepLang.describe}}</span>
      <div class="prep-item flex flex-ai" v-for="(item,index) in prepTitle" :key="index">
        <span class="flex-sh">{{item}}</span>
        <el-select v-model="prep[index]" @change="prepChange(index)" :disabled="cpntMode">
          <el-option v-for="lang in defPrepOpts[item]" :key="lang" :label="lang" :value="lang"></el-option>
        </el-select>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { defPrepOpts } from '@utils/publicData'
import { judgeMode } from '@utils/judgeMode'
export default {
  data() {
    return {
      name: 'preprocessor',
      defPrepOpts,
      prep: ['HTML', 'CSS', 'JavaScript'],
      prepTitle: ['HTML', 'CSS', 'JavaScript'],
    }
  },
  computed: {
    ...mapState(['visibleDialog', 'preprocessor', 'currentTab', 'cpntMode']),
    prepLang() {
      return this.$t('dialogs').preprocessor
    },
    isDialogVisible() {
      return this.name === this.visibleDialog
    }
  },
  watch: {
    isDialogVisible(newState) {
      if(newState){
        this.prep = [...this.preprocessor]
      }
    }
  },
  methods: {
    ...mapMutations([
      'handleDialogState',
      'handlePreprocessor',
      'handleCurrentTab',
    ]),
    prepChange(index) {
      const newPrep = this.prep[index]
      this.handlePreprocessor({ index, newPrep })
      if (judgeMode(newPrep) === judgeMode(this.currentTab)) {
        this.handleCurrentTab(newPrep)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/* main style */
::v-deep .el-dialog {
  width: 450px !important;
}
.preprocessor {
  .prep-item {
    &:not(:first-child) {
      margin-top: 10px;
    }
    & > span {
      color: $afterFocus;
      width: 100px;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
