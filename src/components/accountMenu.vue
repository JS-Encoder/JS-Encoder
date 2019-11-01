<template>
  <transition name="account">
    <div class="account-menu">
      <ul class="account-options-list">
        <li
          class="account-option"
          v-for="(item, index) in menuOptions"
          :key="index"
          @click="item.method"
        >{{item.name}}</li>
      </ul>
    </div>
  </transition>
</template>
<script>
export default {
  data() {
    return {
      menuOptions: [
        {
          name: 'Log In',
          method: this.openLogin
        }
      ]
    }
  },
  methods: {
    openLogin() {
      this.$emit('openLogin')
    }
  }
}
</script>
<style lang="scss" scoped>
.account-enter-active,
.account-leave-active {
  @include setTransition(all, 0.2s, ease);
}
.account-enter,
.account-leave-to {
  opacity: 0;
  transform: scale(0.8);
  visibility: hidden;
}
.account-menu {
  @include setWAndH(150px);
  position: absolute;
  top: 50px;
  right: 0;
  max-height: calc(100vh - 71px);
  z-index: 2000;
  box-sizing: border-box;
  box-shadow: 0 0.5rem 5rem $dominantHue;
  background-color: $dominantHue;
  overflow-y: auto;
  transform-origin: top right;
  .account-options-list {
    color: $primaryHued;
    .account-option {
      padding: 10px 15px;
      cursor: pointer;
      @include setTransition(all, 0.3s, ease);
      &:hover {
        background-color: #333333;
      }
    }
  }
}
</style>
