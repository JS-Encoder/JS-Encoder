<template>
  <div
    ref="popoverRef"
    class="inline-block"
    :class="[
      appendToBody ? '' : 'relative',
    ]"
    @click="handleClickTarget"
    @mouseleave="handleLeaveTarget"
    @mouseover="handleOverTarget">
    <teleport to="body" :disabled="!appendToBody">
      <transition :name="namespace">
        <div
          v-show="visible"
          class="absolute pos-origin"
          :class="[
            namespace,
            appendToBody ? '' : 'absolute pos-origin no-append-to-body',
          ]"
          :style="{ zIndex: level }"
          @mouseover="handleOverTarget"
          @mouseleave="handleLeaveTarget">
          <div
            class="p-x-l p-y-l absolute shadow radius-l"
            :class="`${namespace}-${position} ${namespace}-container`"
            :style="{...offsetStyle, ...posStyle}">
            <slot name="content"></slot>
            <span
              v-if="showTriangle"
              class="absolute"
              :class="`${namespace}-triangle triangle-${position}`"
            ></span>
          </div>
        </div>
      </transition>
    </teleport>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { Position, Trigger } from "@type/interface"
import { ref, shallowRef, watch } from "vue"
import { getOffsetStyle, getPosStyle } from "@components/utils/common"
import useClickOutside from "@hooks/use-click-outside"
import { IProps } from "./popover"

const namespace = "popover"

const props = withDefaults(defineProps<IProps>(), {
  offset: 0,
  showTriangle: true,
  position: Position.RIGHT,
  appendToBody: false,
  level: "auto",
  trigger: Trigger.HOVER,
  delay: 300,
})

const popoverRef = shallowRef<HTMLElement | null>(null)
const visible = ref<boolean>(false)

/** 偏移样式 */
const offsetStyle = getOffsetStyle(props.offset, props.position)
/** 定位样式 */
const posStyle = shallowRef<Record<string, string>>({})
const showPopover = (): void => {
  if (visible.value) { return }
  visible.value = true
  if (props.appendToBody) {
    // 在appendToBody为true时获取点击元素的位置，计算popover显示的位置
    const relativeEle = popoverRef.value
    // 直接获取元素的offset和offLeft会受到祖先元素position的影响，不一定准确
    const {
      left = 0,
      top = 0,
      bottom = 0,
      right = 0,
      width = 0,
      height = 0,
    } = relativeEle?.getBoundingClientRect() || {}
    posStyle.value = getPosStyle({
      left, top, bottom, right, width, height,
      position: props.position,
    })
  } else {
    posStyle.value = {}
  }
}

/**
 * trigger click
 */
const isClickOutSide = useClickOutside(popoverRef)
const handleClickTarget = (): void => {
  if (props.trigger !== Trigger.CLICK) { return }
  showPopover()
}
// 如果点击的是气泡卡片外部，就隐藏气泡卡片，并取消监听
watch(isClickOutSide, () => {
  if (props.trigger !== Trigger.CLICK) { return }
  if (isClickOutSide.value) {
    visible.value = false
  }
})

/**
 * trigger hover
 */
let timer: NodeJS.Timeout | null = null
const handleOverTarget = (): void => {
  if (props.trigger !== Trigger.HOVER) { return }
  if (timer) {
    clearTimeout(timer)
  } else {
    showPopover()
  }
}
const handleLeaveTarget = (): void => {
  if (props.trigger !== Trigger.HOVER) { return }
  timer = setTimeout(() => {
    visible.value = false
    timer = null
  }, props.delay)
}
</script>

<style lang="scss">
.popover-enter-from,
.popover-leave-to {
  opacity: 0;
}
.popover-enter-to,
.popover-leave-from {
  opacity: 1;
}
.popover-enter-active,
.popover-leave-active {
  @include transition(all, 0.2s, ease);
}
</style>

<style src="./popover.scss" lang="scss" scoped></style>