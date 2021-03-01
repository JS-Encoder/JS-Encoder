<template>
  <el-dialog @close="handleDialogState('')" :visible="visibleDialog === name" :title="prepLang.title">
    <div class="preprocessor flex flex-clo">
      <div class="prep-item flex flex-ai" v-for="(item,index) in prepTitle" :key="index">
        <span class="flex-sh">{{item}}</span>
        <el-select v-model="prep[index]" @change="prepChange(index)">
          <el-option v-for="lang in defPrepOpts[item]" :key="lang" :label="lang" :value="lang"> </el-option>
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
  created() {
    this.prep = [...this.preprocessor]
  },
  computed: {
    ...mapState({
      visibleDialog: 'visibleDialog',
      preprocessor: 'preprocessor',
      currentTab: 'currentTab',
    }),
    prepLang() {
      return this.$t('dialogs').preprocessor
    },
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
/deep/.el-dialog {
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
