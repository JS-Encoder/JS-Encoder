<template>
  <div id="preprocessor">
    <div v-for="(item, index) in prep" :key="index" class="prep flex flex-ai">
      <span class="prep-title">{{ item.title }}：</span>
      <el-select @change="prepChange(item.value, index)" placeholder="none" size="small" v-model="item.value">
        <el-option :key="ind" :label="i" :value="i" v-for="(i, ind) in item.options"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as judge from '@/utils/judgeMode'
export default {
  computed:{
    ...mapState({
      preprocess: 'preprocess',
    }),
    prep() {
      return [
        {
          title: 'HTML',
          value: this.preprocess[0],
          options: ['HTML', 'Markdown']
        },
        {
          title: 'CSS',
          value: this.preprocess[1],
          options: ['CSS', 'Sass', 'Scss', 'Less', 'Stylus']
        },
        {
          title: 'JavaScript',
          value: this.preprocess[2],
          options: ['JavaScript', 'TypeScript', 'CoffeeScript']
        }
      ]
    }
  },
  methods: {
    prepChange(newPrep, index) {
      const commit = this.$store.commit
      commit('updatePreprocess', {
        index,
        newPrep: this.prep[index].value
      })
      const currentTab = this.$store.state.currentTab
      if (judge.judgeMode(currentTab) === judge.judgeMode(newPrep)) {
        commit('updateCurrentTab', newPrep)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#preprocessor {
  .prep {
    @include setWAndH(100%, 30px);
    margin: 10px 0;
    .prep-title {
      @include setWAndH(100px);
      color: $afterFocus;
    }
    .el-select {
      @include setWAndH(calc(100% - 100px));
    }
  }
}
</style>