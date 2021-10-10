<template>
  <div id="instanceHeader" class="flex borbox">
    <div class="logo flex flex-ai flex-jcc flex-sh">
      <img src="../../assets/images/logo.svg" alt="" />
    </div>
    <span class="project-name flex flex-ai flex-jcc">JS Encoder</span>
    <!-- <div class="instance-name flex-sh pointer flex" v-popover:popover>
      <span class="inblock text-small">{{ instanceName }}</span>
      <i class="icon iconfont icon-genggai"></i>
    </div> -->
    <!-- <el-popover ref="popover" placement="bottom-start" width="250" trigger="click" @show="openInstanceInfo"
      v-model="isInstanceInfoVisible">
      <div class="flex flex-clo">
        <el-input :placeholder="headerLang.instanceInfo.name" size="small" v-model="instanceInfo.name"></el-input>
        <el-input :placeholder="headerLang.instanceInfo.describe" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
          v-model="instanceInfo.describe" maxlength="150" resize="none" style="font-size: 13px;margin-top: 10px">
        </el-input>
        <el-button class="def-btn save-btn" size="small" style="margin-top: 10px" @click="saveInstanceInfo">
          {{headerLang.instanceInfo.save}}</el-button>
      </div>
    </el-popover> -->
    <div class="flex-1"></div>
    <div class="btn-opts flex flex-ai flex-jcc">
      <a href="https://www.lliiooiill.cn/" target="blank">
        <el-button size="mini" class="pmy-btn">在线版</el-button>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      instanceName: 'My Instance Name',
      instanceInfo: {
        name: '',
        describe: '',
      },
      isInstanceInfoVisible: false,
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
  .btn-opts {
    padding: 0 5px;
  }
  // .instance-name {
  //   color: $beforeFocus;
  //   margin-left: 20px;
  //   @include setTransition(all, 0.3s, ease);
  //   &:hover {
  //     color: $afterFocus;
  //     i {
  //       visibility: visible;
  //     }
  //   }
  //   i {
  //     line-height: 40px;
  //     visibility: hidden;
  //     margin-left: 5px;
  //   }
  //   span {
  //     line-height: 40px;
  //     max-width: 250px;
  //     @include text-ellipsis();
  //   }
  // }
}
</style>
