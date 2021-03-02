<template>
  <div id="pageLoader">
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="margin: auto; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
      class="loader1">
      <path fill="none" stroke="#0000FF" stroke-width="5" stroke-dasharray="42.76482137044271 42.76482137044271"
        d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
        stroke-linecap="round" style="transform:scale(0.59);transform-origin:50px 50px">
        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1s" keyTimes="0;1"
          values="0;256.58892822265625"></animate>
      </path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
      style="margin: auto; display: block; shape-rendering: auto;" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"
      class="loader1">
      <path fill="none" stroke="#a18eff" stroke-width="5" stroke-dasharray="42.76482137044271 42.76482137044271"
        d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
        stroke-linecap="round" style="transform:scale(0.59);transform-origin:50px 50px">
        <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.408450704225352s" keyTimes="0;1"
          values="0;256.58892822265625"></animate>
      </path>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {},
  components: {},
}
</script>

<style lang="scss" scoped>
@include keyframes(shadow-fade) {
  0%,
  100% {
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.5));
  }
  50% {
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0));
  }
}
#pageLoader {
  width: 200px;
  position: relative;
  .loader1,
  .loader2 {
    position: absolute;
    @include animation(shadow-fade, 3s, 0s, ease, infinite);
  }
}
</style>
