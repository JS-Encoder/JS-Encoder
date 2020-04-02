<template>
  <footer id="encoderFooter" class="flex flex-ai flex-jcb" v-if="refresh">
    <div class="foot-left flex flex-clo">
      <div class="logo flex flex-ai">
        <span>JS-ENC</span>
        <img alt src="../assets/logo.svg" />
        <span>DER</span>
      </div>
      <div class="describe">{{langFooter.describe}}</div>
    </div>
    <div class="link">
      <a href="https://github.com/Longgererer/JS-Encoder/blob/master/README.md" target="black">{{langFooter.function}}</a>
      <a href="https://github.com/Longgererer/JS-Encoder/releases" target="black">{{langFooter.log}}</a>
      <a href="https://github.com/Longgererer/JS-Encoder/blob/master/LICENSE" target="black">{{langFooter.MIT}}</a>
      <a href="https://github.com/Longgererer/JS-Encoder" target="black">{{langFooter.github}}</a>
      <a href="mailto:c2b139460q@gmail.com" target="black">{{langFooter.email}}</a>
    </div>
    <div class="foot-right flex flex-clo">
      <span class="copyright">©2020 JS-ENCODER</span>
      <span class="author">Power by LLIIOOIILL</span>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      refresh: true
    }
  },
  methods: {},
  computed: {
    language() {
      return this.$store.state.language
    },
    langFooter() {
      return window.Global.language.footer
    }
  },
  watch: {
    language() {
      // 重新渲染组件
      this.refresh = false
      this.$nextTick(() => {
        this.langProfileInfo = window.Global.language.profileInfo
        this.refresh = true
      })
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/encoderFooter.scss" scoped></style>
<style lang="scss" scoped>
#encoderFooter {
  @include setWAndH(100%, 100px);
  background-color: $primaryHued;
  flex-shrink: 0;
  .foot-left {
    margin-left: 20px;
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
    .describe {
      color: #666666;
    }
  }
  .link {
    font-size: 14px;
    a {
      color: $describe;
      margin: 0 20px;
      @include setTransition(all, 0.3s, ease);
      &:hover{
        color: $afterFocus;
      }
    }
  }
  .foot-right {
    font-size: 14px;
    margin-right: 20px;
    .copyright {
      color: $describe;
      margin-bottom: 5px;
    }
    .author {
      color: #666666;
      font-style: italic;
    }
  }
}
</style>
