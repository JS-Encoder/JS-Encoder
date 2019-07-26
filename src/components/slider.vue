<template>
  <div :class="sliderConf.isShow?'slider-show':''" class="slider flex flex-clo">
    <div @click="close" class="bg" v-show="sliderConf.isShow"></div>
    <div :class="sliderConf.isShow?'out':''" class="slider-content flex flex-clo">
      <span class="slider-title noselect flex flex-ai">
        <img alt class="logo" src="../assets/logo.svg" />
      </span>
      <div class="slider-menu flex">
        <ul>
          <li
            :key="index"
            @click="triggerEvent(item.title)"
            class="menu-item flex flex-jcc"
            v-for="(item,index) in sliderConf.options"
          >
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sliderConf: Object
  },
  methods: {
    triggerEvent(title) {
      const index = title.indexOf(' ')
      if (index !== -1) {
        const arr = title.split(' ')
        let newArr = []
        for (let i = 0; i < arr.length; i++) {
          if (i > 0) {
            newArr.push(arr[i][0].toUpperCase() + arr[i].substring(1))
          } else {
            newArr.push(arr[i])
          }
        }
        title = newArr.join('')
      }
      this.$emit(this.sliderConf.event, title)
    },
    close() {
      this.sliderConf.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.slider {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1400;
  .slider-title {
    @include setWAndH(100%, 50px);
    img {
      @include setWAndH(100%, 40px);
    }
  }
  .bg {
    @include setWAndH(100%, 100%);
  }
  .slider-content {
    position: absolute;
    z-index: 1401;
    top: 0;
    left: -200px;
    border-right: 0px solid #999999;
    @include setWAndH(200px, 100vh);
    background-color: $dominantHue;
    box-shadow: 0px 0px 0px $dominantHue;
    @include setTransition(all, 0.3s, ease);
    .slider-menu {
      width: 100%;
      ul {
        width: 100%;
        @include setPAndM(10px 0, 0);
        .menu-item {
          width: 100%;
          padding: 10px 0;
          color: #ccc;
          font-size: 20px;
          border-bottom: 2px solid #2c2c2c;
          @include setTransition(all, 0.3s, ease);
          cursor: pointer;
          span {
            margin: 0 5px;
          }
        }
        .menu-item:last-child {
          border-bottom: none;
        }
        .menu-item:hover {
          color: #f2f2f2;
          background-color: #333333;
        }
      }
    }
  }
  .out {
    left: 0px;
    box-shadow: 3px 0px 10px #1a1a1a;
  }
}
.slider-show {
  @include setWAndH(100%, 100%);
}
</style>
