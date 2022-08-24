<template>
  <div id="introduce" class="borbox flex flex-clo flex-ai flex-jcc noselect">
    <span class="title text-xxlarge">欢迎使用JS-Encoder！</span>
    <span class="sub-title text-middle">作为一个在线编辑器，JS-Encoder内置了许多功能，如果你好奇，可以点击下方按钮查看我们的帮助文档</span>
    <el-button type="primary" @click="jumoToDocs">查看文档</el-button>
    <span class="space pointer text-mini" @click="spaceIntroduce">跳过</span>
  </div>
</template>

<script>
import storage from '@utils/localStorage'
export default {
  data() {
    return {}
  },
  methods: {
    jumoToDocs() {
      window.open('http://docs.lliiooiill.cn/')
    },
    spaceIntroduce() {
      this.$emit('spaceIntroduce')
      storage.set('spaceIntroduce', true)
    }
  }
};
</script>
<style lang="scss" scoped>
#introduce {
  width: 100%;
  height: 100%;
  background: $mainColor;
  padding: 25px;
  .title {
    color: $primary;
  }
  .sub-title {
    margin-top: 30px;
    margin-bottom: 60px;
    color: $white;
  }
  .space {
    color: $describe;
    margin-top: 10px;
  }
}
</style>