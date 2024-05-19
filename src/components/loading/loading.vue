<template>
  <div class="flex-col flex-center" :style="{ height: height }">
    <div :class="namespace">
      <div
        v-for="num in 4"
        :key="num"
        :class="`${namespace}-item ${namespace}-item${num}`"
      ></div>
    </div>
    <div v-if="content" class="font-xxs no-active-text mt-s">{{ content }}</div>
  </div>
</template>

<script lang="ts" setup>
interface IProps {
  content?: string
  height?: string
}

withDefaults(defineProps<IProps>(), {
  content: "加载中...",
  height: "auto",
})

const namespace = "loading"
</script>

<style lang="scss" scoped>
$namespace: "loading";

.#{$namespace} {
  width: 30px;
  height: 30px;
  position: relative;
  transform: rotate(45deg);
}

.#{$namespace}-item {
  width: 10px;
  height: 10px;
  position: absolute;
  background-color: var(--color-primary1);
}

.#{$namespace}-item1 {
  left: 0;
  animation: animation-shape1 0.5s ease infinite alternate;
}
.#{$namespace}-item2 {
  right: 0;
  animation: animation-shape2 0.5s ease infinite alternate;
}
.#{$namespace}-item3 {
  bottom: 0;
  animation: animation-shape3 0.5s ease infinite alternate;
}
.#{$namespace}-item4 {
  right: 0;
  bottom: 0;
  animation: animation-shape4 0.5s ease infinite alternate;
}

@keyframes animation-shape1 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(16px, 16px); }
}

@keyframes animation-shape2 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-16px, 16px); }
}

@keyframes animation-shape3 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(16px, -16px); }
}

@keyframes animation-shape4 {
  0% { transform: translate(0, 0); }
  100% { transform: translate(-16px, -16px); }
}
</style>
