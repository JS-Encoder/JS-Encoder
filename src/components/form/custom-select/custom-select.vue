<template>
  <div
    class="active-text relative bg-form-item code-font cursor-pointer"
    ref="selectRef"
    :class="[
      `${namespace}-wrapper`,
      `${namespace}-wrapper--${size}`,
      disabled ? `${namespace}-disabled` : '',
    ]"
    :style="selectStyle"
    @click="handleClickSelect">
    <div
      class="fade-ease"
      :class="`${namespace} ${namespace}--${size} ${isFocus ? 'highlight' : ''}`"
      :style="selectInnerStyle">
      <input
        v-if="showSearch"
        class="fill-w bg-form-item fade-ease code-font block"
        type="text"
        spellcheck="false"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInputTextChange($event)"/>
      <span v-else :class="`${namespace}-value`">{{getOptionLabel(currSelectItem)}}</span>
      <div class="icon-area flex-y-center absolute">
        <i
          class="icon iconfont icon-down font-xs line-h-unset flex-1 inline-flex text-hover-active fade-ease p-x-s"
          :class="isUnfoldOptions ? 'up' : ''"
        ></i>
      </div>
    </div>
    <teleport to="body" :disabled="!appendToBody">
      <div
        v-if="isUnfoldOptions"
        class="absolute bg-form-item shadow code-font common-scrollbar"
        :class="`${namespace}-options ${namespace}-options--${size}`"
        :style="{...optionsStyle}">
        <div
          class="cursor-pointer fade-ease fill-w"
          :class="`${namespace}-option ${modelValue === item.value ? 'selected' : ''}`"
          :style="optionStyle"
          v-for="(item, index) in dataList"
          :key="index"
          @click.stop="handleClickOption(item)"
        >{{getOptionLabel(item)}}</div>
      </div>
    </teleport>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, shallowRef, watch, watchEffect } from "vue"
import useClickOutside from "@hooks/use-click-outside"
import { ISelectOption, IProps, IEmits } from "./custom-select"
import { Size } from "@type/interface"

const props = withDefaults(defineProps<IProps>(), {
  size: Size.MEDIUM,
  appendToBody: false,
  dataList: () => [],
})
const emits = defineEmits<IEmits>()

const namespace = "custom-select"
/** 是否展开 */
const isUnfoldOptions = ref<boolean>(false)
/** 是否聚焦 */
const isFocus = ref<boolean>(false)

/** 当前选中选项 */
const currSelectItem = computed(() => {
  const { modelValue, dataList } = props
  return dataList.filter(({ value }) => value === modelValue)[0]
})
/** 获取选项的label，如果不传就取当前选中选项的label */
const getOptionLabel = (item?: ISelectOption): string => {
  return item
    ? String(item.label === undefined ? item.value : item.label)
    : ""
}

watchEffect(() => {
  if (props.dataList.length && isFocus.value && !props.disabled) {
    isUnfoldOptions.value = true
    setOptionStyle()
  }
})

/** 点击选择框 */
const handleClickSelect = (): void => {
  if (props.disabled) { return }
  isFocus.value = true
  if (!props.showSearch && props.dataList.length) {
    isUnfoldOptions.value = !isUnfoldOptions.value
  }
}
/** 点击选项缓存下选项内容 */
const handleClickOption = (item: ISelectOption): void => {
  emits("selected", item)
  emits("update:modelValue", item.value)
  isUnfoldOptions.value = false
  isFocus.value = false
}
/** 搜索模式下更改搜索框内容 */
const handleInputTextChange = (e: Event): void => {
  emits("update:modelValue", (e.target as HTMLInputElement)?.value)
}

// 监听弹窗外点击事件
const selectRef = shallowRef<HTMLElement | null>(null)
const isClickOutSide = useClickOutside(selectRef)
watch(isClickOutSide, () => {
  if (isClickOutSide.value) {
    isUnfoldOptions.value = false
    isFocus.value = false
  }
})

/** 定位样式 */
const optionsStyle = shallowRef<Record<string, string>>({})
onMounted(() => {
  setOptionStyle()
})

const setOptionStyle = () => {
  if (!props.appendToBody || !selectRef.value) { return }
  const { width = 0, height = 0, top = 0, left = 0 } = selectRef.value.getBoundingClientRect()
  optionsStyle.value = {
    top: `${top + height + 4}px`,
    left: `${left}px`,
    width: `${width}px`,
    transform: "none",
  }
}
</script>

<style src="./custom-select.scss" lang="scss"></style>