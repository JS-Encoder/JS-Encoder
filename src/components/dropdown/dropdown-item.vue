<script setup lang="ts">
const namespace = "dropdown-item"
</script>

<template>
  <div class="font-xxs p-x-l fade-ease flex-y-center cursor-pointer text-nowrap" :class="namespace">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
$namespace: "dropdown-item";

.#{$namespace} {
  height: 36px;
  color: var(--color-no-active-color);
  &:hover {
    color: var(--color-active-color);
    background-color: var(--color-main-bg-3);
  }
}
</style>