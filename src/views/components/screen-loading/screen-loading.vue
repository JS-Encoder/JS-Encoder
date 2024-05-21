<template>
  <teleport to="body">
    <div class="page-loading fixed pos-origin bg-main3 flex-center">
      <div class="loading flex-center">
        <img style="width:48px;height:48px" src="../../../assets/images/logo.svg" alt="logo" />
        <span class="logo-text code-font fw-bold ml-s primary1-text" title="JS-Encoder">JS-Encoder</span>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.page-loading {
  width: 100vw;
  height: 100vh;
  .loading {
    animation: shinning 3s ease infinite;
    .logo-text {
      font-size: 48px;
    }
  }
}

@keyframes shinning {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
</style>