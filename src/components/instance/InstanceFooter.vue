<template>
  <div id="instanceFooter" class="flex noselect borbox text-mini">
    <div class="flex flex-ai tip flex-1">
      <i class="icon iconfont icon-zhuanhuan load-icon text-mini" v-show="isCompiling"></i>
      <span class="tip-text" v-show="isCompiling">Compiling code, please wait...</span>
    </div>
    <div class="flex flex-sh cursor-pos flex-ai">
      <span v-show="!cursorPos.selections">Ln {{cursorPos.ln}},</span>
      <span v-show="!cursorPos.selections">Col {{cursorPos.col}}</span>
      <span v-show="cursorPos.selections">{{cursorPos.selections}} selections</span>
      <span v-show="cursorPos.selected">({{cursorPos.selected}} selected)</span>
    </div>
    <div class="flex flex-sh spaces flex-ai">
      <span>Spaces: {{instanceSetting.indentSpaces}}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    isCompiling: Boolean,
    cursorPos: Object,
  },
  data() {
    return {}
  },
  computed:{
    ...mapState(['instanceSetting'])
  },
  methods: {},
  components: {},
}
</script>

<style lang="scss" scoped>
#instanceFooter {
  width: 100%;
  height: 20px;
  background-color: $deepBlue;
  padding: 0 15px;
  color: $white;
  .tip {
    .load-icon {
      line-height: 13px;
      animation: loadRotate 2s infinite;
    }
    .tip-text {
      padding-left: 5px;
    }
  }
  .cursor-pos,.spaces{
    padding-right: 10px;
  }
}
</style>
