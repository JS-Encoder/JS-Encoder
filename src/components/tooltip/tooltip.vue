<template>
  <div
    class="tooltip relative inline-block"
    @mouseleave="handleMouseLeave"
    @mouseover="handleMouseover">
    <transition name="tooltip">
      <div
        v-show="!hidden && !disable"
        class="tooltip-container p-y-xs p-x-s absolute shadow radius-m"
        :class="`tooltip-${position}`"
        :style="{ ...offsetStyle, zIndex: level }">
        <template v-if="$slots.content">
          <slot name="content"></slot>
        </template>
        <template v-else>
          <div class="font-xs text-nowrap line-h-normal">{{ content }}</div>
        </template>
        <span
          v-if="showTriangle"
          class="tooltip-triangle absolute"
          :class="`triangle-${position}`"
        ></span>
      </div>
    </transition>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { Position } from "@type/interface"
import { ref } from "vue"
import { getOffsetStyle } from "@components/utils/common"
import { IProps } from "./tooltip"

const props = withDefaults(defineProps<IProps>(), {
  content: "",
  hidden: true,
  offset: 0,
  delay: 300,
  disable: false,
  showTriangle: true,
  position: Position.RIGHT,
  level: "auto",
})

const hidden = ref<boolean>(true)

/** 计算偏移样式 */
const offsetStyle = getOffsetStyle(props.offset, props.position)

let timer: NodeJS.Timeout | null = null

/** 鼠标移入显示tip */
const handleMouseover = (): void => {
  if (timer) {
    clearTimeout(timer)
  }
  hidden.value = false
}

/** 鼠标移出delay毫秒后提示消失 */
const handleMouseLeave = (): void => {
  timer = setTimeout(() => {
    hidden.value = true
  }, props.delay)
}
</script>

<style lang="scss" scoped>
$border-width: 6;

.tooltip {
  color: var(--color-tooltip-color);
  .tooltip-container {
    background-color: var(--color-main-bg-1);
    border-color: var(--color-main-bg-1);
  }
  .tooltip-bottom {
    top: calc(100% + #{$border-width}px);
    left: 50%;
    transform: scale(1) translateX(-50%);
  }
  .tooltip-left {
    top: 50%;
    right: calc(100% + #{$border-width}px);
    transform: scale(1) translateY(-50%);
  }
  .tooltip-right {
    left: calc(100% + #{$border-width}px);
    top: 50%;
    transform: scale(1) translateY(-50%);
  }
  .tooltip-top {
    bottom: calc(100% + #{$border-width}px);
    left: 50%;
    transform: scale(1) translateX(-50%);
  }
  .triangle-bottom {
    inset: calc(-50% + #{$border-width}px) 0 0 calc(50% - #{$border-width}px);
  }
  .triangle-right {
    inset: calc(50% - #{$border-width}px) 0 0 calc(-2 * #{$border-width}px);
  }
  .triangle-left {
    inset: calc(50% - #{$border-width}px) 0 0 100%;
  }
  .triangle-top {
    inset: 100% 0 0 calc(50% - #{$border-width}px);
  }
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
.tooltip-enter-to,
.tooltip-leave-from {
  opacity: 1;
}
.tooltip-enter-active,
.tooltip-leave-active {
  @include transition(all, 0.3s, ease);
}
</style>
