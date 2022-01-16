<template>
  <el-dialog @close="closeDialog()" :visible="isDialogVisible" :title="templatesLang.title">
    <div class="templates">
      <span class="title">{{ templatesLang.describe }}</span>
      <div class="template-list">
        <div
          class="template pointer flex flex-clo flex-ai flex-jcc"
          v-for="template in templateList"
          :key="template.label"
          @click="selectTemplate(template.label)"
        >
          <img :src="`${cdnPath}/${template.svgName}.svg`" :alt="template.label" />
          <span class="name">{{ template.label }}</span>
        </div>
      </div>
      <div class="bottom-tip">
        <el-checkbox v-model="hiddenAutoTmp">{{ templatesLang.show }}</el-checkbox>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { templatesInfo } from '@utils/publicData'
import { images } from '@utils/cdn'
import storage from '@utils/localStorage'
export default {
  data () {
    return {
      name: 'templates',
      cdnPath: images,
      hiddenAutoTmp: false,
      templateList: [
        { label: 'Vanilla', svgName: 'Vanilla' },
        { label: 'Vue2', svgName: 'Vue' },
        { label: 'Vue3', svgName: 'Vue' },
        { label: 'React', svgName: 'React' },
        { label: 'Angular', svgName: 'Angular' },
        // { label: 'Svelte', svgName: 'Svelte' },
      ]
    }
  },
  computed: {
    ...mapState(['visibleDialog', 'language']),
    templatesLang () {
      return this.$t('dialogs').templates
    },
    isDialogVisible () {
      return this.visibleDialog === this.name
    },
  },
  watch: {
    isDialogVisible(newState){
      if (newState) {
        this.hiddenAutoTmp = !!storage.get('hiddenAutoTmp')
      }
    }
  },
  methods: {
    ...mapMutations([
      'handleDialogState',
      'handleShouldResetCode',
      'handleAllPreprocessor',
      'handleAllInstancesCode',
      'handleCurrentTab',
      'handleAllInstanceExtLinks'
    ]),
    closeDialog () {
      storage.set('hiddenAutoTmp', this.hiddenAutoTmp)
      this.handleDialogState('')
    },
    selectTemplate (template) {
      const { preprocessor, links, code } = templatesInfo[template]
      this.handleAllPreprocessor(preprocessor)
      this.handleCurrentTab(preprocessor[0])
      this.handleAllInstanceExtLinks(links)
      this.handleAllInstancesCode(code)
      this.handleShouldResetCode(true)
      this.closeDialog()
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  width: 500px !important;
  color: $afterFocus;
  max-height: 450px;
  .el-dialog__body {
    padding-top: 0 !important;
  }
  .templates {
    color: $afterFocus;
    .template-list {
      margin-top: 15px;
      display: grid;
      grid-template-columns: repeat(4, 100px);
      grid-template-rows: repeat(2, 120px);
      gap: 15px;
      .template {
        border-radius: 4px;
        color: $beforeFocus;
        background-color: $secondColor;
        @include setTransition(all, 0.2s, ease);
        img {
          width: 50px;
        }
        .name {
          margin-top: 10px;
        }
        &:hover {
          background-color: $deepBlue;
          color: $afterFocus;
        }
      }
    }
    .bottom-tip {
      margin-top: 15px;
      text-align: right;
    }
  }
}
</style>
