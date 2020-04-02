<template>
  <div id="pageLoader" class="flex flex-ai flex-jcc flex-clo">
    <span class="content">{{content}}</span>
    <!-- <span class="content">
      Logging in via github, please wait a moment...
    </span>
    <span class="content">
      Checking browser type and version. Please wait...
    </span> -->
    <Loader class="loader"></Loader>
  </div>
</template>

<script>
import Loader from './load'
export default {
  props: {
    content: String
  },
  data() {
    return {}
  },
  methods: {},
  components: {
    Loader
  }
}
</script>

<style lang="scss" scoped>
@include phone {
  .content {
    font-size: 20px !important;
    transform: scale(0.3) !important;
  }
}
@include phone-pad {
  .content {
    font-size: 22px !important;
  }
  .loader {
    transform: scale(0.4) !important;
  }
}
#pageLoader {
  @include setWAndH(100%, 100%);
  background-color: $dominantHue;
  .content {
    font-size: 30px;
    color: $afterFocus;
  }
  .loader {
    transform: scale(0.5);
  }
}
</style>
