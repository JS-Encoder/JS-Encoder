<template>
  <transition name="slide">
    <div class="pop-up" v-if="pop.isShow">
      <div class="bg"></div>
      <div class="pop-content">
        <div class="content-head">
          <div class="title">
            <span>close<i @click="close"></i></span>
          </div>
        </div>
        <div class="content">
          <div class="content-text">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'pop-up',
  props: {
    pop: Object
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.pop.isShow = false
    }
  }
}
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
}
.pop-up {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1500;
  width: 100%;
  height: 100%;
}
.bg {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}
.pop-content {
  display: flex;
  flex-direction: column;
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1501;
}
.content-head {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 10000;
  top: -20px;
  right: 0;
  padding: 0 10px;
  height: 35px;
  background-color: #1e1e1e;
  box-shadow: -3px 3px 10px #999;
}
.title {
  color: #fff;
}
.title:before {
  content: '\A';
  border-style: solid;
  border-width: 20px 15px 0 0;
  border-color: transparent #003c29 transparent transparent;
  position: absolute;
  left: -15px;
  top: 0;
}
.title span i:before {
  margin-left: 5px;
  font-style: normal;
  content: '\2716';
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0px 1px 3px 0px #999999;
}
.content-text {
  width: 90%;
}
</style>
