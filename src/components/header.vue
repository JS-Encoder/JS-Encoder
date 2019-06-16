<template>
  <div class="flex flex-ai" id="header">
    <h3 class="header-title">
      <i class="icon iconfont icon-daimahuaban"></i> Compiler ol
    </h3>
    <ul class="header-menu flex">
      <li @click="openPop">
        <i class="icon iconfont icon-config"></i>
      </li>
      <li @click="openPop">
        <i class="icon iconfont icon-help"></i>
      </li>
    </ul>
    <popUp :pop="pop">
      <el-collapse accordion v-model="activeName">
        <el-collapse-item name="1" title="shortcut key">
          <div>CTRL + ALT ---------------------------- Trun on smart tips</div>
        </el-collapse-item>
        <el-collapse-item name="2" title="Feedback">
          <div>1</div>
          <div>1</div>
        </el-collapse-item>
        <el-collapse-item name="3" title="Efficiency">
          <div>1</div>
          <div>1</div>
          <div>1</div>
        </el-collapse-item>
        <el-collapse-item name="4" title="Controllability">
          <div>1</div>
          <div>1</div>
        </el-collapse-item>
      </el-collapse>
    </popUp>
  </div>
</template>
<script>
import popUp from './popUp'
export default {
  data() {
    return {
      pop: {
        isShow: true
      },
      activeName: ''
    }
  },
  components: {
    popUp
  },
  methods: {
    openPop() {
      this.pop.isShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
.el-collapse {
  margin: 20px 0;
  border: none;
}
#header {
  width: 100%;
  height: 50px;
  background-color: #333333;
  padding: 10px 20px;
  border-bottom: 2px solid #1e1e1e;
  box-sizing: border-box;
  position: relative;
  .header-title {
    color: #f2f2f2;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
  .header-menu {
    position: absolute;
    right: 20px;
    li {
      list-style: none;
      margin: 0 15px;
      transition: all 0.3s ease;
      color: #ccc;
      i {
        font-size: 20px;
      }
    }
    li:hover {
      color: #f2f2f2;
    }
  }
}
</style>
