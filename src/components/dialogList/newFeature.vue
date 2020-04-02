<template>
  <div id="newFeature">
    <ol class="feature-list" v-if="newFeatureInfo.featureList.attrs!==undefined&&newFeatureInfo.newFeature.attrs.length > 0">
      <li v-for="(item, index) in newFeatureInfo.featureList" :key="index">{{item}}</li>
    </ol>
    <span v-else class="inform">{{newFeatureInfo.noFeature}}</span>
  </div>
</template>

<script>
export default {
  computed:{
    newFeatureInfo(){
      return window.Global.language.dialogInfo.newFeature
    }
  }
}
</script>

<style lang="scss" scoped>
#newFeature{
  .feature-list{
    padding: 0 20px;
    li{
      list-style: decimal;
      color: $afterFocus;
      margin: 5px 0;
    }
  }
  .inform{
    display: block;
    margin: 5px 0;
    color: $beforeFocus;
    font-size: 17px;
  }
}
</style>