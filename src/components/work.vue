<template>
  <div class="work flex flex-clo">
    <img alt src="../../static/images/1.jpg" />
    <div class="project-info flex flex-ai">
      <div v-if="showInput">
        <input @blur="updateName" class="name-input" type="text" v-focus="isFocus" v-model="info.name" />
        <div class="input-box"></div>
      </div>
      <span class="project-name" v-if="!showInput">{{info.name}}</span>
      <i @click="changeName" class="icon iconfont icon-pencil rename" style="font-size:14px" v-if="!showInput"></i>
      <el-dropdown class="dropdown-menu" trigger="click" placement="top-end">
        <i class="icon iconfont icon-gengduo more" style="font-size:25px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="icon iconfont icon-recycle">delete</el-dropdown-item>
          <el-dropdown-item icon="icon iconfont icon-editor">edit</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: Object
  },
  data() {
    return {
      showInput: false,
      isFocus: false
    }
  },
  methods: {
    changeName() {
      this.showInput = true
      this.isFocus = true
    },
    updateName() {
      this.isFocus = false
      this.showInput = false
    }
  }
}
</script>
<style lang="scss" scoped>
@media screen and (min-width: 1700px) {
  .work {
    width: 300px !important;
    height: 240px !important;
  }
}
.work {
  @include setWAndH(250px, 200px);
  margin: 50px 20px 20px 20px;
  background-color: $dominantHue;
  border-radius: 5px;
  transition: all 0.3s ease;
  overflow: hidden;
  &:hover {
    box-shadow: 0 10px 10px #bebebe;
  }
  img {
    @include setWAndH(100%, calc(100% - 50px));
  }
  .project-info {
    position: relative;
    padding: 10px;
    box-sizing: border-box;
    @include setWAndH(100%, 50px);
    color: $primaryHued;
    font-size: 16px;
    i {
      padding: 10px;
      color: $describe;
      transition: all 0.3s ease;
      cursor: pointer;
      &:hover {
        color: $primaryHued;
      }
    }
    .dropdown-menu {
      position: absolute;
      right: 0;
    }
    .input-box {
      width: 0;
      border-bottom: 1px solid $describe;
      transition: all 0.3s ease;
    }
    .name-input {
      width: 200px;
      border: none;
      outline: none;
      color: $primaryHued;
      font-size: 16px;
      font-family: $josefinSans;
      background-color: transparent;
    }
    .name-input:focus + .input-box {
      width: 200px;
    }
  }
}
</style>