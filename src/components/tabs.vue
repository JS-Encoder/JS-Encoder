<template>
  <div
    id="tabs"
    class="noselect flex flex-jcc flex-ai"
    :class="currentTab === tabInfo.name ? 'current-tab' : ''"
    @click="switchCurrentTab"
  >
    <i
      class="icon iconfont"
      :class="tabInfo.class"
    ></i>
    <span>{{tabInfo.name}}</span>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  props: { tabInfo: Object },
  computed: {
    ...mapState({
      currentTab: "currentTab"
    })
  },
  methods: {
    switchCurrentTab() {
      const tabName = this.tabInfo.name
      this.$store.commit("updateCurrentTab", tabName)
    }
  }
}
</script>
<style lang="scss" src="./componentStyle/tabs.scss" scoped></style>
<style lang="scss" scoped>
.current-tab {
  background-color: $dominantHue !important;
  color: $afterFocus !important;
}
#tabs {
  height: 100%;
  box-sizing: border-box;
  color: $beforeFocus;
  background-color: $primaryHued;
  padding: 5px 20px;
  border-right: 2px solid $dominantHue;
  cursor: pointer;
  @include setTransition(all, 0.3s, ease);
  i {
    font-size: 20px;
    margin-right: 5px;
  }
  span {
    font-size: 14px;
    margin-left: 5px;
  }
  &:hover {
    color: $afterFocus;
  }
}
</style>