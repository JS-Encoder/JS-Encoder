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
          <svg class="icon" aria-hidden="true">
            <use v-bind:xlink:href="`#${template.svgName}`" />
          </svg>
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
import storage from '@utils/localStorage'
export default {
  data () {
    return {
      name: 'templates',
      hiddenAutoTmp: false,
      templateList: [
        { label: 'Vanilla', svgName: 'icon-javascript' },
        { label: 'Vue2', svgName: 'icon-vue' },
        { label: 'Vue3', svgName: 'icon-vue' },
        { label: 'Vue2 CPNT', svgName: 'icon-vue' },
        { label: 'Vue3 CPNT', svgName: 'icon-vue' },
        { label: 'React', svgName: 'icon-react' },
        { label: 'Angular', svgName: 'icon-angular' },
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
    isDialogVisible (newState) {
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
      'handleAllInstanceExtLinks',
      'handleCpntCode',
      'handleCpntMode',
      'handleCpntName'
    ]),
    closeDialog () {
      storage.set('hiddenAutoTmp', this.hiddenAutoTmp)
      this.handleDialogState('')
    },
    selectTemplate (template) {
      switch (template) {
        case 'Vue2 CPNT':
        case 'Vue3 CPNT': {
          const { links, code } = templatesInfo[template]
          this.handleAllInstanceExtLinks(links)
          this.handleCpntCode(code)
          this.handleCpntMode(true)
          this.handleCpntName(template.replace(/ CPNT/, ''))
          this.handleShouldResetCode(true)
          break
        }
        default: {
          const { preprocessor, links, code } = templatesInfo[template]
          this.handleAllPreprocessor(preprocessor)
          this.handleCurrentTab(preprocessor[0])
          this.handleAllInstanceExtLinks(links)
          this.handleAllInstancesCode(code)
          this.handleCpntMode(false)
          this.handleShouldResetCode(true)
        }
      }
      this.$nextTick(() => {
        this.handleShouldResetCode(false)
      })
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
        .icon {
          width: 50px;
          height: 50px;
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
