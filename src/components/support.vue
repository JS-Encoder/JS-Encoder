<template>
  <div id="support" class="flex flex-clo flex-ai">
    <span class="title">{{langSupport.title}}</span>
    <span class="content">{{langSupport.content}}</span>
    <button class="btn-def">{{langSupport.btn}}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    langSupport() {
      return window.Global.language.support
    }
  },
  methods: {},
  components: {}
}
</script>

<style lang="scss" scoped>
@include phone {
  #support{
    width: 320px !important;
    box-sizing: border-box;
  }
}
@include phone-pad {
  #support{
    width: 420px !important;
  }
}
#support {
  border-radius: 5px;
  border: 2px solid $primaryHued;
  margin: 50px 0;
  padding: 20px 0;
  @include setWAndH(500px,auto);
  .title {
    color: $afterFocus;
    margin: 5px 0;
  }
  .content {
    font-size: 20px;
    margin: 5px 0;
    color: #ae81ff;
  }
  .btn-def{
    font-size: 25px;
    color: #ffdd40;
    margin: 10px 0;
    padding: 10px 30px;
  }
}
</style>
