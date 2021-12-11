<template>
  <div id="sidebar" class="borbox">
    <div class="tool-list">
      <el-tooltip :visible-arrow="false" v-for="(item, index) in iconList" :key="index" :content="sidebarLang[index]"
        placement="right">
        <div class="tool flex flex-ai flex-jcc" @click="handleSidebarOptions(index)">
          <i class="icon iconfont" :class="item"></i>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      iconList: [
        'icon-shalou',
        'icon-ku',
        'icon-kongzhitai',
        'icon-yunduanshangchuan',
        'icon-xiazai1',
        'icon-kuaijiejian1',
        'icon-qiehuan',
        'icon-github',
      ],
      dialogNameList: [
        'preprocessor',
        'library',
        'settings',
        'upload',
        'download',
        'shortcut',
        'language',
        'github',
      ],
    }
  },
  computed: {
    ...mapState(['language']),
    sidebarLang() {
      return this.$t('instance').sidebar
    },
  },
  watch: {
    language(newLang) {
      this.$i18n.locale = newLang
    },
  },
  methods: {
    ...mapMutations(['handleDialogState', 'handleLanguage']),
    handleSidebarOptions(index) {
      const optionName = this.dialogNameList[index]
      switch (optionName) {
        case 'language': {
          const lang = this.language === 'zh' ? 'en' : 'zh'
          this.handleLanguage(lang)
          break
        }
        case 'github':
          window.open('https://github.com/Longgererer/JS-Encoder')
          break
        default:
          this.handleDialogState(optionName)
      }
    },
  },
  components: {},
}
</script>

<style lang="scss" scoped>
#sidebar {
  width: 41px;
  height: 100%;
  background-color: $thirdColor;
  border-right: 1px solid $deep;
  overflow-y: overlay;
  &::-webkit-scrollbar {
    outline: none;
    width: 4px;
    background-color: transparent;
    @include setTransition(all, 0.3s, ease);
  }
  &::-webkit-scrollbar-track {
    background-color: rgba(30, 30, 30, 0);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(80, 80, 80, 0.3);
  }
  &::-webkit-scrollbar-thumb:hover {
    outline: none;
    background-color: rgba(80, 80, 80, 0.7);
  }
  .tool-list {
    width: 100%;
    .tool {
      width: 100%;
      height: 40px;
      cursor: pointer;
      &:hover {
        background-color: $mainColor;
        .icon {
          color: $afterFocus;
        }
      }
      .icon {
        font-size: 24px;
        color: $beforeFocus;
      }
    }
  }
}
</style>
