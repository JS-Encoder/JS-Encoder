<template>
  <div id="instanceHeader" class="flex borbox noselect">
    <div class="logo flex flex-ai flex-jcc flex-sh">
      <img src="../../assets/images/logo.svg" alt="" />
    </div>
    <span class="project-name flex flex-ai flex-jcc">JS Encoder</span>
    <div class="version describe flex flex-ai">v{{projectInfo.version}}</div>
    <div class="flex-1"></div>
    <div class="btn-opts flex flex-ai flex-jcc">
      <a href="https://www.lliiooiill.cn/" target="blank">
        <el-button size="mini" class="pmy-btn">在线版</el-button>
      </a>
    </div>
  </div>
</template>

<script>
import projectInfo from '../../../package.json'
export default {
  data() {
    return {
      instanceName: 'My Instance Name',
      instanceInfo: {
        name: '',
        describe: '',
      },
      isInstanceInfoVisible: false,
      projectInfo
    }
  },
  computed: {
    headerLang() {
      return this.$t('instance').header
    },
  },
  methods: {
    openInstanceInfo() {
      this.instanceInfo.name = this.instanceName
    },
    saveInstanceInfo() {
      this.instanceName = this.instanceInfo.name
      this.isInstanceInfoVisible = false
    },
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
    cursor: pointer;
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
}
</style>
