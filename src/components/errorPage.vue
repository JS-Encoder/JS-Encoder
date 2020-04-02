<template>
  <div id="errorPage" class="flex flex-clo">
    <div class="container flex flex-clo flex-ai">
      <div class="svg-box flex flex-jcc">
        <img class="cry" src="../assets/404.svg" alt="">
        <img class="tip" src="../assets/tip.svg" alt="">
      </div>
      <h1>Oh my god, this page is gone !!!</h1>
      <div class="logo flex flex-ai">
        <span>JS-ENC</span>
        <img alt src="../assets/logo.svg" />
        <span>DER</span>
      </div>
      <button class="btn-def" @click="backHome">Back Home</button>
    </div>
    <EncoderFooter></EncoderFooter>
  </div>
</template>

<script>
import EncoderFooter from './encoderFooter'
export default {
  data() {
    return {}
  },
  mounted() {
    document.title = '404 Error'
  },
  methods: {
    backHome() {
      this.$router.push({
        path: '/profile'
      })
    }
  },
  components: {
    EncoderFooter
  }
}
</script>

<style lang="scss" scoped>
@include keyframes(fade) {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
#errorPage {
  @include setWAndH(100%, 100%);
  overflow: auto;
  .container {
    min-height: 100%;
    .svg-box {
      width: 100%;
      position: relative;
      .cry {
        width: 30%;
      }
      .tip {
        width: 15%;
        transform: scale(1);
        position: absolute;
        bottom: 10px;
        @include animation(fade, 2s, ease, 1.8s, infinite);
      }
    }
    h1 {
      color: $afterFocus;
    }
    .logo {
      @include setWAndH(auto, 30px);
      font-family: 'PingFang SC', 'Microsoft YaHei', '微软雅黑';
      color: #ae81ff;
      font-size: 25px;
      margin-bottom: 10px;
      img {
        @include setWAndH(30px, 30px);
      }
    }
    button {
      margin-top: 10px;
      padding: 10px 20px;
    }
  }
}
</style>
