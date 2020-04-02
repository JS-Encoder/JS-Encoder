<template>
  <div id="library" class="flex flex-clo">
    <div class="css-lib flex flex-clo">
      <span class="title">{{ libraryInfo.cssTitle }}</span>
      <span class="describe">{{ libraryInfo.cssDescribe }}</span>
      <el-select :loading="loading" :remote-method="remoteLink" @change="addSearchLink" class="search-url" filterable
        loading-text="loading" placeholder="none" remote size="small" v-model="chooseLink">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in cssOptions"></el-option>
      </el-select>
      <div :key="index" class="css-in flex flex-ai" v-for="(item, index) in showCssInput">
        <el-input placeholder="Link" size="small" v-model="cssLinks[index]"></el-input>
        <i @click="delCssLink(index)" class="icon iconfont icon-close"></i>
      </div>
      <div @click="showCssInput++" class="add-link btn-def flex flex-ai flex-jcc">
        {{ libraryInfo.add }}＋
      </div>
    </div>
    <div class="js-lib flex flex-clo">
      <span class="title">{{ libraryInfo.jsTitle }}</span>
      <span class="describe">{{ libraryInfo.jsDescribe }}</span>
      <el-select :loading="loading" :remote-method="remoteCDN" @change="addSearchCDN" class="search-url" filterable
        loading-text="loading" placeholder="none" remote size="small" v-model="chooseCDN">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in jsOptions"></el-option>
      </el-select>
      <div :key="index" class="cdn-in flex flex-ai" v-for="(item, index) in showCdnInput">
        <el-input placeholder="CDN" size="small" v-model="cdnJs[index]"></el-input>
        <i @click="delCDN(index)" class="icon iconfont icon-close"></i>
      </div>
      <div @click="showCdnInput++" class="add-link btn-def flex flex-ai flex-jcc">
        {{ libraryInfo.add }}＋
      </div>
    </div>
  </div>
</template>

<script>
import { CDN, Link } from '@/utils/selectableUrl'
export default {
  data(){
    return {
      cdnJs: [],
      cssLinks: [],
      cssUrlList: [],
      jsUrlList: [],
      chooseCDN: '',
      chooseLink: '',
      cssOptions: [],
      jsOptions: [],
      showCdnInput: 1,
      showCssInput: 1,
      loading: false
    }
  },
  mounted() {
    this.cssUrlList = this.link().map(item => {
      return { value: item, label: item }
    })
    this.jsUrlList = this.cdn().map(item => {
      return { value: item, label: item }
    })
    const state = this.$store.state
    this.cssLinks = state.linkList
    this.cdnJs = state.CDNList
    this.showCssInput = state.linkList.length
    this.showCdnInput = state.CDNList.length
  },
  beforeDestroy(){
    // 将外部链接更新到state
    const commit = this.$store.commit
    const cdnJs = this.cdnJs
    const cssLinks = this.cssLinks
    commit('updateCdnJS',cdnJs)
    commit('updateLinkList',cssLinks)
  },
  computed:{
    libraryInfo(){
      return window.Global.language.dialogInfo.library
    }
  },
  methods: {
    delCDN(index) {
      if (this.showCdnInput > 1) this.showCdnInput--
      this.cdnJs.splice(index, 1)
    },
    delCssLink(index) {
      if (this.showCssInput > 1) this.showCssInput--
      this.cssLinks.splice(index, 1)
    },
    cdn() {
      const arr = []
      for (let i in CDN) {
        arr.push(i.replace('_', '-'))
      }
      return arr
    },
    link() {
      const arr = []
      for (let i in Link) {
        arr.push(i.replace('_', '-'))
      }
      return arr
    },
    addSearchLink() {
      const link = Link[this.chooseLink.replace('-', '_')]
      const cssLinks = this.cssLinks
      const index = this.checkInputContent(cssLinks)
      if (index !== null) {
        cssLinks[index] = link
      } else {
        cssLinks.push(link)
        if(cssLinks.length > this.showCssInput) this.showCssInput++
      }
    },
    addSearchCDN() {
      const cdn = CDN[this.chooseCDN.replace('-', '_')]
      const cdnJs = this.cdnJs
      const index = this.checkInputContent(cdnJs)
      if (index !== null) {
        cdnJs[index] = cdn
      } else {
        cdnJs.push(cdn)
        if(cdnJs.length > this.showCdnInput) this.showCdnInput++
      }
    },
    remoteCDN(query) {
      this.remoteMethod(query, 'jsOptions', this.jsUrlList)
    },
    remoteLink(query) {
      this.remoteMethod(query, 'cssOptions', this.cssUrlList)
    },
    remoteMethod(query, options, list) {
      if (query !== '') {
        this.loading = true
        setTimeout(() => {
          this.loading = false
          this[options] = list.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
          })
        }, 200)
      } else {
        this[options] = []
      }
    },
    checkInputContent(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '') return i
      }
      return null
    }
  }
}
</script>

<style lang="scss" scoped>
#library {
  .css-lib,
  .js-lib {
    .title {
      font-weight: 600;
      font-size: 17px;
      color: $afterFocus;
      margin-top: 5px;
    }
    .describe {
      font-size: 12px;
      color: $describe;
      margin-top: 5px;
    }
    .search-url {
      @include setWAndH(250px, 30px);
      margin-top: 5px;
    }
    .css-in,
    .cdn-in {
      margin-top: 5px;
      & > i {
        @include setTransition(all, 0.3s, ease);
        color: $beforeFocus;
        font-size: 12px;
        margin-left: 5px;
        &:hover {
          color: $afterFocus;
        }
      }
    }
    .add-link {
      @include setWAndH(200px, 25px);
      @include setTransition(all, 0.3s, ease);
      font-size: 14px;
      margin-top: 5px;
    }
  }
}
</style>