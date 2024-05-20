<template>
  <div class="go-to-line-panel active-text font-xs bg-main1 p-x-s pb-s pt-xs">
    <div class="mb-xs">
      <template v-if="isTargetValid">
        <span>Go to line {{ targetLine }}</span>
        <span v-show="targetCol"> and character {{ targetCol }}</span>
        <span>.</span>
      </template>
      <template v-else>
        <span>Type a line number (and character number) to navigate to.</span>
      </template>
    </div>
    <div
      class="target-input-wrapper bg-main3 border-box flex-y-center pr-xs"
      :class="isTargetFocus ? 'focus' : ''">
      <input
        class="target-input fill-w bg-main3 active-text border-box p-x-s font-xs"
        v-model="target"
        type="text"
        ref="targetInputRef"
        placeholder="Example: '1,0' press Enter to navigate to."
        @focus="isTargetFocus = true"
        @blur="isTargetFocus = false"
        @keypress.enter="handlePressEnter"
        @keypress.esc="handlePressEsc"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef, watch } from "vue"
import { IProps } from "./go-to-line"
import { CodemirrorBase } from "@utils/editor/utils/codemirror-base"
import { toggleGoToLinePanel } from "@utils/editor/panels/go-to-line"
import useEscClose from "@hooks/use-esc-close"

const props = defineProps<IProps>()

const isPanelVisible = ref<boolean>(true)
const isTargetFocus = ref<boolean>(false)
const target = ref<string>("")
const targetLine = ref<number>(0)
const targetCol = ref<number>(0)
const isTargetValid = ref<boolean>(false)
let maxLine: number = 0

const baseTools = new CodemirrorBase(props.view)

const initData = () => {
  isPanelVisible.value = true
  maxLine = baseTools.getLastLine().number
}

watch(target, () => {
  /** 输入的目标格式是否正确 */
  const isTargetFormatValid = /^\d+(,(\d)*)?$/.test(target.value)
  /** 输入的位置是否存在 */
  let isTargetPosValid = false
  if (isTargetFormatValid) {
    const [line, col] = target.value.split(",")
    const lineNumber = Number(line)
    // codemirror的列从0开始，这里从1开始计算
    const colNumber = Number(col || 1)
    // 判断目标位置是否存在
    if (lineNumber && lineNumber <= maxLine) {
      const lineLength = baseTools.getLine(lineNumber).text.length
      if (colNumber && colNumber <= lineLength + 1) {
        targetLine.value = lineNumber
        targetCol.value = colNumber
        isTargetPosValid = true
      }
    }
  }
  isTargetValid.value = isTargetFormatValid && isTargetPosValid
  // 行号更改的时候高亮所在行
  navigateToTarget()
})

const navigateToTarget = () => {
  if (!isTargetValid.value) { return }
  nextTick(() => {
    baseTools.setCursor({ line: targetLine.value, col: targetCol.value - 1 })
  })
}

const handlePressEnter = () => {
  toggleGoToLinePanel(props.view)
  navigateToTarget()
  props.view.focus()
}

// 按下 esc 隐藏 panel
useEscClose(isPanelVisible, () => {
  toggleGoToLinePanel(props.view)
})

const handlePressEsc = () => {
  toggleGoToLinePanel(props.view)
}

const targetInputRef = shallowRef<HTMLInputElement | null>(null)

onMounted(() => {
  // 查询输入框获取焦点
  nextTick(() => {
    targetInputRef.value!.focus()
  })
})

defineExpose({
  onMounted() {
    initData()
    targetInputRef.value!.focus()
  },
  onDestroy(){
    isTargetValid.value = false
    isPanelVisible.value = false
  },
})
</script>

<style src="./go-to-line.scss" lang="scss" scoped></style>