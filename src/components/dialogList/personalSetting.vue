<template>
  <div id="personalSetting">
    <div class="clear-cookie flex flex-clo">
      <span class="title">{{langPersonal.clearLocal}}</span>
      <span class="describe">{{langPersonal.clearDescribe}}</span>
      <div class="flex flex-ai">
        <button class="btn-def" @click="clearCookie">{{langPersonal.clearBtn}}</button>
        <span class="describe" v-show="showCleared">{{langPersonal.clearInfo}}</span>
      </div>
    </div>
    <div class="def-prep flex flex-clo">
      <span class="title">{{langPersonal.defaultPrep}}</span>
      <div v-for="(item, index) in prep" :key="index" class="prep flex flex-ai">
        <span class="prep-title">{{ item.title }}：</span>
        <el-select @change="defPrepChange(item.value, index)" placeholder="none" size="small" v-model="item.value">
          <el-option :key="ind" :label="i" :value="i" v-for="(i, ind) in item.options"></el-option>
        </el-select>
      </div>
    </div>
    <div class="def-code flex flex-clo">
      <span class="title">{{langPersonal.defaultCode}}</span>
      <div v-for="(item, index) in defaultCode" :key="index" class="code flex flex-clo">
        <span class="code-title">{{index}}：</span>
        <el-input class="code-input" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
          :placeholder="langPersonal.codePlaceholder" v-model="defaultCode[index]">
        </el-input>
      </div>
    </div>
  </div>
</template>

<script>
import handleCookie from '@/utils/handleCookie'
export default {
  data() {
    return {
      preprocess: ['HTML', 'CSS', 'JavaScript'],
      defaultCode: {
        HTML: '',
        CSS: '',
        JavaScript: ''
      },
      showCleared: false
    }
  },
  mounted() {
    this.initPersonalSetting()
  },
  computed: {
    langPersonal() {
      return window.Global.language.dialogInfo.personalSetting
    },
    prep() {
      return [
        {
          title: 'HTML',
          value: this.preprocess[0],
          options: ['HTML', 'MarkDown']
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
    defPrepChange(val, index) {
      this.$set(this.preprocess, index, val)
    },
    clearCookie() {
      // 清除所有cookie
      handleCookie.deleteCookie('defaultCode')
      handleCookie.deleteCookie('preprocess')
      handleCookie.deleteCookie('qnyToken')
      this.initPersonalSetting()
      this.showCleared = true
    },
    initPersonalSetting() {
      // 从cookie初始化设置
      let defaultCode = handleCookie.getCookieValue('defaultCode')
      let preprocess = handleCookie.getCookieValue('preprocess')
      if (!defaultCode) {
        defaultCode = {
          HTML: '',
          CSS: '',
          JavaScript: ''
        }
      } else defaultCode = JSON.parse(defaultCode)
      if (!preprocess) {
        preprocess = ['HTML', 'CSS', 'JavaScript']
      } else preprocess = JSON.parse(preprocess)
      this.defaultCode = defaultCode
      this.preprocess = preprocess
    }
  },
  beforeDestroy() {
    // 销毁组件前将设置储存到cookie，有效期10年
    const defaultCode = JSON.stringify(this.defaultCode)
    const preprocess = JSON.stringify(this.preprocess)
    handleCookie.setCookie('defaultCode', defaultCode, 365 * 10)
    handleCookie.setCookie('preprocess', preprocess, 365 * 10)
  }
}
</script>

<style lang="scss" scoped>
#personalSetting {
  .btn-def {
    width: 100px;
    padding: 5px;
    margin: 10px 10px 0 5px;
  }
  .clear-cookie,
  .def-prep,
  .def-code {
    .title {
      font-weight: 600;
      font-size: 17px;
      color: $afterFocus;
      margin-top: 10px;
    }
    .describe {
      font-size: 12px;
      color: $describe;
      margin-top: 5px;
    }
  }
  .def-prep {
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
  .def-code {
    .code {
      .code-title {
        @include setWAndH(100px);
        color: $afterFocus;
        margin-top: 10px;
        margin-bottom: 5px;
      }
      .code-input >>> .el-textarea__inner {
        background-color: $deepColor;
        color: #c39162;
        font-family: Consolas, 'Courier New', monospace;
      }
    }
  }
}
</style>
