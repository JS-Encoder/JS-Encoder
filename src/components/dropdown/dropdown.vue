<template>
  <div class="relative" :class="namespace" ref="dropdownOptsRef">
    <!--  触发菜单显示的元素  -->
    <div :class="`${namespace}-trigger-wrapper`" @click="handleClickTrigger">
      <slot></slot>
    </div>
    <!--  菜单项列表  -->
    <div
      v-show="modelValue"
      class="shadow p-y-xs absolute radius-m"
      :class="`${namespace}-options-wrapper ${namespace}-align-${align}`">
      <div :class="`${namespace}-options`" @click="handleClickOption">
        <slot name="options"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch } from "vue"
import useClickOutside from "@hooks/use-click-outside"
import { Trigger, Position, Align } from "@type/interface"

interface IProps {
  /** 是否显示下拉菜单 */
  modelValue: boolean
  /** 触发下拉的行为 */
  trigger?: string
  /** 菜单显示的位置 */
  position?: Position
  /** 菜单沿着哪一边对齐 */
  align?: Align
  /** 是否显示三角 */
  showTriangle?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
  position: Position.BOTTOM,
  align: Align.LEFT,
  trigger: Trigger.CLICK,
  modelValue: false,
})
const emits = defineEmits(["update:modelValue"])

const namespace = "dropdown"
const dropdownOptsRef = shallowRef<HTMLElement | null>(null)
const isClickOutSide = useClickOutside(dropdownOptsRef)

const handleClickTrigger = (): void => {
  if (props.trigger !== Trigger.CLICK) { return }
  emits("update:modelValue", !props.modelValue)
}
const handleClickOption = (): void => {
  emits("update:modelValue", false)
}

/** 如果点击的是菜单外部，就隐藏菜单，并取消监听 */
watch(isClickOutSide, () => {
  if (isClickOutSide.value) {
    emits("update:modelValue", false)
  }
})
</script>

<style lang="scss" scoped>
$namespace: dropdown;

.#{$namespace}-options-wrapper {
  z-index: 1000;
  background-color: var(--color-main-bg-1);
}

.#{$namespace}-align-left {
  left: 0;
}
.#{$namespace}-align-right {
  right: 0;
}
.#{$namespace}-align-middle {
  left: 50%;
  transform: translateX(-50%);
}
</style>