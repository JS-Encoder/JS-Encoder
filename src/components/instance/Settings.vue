<template>
  <el-dialog @close="closeDialog" :visible="visibleDialog === name" :title="settingsLang.title">
    <div class="delay-time flex flex-clo">
      <span class="title">{{settingsLang.time.title}}</span>
      <span class="describe">{{settingsLang.time.describe}}</span>
      <div>
        <el-input-number v-model="settings.delayTime" :min="200" :step="50"></el-input-number>
        <span class="unit">(ms)</span>
      </div>
    </div>
    <div class="auto-execute flex flex-clo">
      <el-checkbox v-model="settings.autoExecute">{{settingsLang.autoExecute.title}}</el-checkbox>
      <span class="describe">{{settingsLang.autoExecute.describe}}</span>
    </div>
    <div class="auto-complete">
      <el-checkbox v-model="settings.autoComplete">{{settingsLang.autoComplete.title}}</el-checkbox>
    </div>
    <div class="lint flex flex-clo">
      <el-checkbox v-model="settings.lint">{{settingsLang.lint.title}}</el-checkbox>
      <span class="describe">{{settingsLang.lint.describe}}</span>
    </div>
    <div class="line-wrap">
      <el-checkbox v-model="settings.lineWrap">{{settingsLang.lineWrap.title}}</el-checkbox>
    </div>
    <div class="indent flex flex-clo">
      <span class="title">{{settingsLang.indent.title}}</span>
      <el-checkbox v-model="settings.tabIndent">{{settingsLang.indent.tabIndent}}</el-checkbox>
      <span class="title">{{settingsLang.indent.indentSpaces}}: {{settings.indentSpaces}}</span>
      <el-slider :min="0" :max="8" :step="2" show-stops v-model="settings.indentSpaces"></el-slider>
    </div>
    <div class="fonts">
      <span class="title">{{settingsLang.fonts.title}}</span>
      <div class="font-family flex flex-ai">
        <span class="title flex-sh">{{settingsLang.fonts.fontFamily}}</span>
        <el-select v-model="settings.fontFamily">
          <el-option v-for="font in fontList" :key="font.name" :label="font.name" :value="font.name"></el-option>
        </el-select>
      </div>
      <div class="font-size flex flex-ai">
        <span class="title flex-sh">{{settingsLang.fonts.fontSize}}</span>
        <div>
          <el-input-number controls-position="right" :min="12" v-model="settings.fontSize"></el-input-number>
          <span class="unit">(px)</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { fontList } from '@utils/publicData.js'
export default {
  data() {
    return {
      name: 'settings',
      settings: {
        delayTime: 500,
        autoExecute: true,
        autoComplete: true,
        tabIndent: true,
        lint: true,
        lineWrap: true,
        indentSpaces: 2,
        fontFamily: 'Consolas',
        fontSize: 14,
      },
      fontList,
    }
  },
  created() {
    this.settings = this.instanceSetting
  },
  computed: {
    ...mapState(['visibleDialog', 'instanceSetting']),
    settingsLang() {
      return this.$t('dialogs').settings
    },
  },
  methods: {
    ...mapMutations(['handleDialogState', 'handleAllInstanceSetting']),
    closeDialog() {
      const settings = this.settings
      this.handleAllInstanceSetting(settings)
      this.handleDialogState('')
    },
  },
}
</script>

<style lang="scss" scoped>
/* main style */
/deep/.el-dialog {
  width: 450px !important;
  max-height: 500px;
  overflow-y: auto;
  .el-dialog__body {
    padding-top: 0 !important;
  }
}
/deep/.el-checkbox {
  .el-checkbox__label {
    color: $afterFocus !important;
  }
}
.delay-time {
  .title {
    color: $afterFocus;
  }
  .title,
  .describe {
    margin-bottom: 5px;
  }
  .unit {
    margin-left: 5px;
    color: $beforeFocus;
  }
}
.auto-execute,
.lint {
  .describe {
    margin-top: 5px;
  }
}
.auto-execute,
.auto-complete,
.lint,
.line-wrap {
  margin-top: 15px;
}
.indent {
  margin-top: 15px;
  .title {
    color: $afterFocus;
    margin-bottom: 10px;
  }
  .el-checkbox {
    margin-bottom: 10px;
  }
}
.fonts {
  .title {
    color: $afterFocus;
  }
  .font-family,
  .font-size {
    margin-top: 10px;
    .title {
      width: 100px;
    }
    .unit {
      margin-left: 5px;
      color: $beforeFocus;
    }
  }
}
</style>
