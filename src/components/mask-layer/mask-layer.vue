<template>
  <div class="fixed fill high-layer" :class="namespace" @click.self="emits('clickMask')">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (event: "clickMask"): void,
}>()

const namespace = "mask-layer"
</script>

<style lang="scss" scoped>
$namespace: "mask-layer";

.#{$namespace} {
  top: 0;
  left: 0;
  background-color: var(--color-mask-bgc);
  backdrop-filter: blur(6px);
}
</style>