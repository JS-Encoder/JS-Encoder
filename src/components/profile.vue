<template>
  <div class="profile">
    <fixedSlider :sliderConf="sliderConf"></fixedSlider>
  </div>
</template>
<script>
import fixedSlider from './fixedSlider.vue'
export default {
  data() {
    return {
      sliderConf: {
        isShow: true,
        event: 'triggerOpt',
        options: [
          {
            title: 'new editor',
            icon: 'icon iconfont icon-editor'
          },
          {
            title: 'recyle bin',
            icon: 'icon iconfont icon-recycle'
          },
          {
            title: 'log out',
            icon: 'icon iconfont icon-logOut'
          }
        ]
      }
    }
  },
  components: {
    fixedSlider
  }
}
</script>
<style lang="scss">
.profile{
  font-family: $josefinSans;
}
</style>