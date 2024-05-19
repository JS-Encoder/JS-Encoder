<template>
  <div
    class="split-line-wrapper relative"
    :class="direction === SplitDirection.HORIZONTAL ? 'fill-h' : 'fill-w'">
    <div
      class="split-line fill fade-ease absolute"
      :class="[
        isActive ? 'active' : '',
        showCursor && direction === SplitDirection.HORIZONTAL ? 'cursor-x-resize' : 'cursor-y-resize',
      ]"
      :style="{ ...splitLineSizeStyle }"
      @mouseenter="isActive = true"
      @mouseleave="isActive = false">
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * desc: 分割线，根据方向分割，在鼠标悬停的时候会高亮显示并扩大范围
 */
import { computed, ref } from "vue"
import { IProps } from "./split-line"
import { SplitDirection } from "@type/editor"

/** props */
const props = withDefaults(defineProps<IProps>(), {
  direction: SplitDirection.HORIZONTAL,
  showCursor: true,
})

/** 动态设置分割线宽高 */
const splitLineSizeStyle = computed(() => {
  const { direction, size } = props
  const isHorizontal = direction === SplitDirection.HORIZONTAL
  if (isHorizontal) {
    return {
      width: `${size}px`,
      top: 0,
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
    }
  } else {
    return {
      height: `${size}px`,
      left: 0,
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
    }
  }
})

const isActive = ref<boolean>(false)
</script>

<style lang="scss" scoped>
.split-line {
  z-index: 1;
  &.active {
    background-color: var(--color-primary1);
  }
}
</style>