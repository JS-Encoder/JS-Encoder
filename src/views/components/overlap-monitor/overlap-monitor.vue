<script setup lang="ts">
/**
 * overlap-monitor组件用于监听拖拽的tab与其是否重叠，若重叠则判断是否分割视口，具体逻辑如下：
 * 首先，如果tab的50%以上与overlap-monitor重叠，那么将会进行窗口分割，tab拖动到overlap-monitor中的不同位置将会产生不同的分割结果。
 * 分割结果分别是：左分割、右分割、上分割、下分割和中分割（相当于占满，等于没有分割），这些结果的判定位置如下：
 * ┌——————————————————————————————————————————————————————————————————┐
 * │  上  │  上  │  上  │  上  │  上  │  上  │  上  │  上  │  上  │  上  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  上  │  上  │  上  │  上  │  上  │  上  │  上  │  上  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  左  │  中  │  中  │  中  │  中  │  中  │  中  │  右  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  左  │  中  │  中  │  中  │  中  │  中  │  中  │  右  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  左  │  中  │  中  │  中  │  中  │  中  │  中  │  右  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  左  │  中  │  中  │  中  │  中  │  中  │  中  │  右  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  左  │  中  │  中  │  中  │  中  │  中  │  中  │  右  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  左  │  中  │  中  │  中  │  中  │  中  │  中  │  右  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  左  │  下  │  下  │  下  │  下  │  下  │  下  │  下  │  下  │  右  │
 * │——————————————————————————————————————————————————————————————————│
 * │  下  │  下  │  下  │  下  │  下  │  下  │  下  │  下  │  下  │  下  │
 * └——————————————————————————————————————————————————————————————————┙
 * 相当于对整个窗口做了一百等分，如果tab的50%以上进入某一个区域，那么就会按照该区域的分割结果进行窗口分割
 */
import { watch, ref, computed, onMounted, shallowRef } from "vue"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { AreaPosition } from "@type/editor"

const emits = defineEmits<{
  (e: "selectPosition", pos: AreaPosition): void
}>()

const editorWrapperStore = useEditorWrapperStore()
const overlapMonitor = shallowRef<HTMLElement | null>(null)
const positionCapture = shallowRef<HTMLElement | null>(null)
let monitorWidth = 0
let monitorHeight = 0

const currPos = ref<AreaPosition>(AreaPosition.MIDDLE)

onMounted(() => {
  /** 初始化overlap-monitor宽高 */
  const { clientWidth, clientHeight } = overlapMonitor.value!
  monitorWidth = clientWidth
  monitorHeight = clientHeight
})

/** 监听tab拖拽状态变化 */
watch(() => editorWrapperStore.draggingTabInfo, (draggingTabInfo) => {
  if (!draggingTabInfo) {
    currPos.value = AreaPosition.NULL
  }
})

/**
 * 由于拖拽元素进入或离开子元素的时候会触发父元素的dragenter和dragleave事件
 * 并且无法通过阻止冒泡来阻止事件触发，因此只能通过一个规律：
 * 只有在dragging为0时，即一个dragenter事件刚好对应一个dragleave的时候才会执行dragleave事件的内容
 * 加上setTimeout是为了兼容火狐会同时执行dragenter事件和dragleave事件的问题
 */
let dragging = 0
const handleDragleave = (): void => {
  setTimeout(() => {
    dragging --
    if (dragging <= 0) {
      currPos.value = AreaPosition.NULL
    }
  }, 50)
}

const handleEnterArea = (e: DragEvent): void => {
  dragging ++
  currPos.value = ((e.target as HTMLElement).dataset.pos as AreaPosition)
}

const handleDrop = (e: MouseEvent): void => {
  emits("selectPosition", currPos.value)
  dragging = 0
  currPos.value = AreaPosition.NULL
}

const highlightAreaStyle = computed((): Record<string, any> => {
  /** 各种位置的高亮区域样式 */
  const posStyleMap = {
    [AreaPosition.UP]: { left: 0, top: 0, width: `${monitorWidth}px`, height: `${monitorHeight / 2}px` },
    [AreaPosition.DOWN]: {
      left: 0, top: `${monitorHeight / 2}px`, width: `${monitorWidth}px`, height: `${monitorHeight / 2}px`,
    },
    [AreaPosition.LEFT]: { left: 0, top: 0, width: `${monitorWidth / 2}px`, height: `${monitorHeight}px` },
    [AreaPosition.RIGHT]: {
      left: `${monitorWidth / 2}px`, top: 0, width: `${monitorWidth / 2}px`, height: `${monitorHeight}px`,
    },
    [AreaPosition.MIDDLE]: { left: 0, top: 0, width: `${monitorWidth}px`, height: `${monitorHeight}px` },
    [AreaPosition.NULL]: { left: 0, top: 0, width: 0, height: 0 },
  }
  return posStyleMap[currPos.value]
})
</script>

<template>
  <div
    class="overlap-monitor fill relative"
    ref="overlapMonitor"
    @dragleave.prevent="handleDragleave"
    @drop.prevent.stop="handleDrop"
    @dragover.prevent="">
    <!-- 专门用于监听元素拖动具体位置的区域 -->
    <!-- 直接事件委托监听所有区域的进入和离开 -->
    <div
      class="position-capture fill relative"
      ref="positionCapture"
      @dragenter.prevent="handleEnterArea"
      @drop.prevent.stop="handleDrop"
      @dragover.prevent="">
      <!-- 上 -->
      <div class="up1-area" :data-pos="AreaPosition.UP"></div>
      <div class="up2-area" :data-pos="AreaPosition.UP"></div>
      <!-- 左 -->
      <div class="left1-area" :data-pos="AreaPosition.LEFT"></div>
      <div class="left2-area" :data-pos="AreaPosition.LEFT"></div>
      <!-- 下 -->
      <div class="down1-area" :data-pos="AreaPosition.DOWN"></div>
      <div class="down2-area" :data-pos="AreaPosition.DOWN"></div>
      <!-- 右 -->
      <div class="right1-area" :data-pos="AreaPosition.RIGHT"></div>
      <div class="right2-area" :data-pos="AreaPosition.RIGHT"></div>
      <!-- 中 -->
      <div class="middle-area" :data-pos="AreaPosition.MIDDLE"></div>
    </div>
    <!-- 高亮区域 -->
    <div class="highlight-area absolute" :style="highlightAreaStyle"></div>
  </div>
</template>

<style src="./overlap-monitor.scss" lang="scss" scoped></style>