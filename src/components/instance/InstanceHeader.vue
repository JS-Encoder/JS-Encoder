<template>
  <div id="instanceHeader" class="flex borbox noselect">
    <div class="logo pointer flex flex-ai flex-jcc flex-sh">
      <img src="../../assets/images/logo.svg" alt="" />
    </div>
    <span class="project-name flex flex-ai flex-jcc">JS Encoder</span>
    <div class="version describe flex flex-ai">v{{projectInfo.version}}</div>
    <div class="flex-1"></div>
    <!-- <div class="btn-opts flex flex-ai flex-jcc">
      <a href="https://www.lliiooiill.cn/" target="blank">
        <el-button size="mini" class="pmy-btn">在线版</el-button>
      </a>
    </div> -->
    <div class="header-side-opts flex">
      <div class="flex flex-ai flex-jcc pointer" v-for="item in sideOpts" :key="item.name" 
      :title="headerLang.sideOpts[item.name]" @click="handleSideOpts(item.name)">
        <div class="badge-dot" v-if="!isLogReaded"></div>
        <i class="icon iconfont" :class="item.class"></i>
      </div>
    </div>
  </div>
</template>

<script>
import projectInfo from '../../../package.json'
import { get } from '@utils/axiosApi'
import storage from '@utils/localStorage'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      projectInfo,
      sideOpts: [
        {
          name: 'versionLogs',
          class: 'icon-dengpao'
        }
      ],
      // 用户是否查看过新版本特性
      isLogReaded: true
    }
  },
  created() {
    this.compareVersions()
  },
  watch: {
    visibleDialog(newVal) {
      if (newVal === 'versionLogs') {
        this.isLogReaded = true
      }
    }
  },
  computed: {
    ...mapState(['visibleDialog']),
    headerLang() {
      return this.$t('instance').header
    },
  },
  methods: {
    ...mapMutations(['handleDialogState']),
    async compareVersions() {
      // 获取本地的version和github上最新的version，如果不同就显示提示圆点
      const { tag_name: githubV } = await get('/githubApi/repositories/190842308/releases/latest')
      const version = storage.get('version')
      if (githubV !== version) {
        this.isLogReaded = false
      }
    },
    handleSideOpts(name) {
      switch(name) {
        case 'versionLogs': {
          this.handleDialogState(name)
          break
        }
      }
    }
  },
}
</script>

<style lang="scss">
.el-popover {
  background-color: $secondColor !important;
  .popper__arrow {
    border-bottom-color: $secondColor !important;
  }
}
</style>
<style lang="scss" scoped>
/* main style */
@include keyframes(save-btn) {
  0%,
  100% {
    color: $primary;
    border-color: $primary;
  }
  50% {
    color: $beforeFocus;
    border-color: transparent;
  }
}
#instanceHeader {
  width: 100%;
  height: 41px;
  background-color: $thirdColor;
  border-bottom: 1px solid $deep;
  position: relative;
  .logo {
    width: 40px;
    img {
      width: 25px;
      height: 25px;
    }
  }
  .project-name {
    color: $lightCyan;
    margin-left: 5px;
  }
  .version {
    margin-left: 5px;
  }
  .btn-opts {
    padding: 0 5px;
  }
  .header-side-opts {
    & > div {
      width: 40px;
      color: $beforeFocus;
      @include setTransition(all, 0.3s, ease);
      &:hover {
        color: $afterFocus;
      }
      i {
        font-size: 24px;
      }
    }
  }
  .badge-dot {
    border-radius: 50%;
    height: 8px;
    width: 8px;
    background-color: $primary;
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>
