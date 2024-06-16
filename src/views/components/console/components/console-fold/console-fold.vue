<template>
  <div class="flex">
    <div class="fold-arrow fade-ease mr-xxs" @click="handleClickFold">
      <i
        class="icon iconfont icon-triangle-right describe-text font-xxs inline-block"
        :class="modelValue ? 'rotate-90' : ''"
      ></i>
    </div>
    <div>
      <div @click="handleClickFold">
        <slot></slot>
      </div>
      <div v-if="modelValue">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IEmits, IProps } from "./console-fold"

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const handleClickFold = () => {
  emits("update:modelValue", !props.modelValue)
}
</script>

<style scr="./console-fold.scss" lang="scss" scoped></style>