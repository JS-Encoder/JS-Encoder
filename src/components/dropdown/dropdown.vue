<template>
  <div class="relative" :class="namespace" ref="dropdownOptsRef">
    <!--  触发菜单显示的元素  -->
    <div :class="`${namespace}-trigger-wrapper`" @click="handleClickTrigger">
      <slot></slot>
    </div>
    <!--  菜单项列表  -->
    <teleport to="body" :disabled="!appendToBody">
      <div
        v-show="modelValue"
        class="shadow p-y-xs absolute radius-m"
        :class="`${namespace}-options-wrapper ${namespace}-align-${align}`"
        :style="{...optionsStyle}">
        <div :class="`${namespace}-options relative`" @click="handleClickOption">
          <slot name="options"></slot>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, watch } from "vue"
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
  /** 是否将选择项列表插入到body中 */
  appendToBody?: boolean
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

/** 定位样式 */
const optionsStyle = shallowRef<Record<string, string>>({})
const setOptionStyle = () => {
  if (!props.appendToBody || !dropdownOptsRef.value) { return }
  const { height = 0, width = 0, top = 0, left = 0, right = 0 } = dropdownOptsRef.value.getBoundingClientRect()
  const { align } = props
  optionsStyle.value = {
    width: "auto",
    transform: "none",
    top: `${top + height}px`,
    right: align === Align.RIGHT ? `calc(100% - ${right}px)` : "auto",
    bottom: "auto",
    left: align === Align.LEFT
      ? `${left}px`
      : align === Align.MIDDLE
        ? `${left - width / 2}px`
        : "auto",
  }
}
onMounted(() => {
  setOptionStyle()
})

watch(() => props.modelValue, (newState) => {
  if (!newState) { return }
  setOptionStyle()
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