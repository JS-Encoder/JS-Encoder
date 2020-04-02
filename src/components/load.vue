<template>
  <div id="load" class="flex flex-ai flex-jcc">
    <div class="loader">
      <div class="ball1"></div>
      <div class="ball2"></div>
      <div class="ball3"></div>
      <div class="ball4"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
  components: {}
}
</script>

<style lang="scss" scoped>
@keyframes ball1-spin {
  0%,
  100% {
    left: 0;
    top: 0;
  }
  25% {
    left: 37.5%;
    top: 37.5%;
    z-index: 1;
    transform: scale(0.7);
    background-color: #351384;
  }
  50% {
    left: 75%;
    top: 75%;
    transform: scale(1);
    background-color: #ae81ff;
  }
  75% {
    left: 37.5%;
    top: 37.5%;
    z-index: 3;
    transform: scale(1.5);
    background-color: #68d1ff;
  }
}
@keyframes ball2-spin {
  0%,
  100% {
    right: 0;
    top: 0;
  }
  25% {
    right: 37.5%;
    top: 37.5%;
    z-index: 1;
    transform: scale(0.7);
    background-color: #351384;
  }
  50% {
    right: 75%;
    top: 75%;
    transform: scale(1);
    background-color: #ae81ff;
  }
  75% {
    right: 37.5%;
    top: 37.5%;
    z-index: 3;
    transform: scale(1.5);
    background-color: #68d1ff;
  }
}
@keyframes ball3-spin {
  0%,
  100% {
    right: 0;
    bottom: 0;
  }
  25% {
    right: 37.5%;
    bottom: 37.5%;
    z-index: 3;
    transform: scale(1.5);
    background-color: #68d1ff;
  }
  50% {
    right: 75%;
    bottom: 75%;
    transform: scale(1);
    background-color: #ae81ff;
  }
  75% {
    right: 37.5%;
    bottom: 37.5%;
    z-index: 1;
    transform: scale(0.7);
    background-color: #351384;
  }
}
@keyframes ball4-spin {
  0%,
  100% {
    bottom: 0;
    left: 0;
  }
  25% {
    bottom: 37.5%;
    left: 37.5%;
    z-index: 3;
    transform: scale(1.5);
    background-color: #68d1ff;
  }
  50% {
    bottom: 75%;
    left: 75%;
    transform: scale(1);
    background-color: #ae81ff;
  }
  75% {
    bottom: 37.5%;
    left: 37.5%;
    transform: scale(0.7);
    z-index: 1;
    background-color: #351384;
  }
}
#load {
  width: 200px;
  height: 200px;
  .loader {
    width: 100%;
    height: 100%;
    position: relative;
    div {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #ae81ff;
      position: absolute;
      z-index: 2;
    }
    .ball1 {
      left: 0;
      top: 0;
      animation: ball1-spin 3s ease-in-out 0s infinite;
    }
    .ball2 {
      right: 0;
      top: 0;
      animation: ball2-spin 3s ease-in-out 0.75s infinite;
    }
    .ball3 {
      bottom: 0;
      right: 0;
      animation: ball3-spin 3s ease-in-out 0s infinite;
    }
    .ball4 {
      bottom: 0;
      left: 0;
      animation: ball4-spin 3s ease-in-out 0.75s infinite;
    }
  }
}
</style>
