<template>
  <div id="switchColor" class="flex flex-clo">
    <span class="describe">{{switchInfo.switchDescribe}}</span>
    <div class="color-rgb flex flex-ai">
      R：
      <el-input class="rgb-input" size="mini" type="text" v-model="RGB.R" />G：
      <el-input class="rgb-input" size="mini" type="text" v-model="RGB.G" />B：
      <el-input class="rgb-input" size="mini" type="text" v-model="RGB.B" />
      <i class="icon iconfont icon-zhuanhuan" @click="switchHEX"></i>
    </div>
    <div class="color-hex flex flex-ai">
      HEX：<el-input class="hex-input" size="mini" type="text" v-model="HEX"></el-input>
      <i class="icon iconfont icon-zhuanhuan" @click="switchRGB"></i>
    </div>
  </div>
</template>

<script>
import * as switcher from '@/utils/switchColorFormat'
export default{
  data(){
    return{
      RGB: {
        R: '',
        G: '',
        B: ''
      },
      HEX: ''
    }
  },
  computed: {
    switchInfo(){
      return window.Global.language.dialogInfo.switch
    }
  },
  methods: {
    switchRGB() {
      const rgb = switcher.switchRGB(this.HEX)
      if (rgb) this.RGB = rgb
    },
    switchHEX() {
      const hex = switcher.switchHEX(this.RGB)
      if (hex) this.HEX = hex
    }
  }
}
</script>

<style lang="scss" scoped>
#switchColor{
  @include setWAndH(300px);
  &>span{
    margin-top: 5px;
  }
  .color-rgb,
  .color-hex{
    color: $afterFocus;
    &>i{
      font-size: 20px;
      @include setTransition(all, 0.3s, ease);
      cursor: pointer;
      &:hover{
        transform: rotate(360deg);
      }
    }
  }
  .color-rgb{
    .rgb-input{
      margin: 5px 10px 5px 0;
      @include setWAndH(60px);
    }
  }
  .color-hex{
    .hex-input{
      margin: 5px 10px 5px 0;
    }
  }
}
</style>