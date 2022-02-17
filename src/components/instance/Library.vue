<template>
  <el-dialog id="library" @close="closeDialog()" :visible="isDialogVisible" :title="libraryLang.title">
    <div class="external-style flex flex-clo">
      <span class="title">{{ libraryLang.style.title }}</span>
      <span class="describe">{{ libraryLang.style.describe }}</span>
      <el-select class="search-input" filterable remote :remote-method="(query) => {searchLibs(query, 'css')}"
        @change="addLink('css')" :placeholder="libraryLang.style.searchPlaceHolder" :loading="loading"
        :no-match-text="libraryLang.empty" :loading-text="libraryLang.loading" v-model="currentLib">
        <el-option v-for="item in cssSearchList" :label="item.name" :key="item.name" :value="item.latest">
          <div class="flex">
            <span style="margin-right:20px" class="flex-1">{{ item.name }}</span>
            <span class="describe flex-sh">V{{ item.version }}</span>
          </div>
        </el-option>
      </el-select>
      <el-input :key="index" class="link-input" v-for="(item, index) in showCssInput" v-model="cssUseList[index]">
        <div slot="prepend" class="prepend flex flex-clo flex-ai flex-jcc">
          <i class="flex-1 el-icon-arrow-up" :class="index===0?'disable':''"
            @click="index!==0?resort(index,'up','css'):''"></i>
          <i class="flex-1 el-icon-arrow-down" :class="index===showCssInput-1?'disable':''"
            @click="index!==showCssInput-1?resort(index,'down','css'):''"></i>
        </div>
        <div slot="append" class="append">
          <i class="el-icon-close" @click="delLink('css', index)"></i>
        </div>
      </el-input>
      <el-button @click="showCssInput++" class="def-btn add">{{libraryLang.style.add}}</el-button>
    </div>
    <div class="external-script flex flex-clo">
      <span class="title">{{ libraryLang.script.title }}</span>
      <span class="describe">{{ libraryLang.script.describe }}</span>
      <el-select class="search-input" filterable remote :remote-method="(query) => {searchLibs(query, 'js')}"
        @change="addLink('js')" :placeholder="libraryLang.style.searchPlaceHolder" :loading="loading"
        :no-match-text="libraryLang.empty" :loading-text="libraryLang.loading" v-model="currentLib">
        <el-option v-for="item in jsSearchList" :label="item.name" :key="item.name" :value="item.latest">
          <span style="margin-right:20px">{{ item.name }}</span>
          <span class="describe">V{{ item.version }}</span>
        </el-option>
      </el-select>
      <el-input :key="index" class="link-input" v-for="(item, index) in showJSInput" v-model="jsUseList[index]">
        <div slot="prepend" class="prepend flex flex-clo flex-ai flex-jcc">
          <i class="flex-1 el-icon-arrow-up" :class="index===0?'disable':''"
            @click="index!==0?resort(index,'up','js'):''"></i>
          <i class="flex-1 el-icon-arrow-down" :class="index===showJSInput-1?'disable':''"
            @click="index!==showJSInput-1?resort(index,'down','js'):''"></i>
        </div>
        <div slot="append" class="append" @click="delLink('js', index)">
          <i class="el-icon-close"></i>
        </div>
      </el-input>
      <el-button @click="showJSInput++" class="def-btn add">{{libraryLang.script.add}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { get } from '@utils/axiosApi'
import { httpUrl } from '@utils/regExpList'
export default {
  data() {
    return {
      name: 'library',
      currentLib: '',
      loading: false,
      // total list of cdn
      cssLibList: [],
      jsLibList: [],
      // collection of which match the condition
      cssSearchList: [],
      jsSearchList: [],
      // applied cdn list
      cssUseList: [],
      jsUseList: [],
      showCssInput: 1,
      showJSInput: 1,
      limit: 10,
    }
  },
  created() {
    this.loadLibs()
    this.setLibs()
  },
  computed: {
    ...mapState(['visibleDialog', 'instanceExtLinks', 'language']),
    libraryLang() {
      return this.$t('dialogs').library
    },
    isDialogVisible() {
      return this.visibleDialog === this.name
    },
  },
  watch: {
    isDialogVisible(newState) {
      if (newState) this.setLibs()
    },
  },
  methods: {
    ...mapMutations(['handleDialogState', 'handleAllInstanceExtLinks']),
    searchLibs(query, fileType) {
      /**
       * Filter libraries according to name
       * 根据名字过滤库
       */
      this.loading = true
      setTimeout(() => {
        let list = fileType === 'css' ? this.cssLibList : this.jsLibList
        let tempList = list.filter((item) => {
          return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1
        })
        const limit = this.limit
        if (tempList.length > limit) {
          tempList = tempList.slice(0, limit)
        }
        if (fileType === 'css') {
          this.cssSearchList = tempList
        } else {
          this.jsSearchList = tempList
        }
        this.loading = false
      }, 200)
    },
    loadLibs() {
      /**
       * Request cdnJS to get the name and version of libraries
       * 请求cdnJS获取库的名字和版本
       */
      get('/qiNiuCdn/cdn.json')
        .then((res) => {
          const list = res.results
          this.cssLibList = list.filter((item) => item.fileType === 'css')
          this.jsLibList = list.filter((item) => item.fileType === 'js')
        })
        .catch((err) => {
          console.log(err)
          let title, content, retry
          if (this.language === 'zh') {
            title = '网络错误'
            content = '尝试请求cdnjs失败，'
            retry = '点击重试>>'
          } else {
            title = 'Network error'
            content = 'Attempt to request cdnjs failed,'
            retry = 'retry>>'
          }
          const h = this.$createElement
          this.notifyInstance = this.$notify.error({
            title,
            message: h('div', {}, [
              h('span', {}, content),
              h(
                'a',
                {
                  on: {
                    click: () => {
                      this.notifyInstance.close()
                      this.notifyInstance = null
                      this.loadLibs()
                    },
                  },
                },
                retry
              ),
            ]),
            duration: 0,
            position: 'bottom-right',
            offset: 5,
            dangerouslyUseHTMLString: true,
            onClose: () => {
              this.notifyInstance = null
            },
          })
        })
    },
    setLibs() {
      const { cssLinks, JSLinks } = this.instanceExtLinks
      this.cssUseList = cssLinks
      this.jsUseList = JSLinks
      this.showCssInput = cssLinks.length
      this.showJSInput = JSLinks.length
    },
    addLink(type) {
      if (type === 'css') {
        this.cssSearchList = []
        const list = this.cssUseList
        const index = this.findBlankElement(list)
        if (index !== null) {
          list[index] = this.currentLib
        } else {
          list.push(this.currentLib)
          if (list.length > this.showCssInput) this.showCssInput++
        }
      } else {
        this.jsSearchList = []
        const list = this.jsUseList
        const index = this.findBlankElement(list)
        if (index !== null) {
          list[index] = this.currentLib
        } else {
          list.push(this.currentLib)
          if (list.length > this.showJSInput) this.showJSInput++
        }
      }
      this.currentLib = ''
    },
    delLink(type, index) {
      if (type === 'css') {
        if (this.showCssInput > 0) this.showCssInput--
        this.cssUseList.splice(index, 1)
      } else {
        if (this.showJSInput > 0) this.showJSInput--
        this.jsUseList.splice(index, 1)
      }
    },
    findBlankElement(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '') return i
      }
      return null
    },
    resort(index, direction, type) {
      // Change the order of list
      const list = type === 'css' ? this.cssUseList : this.jsUseList
      if (direction === 'up') {
        list.splice(index - 1, 1, ...list.splice(index, 1, list[index - 1]))
      } else {
        list.splice(index + 1, 1, ...list.splice(index, 1, list[index + 1]))
      }
    },
    closeDialog() {
      const { cssUseList, jsUseList } = this
      const cssLinks = [],
        JSLinks = []
      cssUseList.forEach((item) => {
        if (httpUrl.test(item)) cssLinks.push(item)
      })
      jsUseList.forEach((item) => {
        if (httpUrl.test(item)) JSLinks.push(item)
      })
      this.handleAllInstanceExtLinks({ cssLinks, JSLinks })
      this.handleDialogState('')
    },
  },
}
</script>

<style lang="scss" scoped>
/deep/.el-dialog {
  width: 450px !important;
  color: $afterFocus;
  max-height: 450px;
  overflow-y: auto;
  .el-dialog__body {
    padding-top: 0 !important;
  }
  .external-style,
  .external-script {
    .title {
      color: $afterFocus;
    }
    .title,
    .describe {
      margin-bottom: 5px;
    }
    .search-input {
      margin-bottom: 10px;
    }
    .add {
      margin-top: 10px;
    }
    .link-input {
      margin-top: 5px;
    }
    /deep/.el-input {
      .el-input-group__prepend {
        padding: 0;
        .prepend {
          width: 30px;
          i {
            width: 100%;
            font-size: 16px;
            cursor: pointer;
            color: $beforeFocus;
            &::before {
              display: inline-flex;
              justify-content: center;
              width: 100%;
            }
            &:hover {
              color: $afterFocus;
            }
          }
          .disable {
            color: $deep;
            &:hover {
              color: $deep;
            }
          }
        }
      }
      .el-input-group__append {
        padding: 0 10px;
        .append {
          cursor: pointer;
          i {
            font-size: 16px;
            color: $describe;
          }
          &:hover {
            i {
              color: $afterFocus;
            }
          }
        }
      }
    }
  }
  .external-script {
    margin-top: 20px;
  }
}
</style>
