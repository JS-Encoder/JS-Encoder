<template>
  <div id="selectColor" class="flex flex-clo">
    <span class="describe">{{selectColorInfo.selectDescribe}}</span>
    <span class="title">{{selectColorInfo.GAndB}}</span>
    <ul class="color-table">
      <li v-for="(item, index) in GAndB" :key="index" class="flex">
        <span v-for="(color, i) in item" :key="i" :style="{backgroundColor: color}" @click="copyHEX(color)"></span>
      </li>
    </ul>
    <span class="title">{{selectColorInfo.RAndB}}</span>
    <ul class="color-table">
      <li v-for="(item, index) in RAndB" :key="index" class="flex">
        <span v-for="(color, i) in item" :key="i" :style="{backgroundColor: color}" @click="copyHEX(color)"></span>
      </li>
    </ul>
    <span class="title">{{selectColorInfo.RAndG}}</span>
    <ul class="color-table">
      <li v-for="(item, index) in RAndG" :key="index" class="flex">
        <span v-for="(color, i) in item" :key="i" :style="{backgroundColor: color}" @click="copyHEX(color)"></span>
      </li>
    </ul>
    <span class="title">{{selectColorInfo.Gray}}</span>
    <ul class="color-table">
      <li v-for="(item, index) in Gray" :key="index" class="flex">
        <span v-for="(color, i) in item" :key="i" :style="{backgroundColor: color}" @click="copyHEX(color)"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import colorInfo from '@/utils/colorInfo'
export default {
  computed: {
    GAndB(){
      return this.splitArray(colorInfo.GAndB, 6)
    },
    RAndB(){
      return this.splitArray(colorInfo.RAndB, 6)
    },
    RAndG(){
      return this.splitArray(colorInfo.RAndG, 6)
    },
    Gray(){
      return this.splitArray(colorInfo.Gray, 6)
    },
    selectColorInfo(){
      return window.Global.language.dialogInfo.select
    }
  },
  methods: {
    splitArray(array, subGroupLength) {
      let index = 0
      let newArray = []
      while(index < array.length) {
          newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
    },
    copyHEX(color){
      const input = document.createElement('input')
      input.value = color
      document.body.appendChild(input)
      input.select()
      document.execCommand('Copy')
      document.body.removeChild(input)
      this.$notify({
        message: this.selectColorInfo.inform,
        position: 'bottom-right',
        showClose: false,
        iconClass: 'icon iconfont icon-success success',
        duration: 1000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.success{
  color: orange !important;
}
#selectColor{
  &>span{
    margin: 5px 0;
  }
  .title{
    font-size: 17px;
    font-weight: 600;
    color: $afterFocus;
  }
  .color-table{
    li{
      @include setWAndH(auto, 25px);
      span{
        flex: 1;
        margin: .5px;
        cursor: pointer;
        @include setTransition(all, 0.3s, ease);
        &:hover{
          transform: scale(1.2);
          box-shadow: 0 0 5px 0 $deepColor;
        }
      }
    }
  }
}
</style>