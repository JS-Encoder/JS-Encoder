<template>
  <div
    class="fade-ease active-text inline-flex relative"
    :class="`${namespace} ${namespace}--${type} ${namespace}--${size}`"
    :style="{ width }">
    <!-- start 文本输入框 -->
    <template v-if="type === InputType.TEXT">
      <div class="bg-form-item left-side-slot">
        <slot name="leftSide"></slot>
      </div>
      <input
        class="fill-w bg-form-item fade-ease code-font"
        type="text"
        :class="`${inputClass}`"
        :style="{ borderRadius: getTextInputRadius() }"
        :value="modelValue"
        :placeholder="placeholder"
        :maxlength="maxLength || Infinity"
        @input="handleInputTextChange($event)"
        @focus="emits('focus')"
        @blur="emits('blur')"/>
      <div class="bg-form-item right-side-slot">
        <slot name="rightSide"></slot>
      </div>
    </template>
    <!-- end 文本输入框 -->

    <!-- start 数字输入框 -->
    <template v-else-if="type === InputType.NUMBER">
      <input
        class="fill-w bg-form-item fade-ease code-font"
        type="text"
        :class="`${inputClass}`"
        :value="modelValue"
        :placeholder="placeholder"
        @blur="handleInputNumberBlur"/>
      <div
        class="cursor-pointer flex-col-center bg-form-item inline-flex"
        :class="`${namespace}-step-btn-wrapper`">
        <div
          class="flex-1 flex-y-center"
          @click="handleClickInputNumberUp">
          <i class="icon iconfont icon-down font-xs line-h-unset icon-rotate-180 flex-1 inline-flex
            text-hover-active fade-ease p-x-s"></i>
        </div>
        <div
          class="flex-1 flex-y-center"
          @click="handleClickInputNumberDown">
          <i class="icon iconfont icon-down font-xs line-h-unset flex-1 inline-flex
            text-hover-active fade-ease p-x-s"></i>
        </div>
      </div>
    </template>
    <!-- end 数字输入框 -->

    <!-- start 多行文本输入框 -->
    <template v-else-if="type === InputType.TEXTAREA">
      <textarea
        class="fill-w bg-form-item fade-ease code-font common-scrollbar"
        ref="textareaRef"
        :class="[
          inputClass,
          resize ? '' : 'no-resize',
          textareaHeight < textAreaHeightRange.maxHeight? 'over-y-hidden' : '',
        ]"
        :style="{
          minHeight: `${textAreaHeightRange.minHeight}px`,
          maxHeight: `${textAreaHeightRange.maxHeight}px`,
          height: `${textareaHeight}px`,
        }"
        :maxlength="maxLength || Infinity"
        :placeholder="placeholder"
        :value="modelValue"
        @input="handleInputTextAreaChange($event)">
      </textarea>
      <div
        class="absolute code-font fill-w break-all virtual-box text-pre-wrap"
        ref="virtualBoxRef"
      >{{modelValue}}</div>
    </template>
    <!-- end 多行文本输入框 -->

    <template v-else>
      <!-- do nothing -->
    </template>
  </div>
</template>

<script lang="ts" setup>
import { Size } from "@type/interface"
import { ref, shallowRef, useSlots } from "vue"
import { IEmits, IProps, InputType } from "./custom-input"

const inputFontSizeMap = {
  [Size.SMALL]: 12,
  [Size.MEDIUM]: 14,
  [Size.LARGE]: 16,
}

const inputPaddingMap = {
  [Size.SMALL]: 2,
  [Size.MEDIUM]: 4,
  [Size.LARGE]: 8,
}

const inputRadiusMap = {
  [Size.SMALL]: 2,
  [Size.MEDIUM]: 4,
  [Size.LARGE]: 8,
}

const props = withDefaults(defineProps<IProps>(), {
  modelValue: "",
  disabled: false,
  type: InputType.TEXT,
  placeholder: "",
  inputClass: "",
  size: Size.MEDIUM,
  width: "200px",
  /** number input 特有属性 */
  min: -Infinity,
  max: Infinity,
  step: 1,
  /** textarea 特有属性 */
  minRows: 3,
  maxRows: 6,
  resize: false,
})

const emits = defineEmits<IEmits>()

const namespace = "custom-input"

const getTextInputRadius = () => {
  const radius = props.radius && props.radius >= 0 ? props.radius : inputRadiusMap[props.size]
  const slots = useSlots()
  const leftRadius = `${slots.leftSide ? 0 : radius}px`
  const rightRadius = `${slots.rightSide ? 0 : radius}px`
  return `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`
}

/** type = text */
const handleInputTextChange = (e: Event): void => {
  emits("update:modelValue", (e.target as HTMLInputElement)?.value)
}

/*
 * type = number
 */
/** 数字输入框失焦时检测输入框内容 */
const handleInputNumberBlur = (e: FocusEvent): void => {
  let value = Number((e.target as HTMLInputElement)?.value)
  if (Number.isNaN(value) || value < props.min) {
    value = props.min
  } else if (value > props.max) {
    value = props.max
  } else {
    // do nothing
  }
  emits("update:modelValue", value)
}
/** 点击上箭头 */
const handleClickInputNumberUp = (): void => {
  const value = Number(props.modelValue) + props.step
  if (value > props.max) { return }
  emits("update:modelValue", value)
}
/** 点击下箭头 */
const handleClickInputNumberDown = (): void => {
  const value = Number(props.modelValue) - props.step
  if (value < props.min) { return }
  emits("update:modelValue", value)
}

/*
 * type = textarea
 */
const getTextAreaHeightRange = (): { minHeight: number, maxHeight: number } => {
  const { minRows, maxRows, size } = props
  const lineHeight = 1.5
  const fontSize = inputFontSizeMap[size]
  const padding = inputPaddingMap[size]
  const minHeight = Math.round(lineHeight * fontSize * minRows + padding * 2)
  const maxHeight = Math.round(lineHeight * fontSize * maxRows + padding * 2)
  return { minHeight, maxHeight }
}
const textAreaHeightRange = getTextAreaHeightRange()

const textareaRef = shallowRef<HTMLElement | null>(null)
/** 一个虚拟盒子，用来计算文字高度 */
const virtualBoxRef = shallowRef<HTMLElement | null>(null)

const textareaHeight = ref<number>(textAreaHeightRange.minHeight)

const handleInputTextAreaChange = (e: Event): void => {
  const borderHeight = 4
  const value = (e.target as HTMLInputElement)?.value
  const scrollHeight = (textareaRef.value || {}).scrollHeight || 0
  let finHeight = scrollHeight < textAreaHeightRange.minHeight
    ? textAreaHeightRange.minHeight
    : scrollHeight + borderHeight

  // 在没有滚动条时需要根据文字内容高度来设置textarea高度
  if (finHeight <= textAreaHeightRange.maxHeight) {
    const virtualBoxHeight = (virtualBoxRef.value as HTMLElement).clientHeight + borderHeight
    if (virtualBoxHeight <= finHeight) {
      finHeight = virtualBoxHeight
    }
  }
  textareaHeight.value = finHeight
  emits("update:modelValue", value)
}
</script>

<style src="./custom-input.scss" lang="scss" scoped></style>