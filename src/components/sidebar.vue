<template>
  <div class="flex flex-clo" id="sidebar">
    <div class="logo flex flex-ai flex-jcc noselect" @click.stop="showWelcome" title="JS-Encoder">
      <img alt src="../assets/logo.svg" />
    </div>
    <div class="sb-opts">
      <div :key="index" :title="langSbOpt[index]" v-for="(item, index) in optionsList"
        @click.stop="item.children?changeSidebarStatus(item.name, index):openDialog(item.name)">
        <i :class="item.class" class="icon iconfont"></i>
        <transition name="sec-opts-fade">
          <div class="sec-opts flex flex-clo" v-if="item.children" v-show="item.name === currentSecOpt">
            <div :key="i" class="noselect sec-item flex flex-ai" v-for="(chdItem, i) in item.children"
              @click.stop="openDialog(chdItem.name)" title="">
              <i :class="chdItem.class" class="icon iconfont"></i>
              <span>{{ item.name | translateOpt(i) }}</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
let that
export default {
  beforeCreate() {
    that = this
  },
  created() {
    const path = this.$route.name
    this.path = path
    if (path === 'profile') {
      this.optionsList = [
        {
          name: 'newProject',
          class: 'icon-create'
        },
        {
          name: 'personalSetting',
          class: 'icon-zhuti1'
        },
        {
          name: 'language',
          class: 'icon-qiehuan',
          children: [
            {
              name: 'simpleChinese',
              class: 'icon-zhongwen'
            },
            {
              name: 'english',
              class: 'icon-yingwen'
            }
          ]
        },
        {
          name: 'newFeature',
          class: 'icon-xin'
        },
        {
          name: 'github',
          class: 'icon-github'
        },
        {
          name: 'logOut',
          class: 'icon-dengchu1'
        }
      ]
    }
  },
  data() {
    return {
      optionsList: [
        {
          name: 'config',
          class: 'icon-gongju',
          children: [
            {
              name: 'preprocessor',
              class: 'icon-shalou'
            },
            {
              name: 'library',
              class: 'icon-ku'
            },
            {
              name: 'more',
              class: 'icon-qita'
            }
          ]
        },
        {
          name: 'uploadDownload',
          class: 'icon-shangchuanxiazai',
          children: [
            {
              name: 'upload',
              class: 'icon-feiji'
            },
            {
              name: 'download',
              class: 'icon-xiazai'
            }
          ]
        },
        {
          name: 'color',
          class: 'icon-yanse',
          children: [
            {
              name: 'switch',
              class: 'icon-zhuanhuan'
            },
            {
              name: 'select',
              class: 'icon-huabi'
            }
          ]
        },
        {
          name: 'language',
          class: 'icon-qiehuan',
          children: [
            {
              name: 'simpleChinese',
              class: 'icon-zhongwen'
            },
            {
              name: 'english',
              class: 'icon-yingwen'
            }
          ]
        },
        {
          name: 'newFeature',
          class: 'icon-xin'
        },
        {
          name: 'question',
          class: 'icon-bangzhu',
          children: [
            {
              name: 'shortcut',
              class: 'icon-kuaijiejian'
            },
            {
              name: 'feedback',
              class: 'icon-fankui'
            }
          ]
        },
        {
          name: 'github',
          class: 'icon-github'
        }
      ],
      path: '',
      isShowSidebar: false
    }
  },
  computed: {
    ...mapState({
      language: 'language',
      currentSecOpt: 'currentSecOpt',
      currentTab: 'currentTab'
    }),
    langSbOpt() {
      const path = this.path
      const language = window.Global.language
      const finOpt = path === 'profile' ? language.userSbOpt : language.sbOpt
      return finOpt
    },
    langSecSbOpt() {
      return window.Global.language.secSbOpt
    }
  },
  filters: {
    // filters中this的指向并非vue实例
    translateOpt(value, i) {
      const lang = window.Global.language.secSbOpt
      switch (value) {
        case 'config':
          return lang.conf[i]
        case 'uploadDownload':
          return lang.ud[i]
        case 'color':
          return lang.color[i]
        case 'language':
          return lang.lang[i]
        case 'question':
          return lang.help[i]
      }
    }
  },
  methods: {
    changeSidebarStatus(optionName) {
      const commit = this.$store.commit
      commit('updateCurrentSecOpt', optionName)
      // 显示遮罩层，因为点击iframe不会使二级菜单消失
      commit('updateIframeScreen', true)
    },
    showWelcome() {
      // 显示欢迎窗口
      const commit = this.$store.commit
      this.openDialog('welcome')
      commit('updateShowBg', true)
    },
    openDialog(optName) {
      const commit = this.$store.commit
      switch (optName) {
        case 'simpleChinese':
          if (this.language !== 'zh') commit('updateLang', 'zh')
          this.showNotify('语言已切换至中文')
          break
        case 'english':
          if (this.language !== 'en') commit('updateLang', 'en')
          this.showNotify('Switch to English')
          break
        case 'github':
          window.open('https://github.com/Longgererer/JS-Encoder')
          break
        default: {
          commit('updateShowBg', true)
          commit('updateCurrentDialog', optName)
        }
      }
      // 关闭二级菜单
      commit('updateCurrentSecOpt', '')
    },
    showNotify(message) {
      this.$notify({
        message,
        position: 'bottom-right',
        showClose: false,
        iconClass: 'icon iconfont icon-success success',
        duration: 1000
      })
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/sidebar.scss" scoped></style>
<style lang="scss" scoped>
.sec-opts-fade-enter-active,
.sec-opts-fade-leave-active {
  @include setTransition(all, 0.3s, ease);
}
.sec-opts-fade-enter,
.sec-opts-fade-leave-active {
  opacity: 0;
  transform: scale(0.8);
  visibility: hidden;
}
#sidebar {
  @include setWAndH(50px, 100%);
  @include setTransition(all, 0.3s, ease);
  background-color: $primaryHued;
  box-shadow: 0px 0px 5px 0px $dominantHue;
  position: relative;
  .logo {
    cursor: pointer;
    @include setWAndH(100%, 50px);
    img {
      @include setWAndH(30px, 30px);
    }
  }
  .sb-opts {
    & > div {
      @include setWAndH(100%, 50px);
      position: relative;
      cursor: pointer;
      & > i {
        @include setWAndH(100%, 100%);
        @include setTransition(all, 0.3s, ease);
        display: block;
        color: $beforeFocus;
        font-size: 30px;
        line-height: 50px;
        text-align: center;
        &:hover {
          background-color: $dominantHue;
          color: $afterFocus;
        }
      }
      .sec-opts {
        position: absolute;
        z-index: 10;
        top: 0;
        left: calc(100% + 5px);
        background-color: $primaryHued;
        border-radius: 5px;
        box-shadow: 0px 0px 5px 0px $dominantHue;
        transform-origin: top left;
        .sec-item {
          @include setTransition(all, 0.3s, ease);
          box-sizing: border-box;
          padding: 10px;
          color: $beforeFocus;
          font-size: 12px;
          font-weight: 600;
          &:hover {
            background-color: $dominantHue;
            color: $afterFocus;
          }
          & > i {
            font-size: 20px;
            font-weight: normal;
            margin-right: 5px;
          }
          & > span {
            white-space: nowrap;
            display: inline-block;
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>
