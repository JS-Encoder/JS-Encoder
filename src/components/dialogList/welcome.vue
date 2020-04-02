<template>
  <div id="welcome" class="flex flex-clo">
    <div class="title flex flex-ai flex-w">
      <span class="first">{{langWelcome.first}}</span>
      <span class="brand">JS-ENCODER</span>❕
    </div>
    <div class="introduce">{{langWelcome.introduce}}</div>
    <div class="important">{{langWelcome.important}}</div>
    <div class="try">{{langWelcome.try}}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    langWelcome() {
      return window.Global.language.dialogInfo.welcome
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
#welcome {
  &>div{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .title{
    color: $afterFocus;
    font-size: 25px;
    .brand{
      margin-top: 4px;
      margin-left: 5px;
      color: #ae81ff;
    }
  }
  .introduce{
    color: $beforeFocus;
    font-size: 14px;
  }
  .important{
    color: $afterFocus;
    font-size: 20px;
  }
  .try{
    color: #ae81ff;
  }
}
</style>
