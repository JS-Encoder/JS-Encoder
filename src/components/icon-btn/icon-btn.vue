<template>
  <div
    class="fade-ease cursor-pointer flex-center"
    :class="`${namespace} ${namespace}-${size} ${customClass}`"
    :style="{
      ...(highlight ? highlightStyle : null),
      '--hover-bg': hoverBg,
    }"
    :title="title"
    @click="emits('click')">
    <div :class="size2ClassMap[size]">
      <slot v-if="$slots.default"></slot>
      <i v-else class="icon iconfont font-inherit inline-block" :class="iconClass"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconBtnSize } from "@components/icon-btn/icon-btn.interface"
import { AnyObject } from "@type/interface"

interface IProps {
  /** icon类名 */
  iconClass?: string
  /** 三种尺寸：sm|md|lg */
  size?: IconBtnSize
  title?: string
  highlight?: boolean
  highlightStyle?: AnyObject
  hoverBg?: string
  customClass?: string
}
withDefaults(defineProps<IProps>(), {
  size: IconBtnSize.MD,
  title: "",
})
const emits = defineEmits<{
  (e: "click"): void
}>()

const namespace = "icon-btn"
const size2ClassMap = {
  [IconBtnSize.SM]: "font-s",
  [IconBtnSize.MD]: "font-m",
  [IconBtnSize.LG]: "font-l",
}
</script>

<style lang="scss" scoped>
$namespace: "icon-btn";
$comp-size: (
  sm: 24,
  md: 28,
  lg: 36,
);
$radius-size: (
  sm: 4,
  md: 6,
  lg: 8,
);

.#{$namespace} {
  --hover-bg: var(--color-main-bg-3);

  color: var(--color-no-active-color);
  &:hover {
    background-color: var(--hover-bg);
    color: var(--color-active-color);
  }
}

@each $size in (sm, md, lg) {
  .#{$namespace}-#{$size} {
    width: #{map.get($comp-size, $size)}px;
    height: #{map.get($comp-size, $size)}px;
    border-radius: #{map.get($radius-size, $size)}px;
  }
}
</style>