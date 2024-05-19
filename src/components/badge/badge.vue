<template>
  <div class="relative" :class="`${namespace}-wrapper`">
    <div
      v-if="value"
      class="circle absolute high-layer flex-center"
      :class="[
        namespace,
        `${namespace}-${position}`,
        `${namespace}-${size}`,
        showBorder ? `${namespace}-border` : '',
      ]"
      :style="{ backgroundColor: color }">
      <span v-if="content" class="font-xs" :class="`${namespace}-content`">{{ content }}</span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { BadgeSize, BadgePosition } from "./badge"

interface IProps {
  /** 徽章的显隐 */
  value: boolean
  /** 徽章显示内容 */
  content?: string
  /** 徽章位置：top-left|top-right|bottom-left|bottom-right */
  position?: BadgePosition
  /** 徽章颜色 */
  color?: string
  /** 邀请徽章尺寸 sm|md|lg */
  size?: BadgeSize
  /** 是否显示边框 */
  showBorder?: boolean
}

withDefaults(defineProps<IProps>(), {
  value: false,
  content: "",
  position: BadgePosition.TOP_RIGHT,
  color: "#0085ff",
  size: BadgeSize.MD,
  showBorder: false,
})

const namespace = "badge"
</script>

<style lang="scss" scoped>
$namespace: "badge";

/** 组件尺寸 */
$comp-size: (
  sm: 4,
  md: 8,
  lg: 12,
);

/** 边框宽度 */
$border-width: (
  sm: 1,
  md: 1.5,
  lg: 2,
);

.#{$namespace}-wrapper {
  .#{$namespace} {
    .#{$namespace}-content {
      color: var(--color-badge-color);
    }
  }

  /** 每种size对应不同的宽高 */
  @each $name, $size in ($comp-size) {
    .#{$namespace}-#{$name} {
      width: #{$size}px;
      height: #{$size}px;
      color: var(--color-badge-color);
      &.#{$namespace}-top-left {
        inset: calc(#{$size}px / 2) calc(100% - #{$size}px / 2) 0 0;
      }
      &.#{$namespace}-top-right {
        inset: calc(#{$size}px / 2) 0 0 calc(100% - #{$size}px / 2);
      }
      &.#{$namespace}-bottom-left {
        inset: calc(100% - #{$size}px / 2) 0 calc(#{$size}px / 2) 0;
      }
      &.#{$namespace}-bottom-right {
        inset: calc(100% - #{$size}px / 2) 0 0 calc(100% - #{$size}px / 2);
      }
    }
  }

  /** 每种size对应不同的边框宽度 */
  @each $name, $width in ($border-width) {
    .#{$namespace}-border {
      border: #{$width}px solid var(--color-badge-border);
    }
  }
}
</style>