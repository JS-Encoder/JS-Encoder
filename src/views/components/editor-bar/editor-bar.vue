<template>
  <div class="editor-bar bg-main2 flex no-select over-x-auto" ref="editorBarRef">
    <!-- tab位置切换动画 -->
    <template v-for="(tabId, index) in editor.tabIds" :key="tabId">
      <!-- tab间的分隔线 -->
      <div class="split-line fill-h bg-main3" v-if="!!index"></div>
      <!-- tab本身 -->
      <div
        class="editor-tab flex-y-center fill-h text-hover-active cursor-pointer flex-y-center"
        :class="{
          'active': tabId === editor.displayTabId,
          'dragging': tabId === draggingTabInfo?.tabId,
          'highlight': tabId === currOverlapTabId,
        }"
        draggable="true"
        @mousedown="handleClickTab(tabId)"
        @dragstart="handleTabDragstart(tabId)"
        @dragend="handleTabDragend(tabId)"
        @drop.prevent="handleTabDrop()"
        @dragover.prevent="handleTabDragover(tabId)">
        <span class="editor-tab-title code-font">{{ tabId2PrepMap[tabId] }}</span>
      </div>
    </template>
    <!-- 占位 -->
    <div
      class="flex-1 bg-main2"
      :class="isOverlapRightSide ? 'highlight' : ''"
      @dragover.prevent="handleTabDragOverRightSide()"
      @dragleave.prevent="handleTabDragLeaveRightSide()"
      @drop.prevent="handleTabDrop()"
    ></div>
    <div
      class="flex flex-sh bg-main2 right-side pr-s sticky"
      :class="isOverlapRightSide ? 'highlight' : ''"
      @dragover.prevent="handleTabDragOverRightSide()"
      @dragleave.prevent="handleTabDragLeaveRightSide()"
      @drop.prevent="handleTabDrop()">
      <!-- 直接展示出的选项 -->
      <div class="display-opts flex-y-center" v-if="sideOptions.display.length">
        <template v-for="(item, index) in sideOptions.display" :key="index">
          <icon-btn
            :size="IconBtnSize.MD"
            :title="editorSideOptionsListMap[item].text"
            :icon-class="editorSideOptionsListMap[item].icon"
            @click="handleClickSideOptions(item)"
          ></icon-btn>
        </template>
      </div>
      <!-- 更多选项菜单 -->
      <div class="more-opts" v-show="sideOptions.more.length">
        <dropdown v-model="showSideMenu" :align="Align.RIGHT" append-to-body>
          <div class="more-icon-wrapper flex-center">
            <icon-btn :size="IconBtnSize.MD" title="更多" icon-class="icon-more"></icon-btn>
          </div>
          <template #options v-if="sideOptions.more.length">
            <dropdown-item
              v-for="(item, index) in sideOptions.more"
              :key="index"
              @click="handleClickSideOptions(item)">
              <span>{{ editorSideOptionsListMap[item].text }}</span>
            </dropdown-item>
          </template>
        </dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from "vue"
import { storeToRefs } from "pinia"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { Align } from "@type/interface"
import { IconBtnSize } from "@components/icon-btn/icon-btn.interface"
import useEditorSideOptions, { EditorSideOptionType, editorSideOptionsListMap } from "./hooks/use-editor-side-options"
import useDragleaveJudge from "@hooks/use-dragleave-judge"
import Dropdown from "@components/dropdown/dropdown.vue"
import DropdownItem from "@components/dropdown/dropdown-item.vue"
import IconBtn from "@components/icon-btn/icon-btn.vue"
import UtilService from "@utils/services/util-service"
import { toggleMarkdownToolsPanel } from "@utils/editor/panels/markdown-tools"
import EditorKeeperService from "@utils/services/editor-keeper-service"
import useWheelDirective from "@hooks/use-wheel-directive"
import useCodeFormatting from "@hooks/use-code-formatting"

const props = defineProps<{
  editorId: number
  splitterId: number
}>()

const editorBarRef = shallowRef<HTMLElement | null>(null)
onMounted(() => {
  useWheelDirective(editorBarRef.value!)
})

const editorWrapperStore = useEditorWrapperStore()
const { updateEditor, updateDraggingTabInfo, deleteSplitter, updateSplitter, updateCodeMap } = editorWrapperStore
const { editorMap, codeMap, draggingTabInfo, tabMap, editorSplitterMap,
  tabId2PrepMap } = storeToRefs(editorWrapperStore)

const utilService = new UtilService()

/**
 * tab的拖动逻辑如下
 * 1. tab在拖动到其他tab上时，目标tab会高亮；此时释放鼠标，高亮消失，被拖动的tab移动到目标tab的左边
 * 2. tab在拖动到editor-bar的右侧空白位置时，右侧空白位置高亮；此时释放鼠标，高亮消失，被拖动的tab移动到editor-bar中所有tab的最右边
 */

/** 当前tab所在editor */
const editor = editorMap.value[props.editorId]
/** tab是否拖动到了右侧边栏 */
const isOverlapRightSide = ref<boolean>(false)
/** 当前被重叠(高亮)的tabId */
const currOverlapTabId = ref<number | null>(null)

/** 点击tab，设置editor下展示的tabId */
const handleClickTab = (tabId: number) => {
  updateEditor(props.editorId, { displayTabId: tabId })
  focusOnEditor(tabId)
}
/** 开始拖拽时上报拖拽tab信息 */
const handleTabDragstart = (tabId: number): void => {
  const { editorId, splitterId } = props
  updateDraggingTabInfo({ tabId, editorId, splitterId })
}
/** 处理tab重叠情况，设置被重叠的tab的index，这时会在被重叠的tab左边插入一个与移动tab大小一致的高亮占位 */
const handleTabDragover = (tabId: number): void => {
  if (currOverlapTabId.value === tabId) { return }
  currOverlapTabId.value = tabId
}
/** 处理tab在右侧工具栏的移入和移出*/
const handleTabDragOverRightSide = (): void => {
  currOverlapTabId.value = null
  isOverlapRightSide.value = true
}
const handleTabDragLeaveRightSide = (): void => {
  isOverlapRightSide.value = false
}
/** 处理拖拽移出(dragleave)事件 */
const resetHookState = useDragleaveJudge(editorBarRef, () => {
  resetDragState()
})
/** 拖动结束，清除数据 */
const handleTabDragend = (tabId: number): void => {
  isOverlapRightSide.value = false
  updateDraggingTabInfo(null)
  focusOnEditor(tabId)
}
/**
 * 拖动释放，对tab位置进行处理
 * 如果是在右侧边栏释放tab，则tab放到最右边，若是放到其他tab上，则放到对应tab的左边
 * 如果没有传tabId表示是右侧工具栏
 */
const handleTabDrop = (): void => {
  const { editorId: fromEditorId, tabId: draggingTabId } = draggingTabInfo.value!
  const { tabIds: fromTabIds } = editorMap.value[fromEditorId]
  const { id: toEditorId, tabIds: toTabIds } = editor
  /** tab所释放的目标是否为当前editor */
  const isCurrEditor = props.editorId === fromEditorId
  /** 拖拽tab的index */
  const draggingTabIndex = fromTabIds.findIndex((id) => draggingTabId === id)
  /** 是否是fromEditor内的唯一tab */
  const isUniqueTab = editorMap.value[fromEditorId].tabIds.length === 1
  if (isOverlapRightSide.value) {
    // tab拖到右侧工具栏
    // 将tab挪到最后
    const finalToTabIds = utilService.moveArrayItem(toTabIds, draggingTabIndex, toTabIds.length - 1)
    if (!isCurrEditor) {
      const finalFromTabIds = utilService.deleteFirstMatchArrayItem(fromTabIds, draggingTabId)
      // 更新tab起始editor的信息
      updateEditor(fromEditorId, {
        tabIds: finalFromTabIds,
        ...(finalFromTabIds.length ? { displayTabId: finalFromTabIds[0] } : null),
      })
      updateEditor(toEditorId, { tabIds: [...toTabIds, draggingTabId], displayTabId: draggingTabId })
      if (isUniqueTab) {
        processUniqueTabEditor()
      }
    } else {
      updateEditor(toEditorId, { tabIds: finalToTabIds, displayTabId: draggingTabId })
    }
  } else {
    // tab拖到其他tab上
    /** 当前被重叠(高亮)tab的index */
    const currOverlapTabIndex = toTabIds.findIndex((id) => currOverlapTabId.value === id)
    if (isCurrEditor) {
      // 如果是当前editor，直接将tab插入到高亮tab的左边
      const finalToTabIds = utilService.moveArrayItem(toTabIds, draggingTabIndex, currOverlapTabIndex)
      updateEditor(toEditorId, { tabIds: finalToTabIds, displayTabId: draggingTabId })
    } else {
      const finalFromTabIds = utilService.deleteFirstMatchArrayItem(fromTabIds, draggingTabId)
      updateEditor(fromEditorId, {
        tabIds: finalFromTabIds,
        ...(finalFromTabIds.length ? { displayTabId: finalFromTabIds[0] } : null),
      })
      const finalToTabIds = [...toTabIds]
      finalToTabIds.splice(currOverlapTabIndex, 0, draggingTabId)
      updateEditor(toEditorId, { tabIds: finalToTabIds, displayTabId: draggingTabId })
      if (isUniqueTab) {
        processUniqueTabEditor()
      }
    }
  }
  updateDraggingTabInfo(null)
  // 清除drag计数
  resetHookState()
  // 清除数据，tab高亮消失
  resetDragState()
}

/**
 * 处理被拖动tab是fromEditor唯一tab的情况
 * 如果fromEditor的parentSplitter与toEditor的一样，那么就删掉parentSplitter的两个splitter，把toEditor设置给parentSplitter
 * 如果不一样的话只删除fromSplitter
 */
const processUniqueTabEditor = (): void => {
  const { editorId: fromEditorId } = draggingTabInfo.value!
  const { parentId: fromParentId } = editorMap.value[fromEditorId]
  const { id: toEditorId, parentId: toParentId } = editor
  const { id: fromSplitterId } = editorSplitterMap.value[fromParentId!]
  const { id: toSplitterId, parentId: toSplitterParentId } = editorSplitterMap.value[toParentId!]
  const isSameParent = checkIsSameParent(fromSplitterId, toSplitterId)
  if (isSameParent) {
    deleteSplitter(fromSplitterId, true)
    deleteSplitter(toSplitterId)
    updateSplitter(toSplitterParentId!, {
      children: [],
      editorId: toEditorId,
    })
  } else {
    deleteSplitter(fromSplitterId)
  }
}

/** 检查两个splitter的父splitter是否同一个 */
const checkIsSameParent = (splitterId1: number, splitterId2: number): boolean => {
  const splitter1 = editorSplitterMap.value[splitterId1]
  const splitter2 = editorSplitterMap.value[splitterId2]
  return splitter1.parentId === splitter2.parentId
}

const resetDragState = () => {
  currOverlapTabId.value = null
  isOverlapRightSide.value = false
}

/** 右侧工具栏菜单 */
const { showSideMenu, sideOptions } = useEditorSideOptions(editor.id)
const editorKeeperService = new EditorKeeperService()
const { formatEditorCode } = useCodeFormatting()
const sideOptionType2FuncMap = {
  [EditorSideOptionType.FORMAT_CODE]: async () => {
    const { id } = tabMap.value[editor.displayTabId]
    const formattedCode = await formatEditorCode(codeMap.value[id], tabId2PrepMap.value[id])
    updateCodeMap({ [id]: formattedCode })
    editorKeeperService.getEditorExposed(id).restoreViewScroll()
  },
  [EditorSideOptionType.MARKDOWN_TOOLS]: () => {
    toggleMarkdownToolsPanel(editorKeeperService.getEditorView(editor.displayTabId)!)
  },
}

const handleClickSideOptions = (type: EditorSideOptionType) => {
  sideOptionType2FuncMap[type]()
}

const focusOnEditor = (tabId: number) => {
  setTimeout(() => {
    editorKeeperService.getEditorView(tabId)?.focus()
  })
}
</script>

<style src="./editor-bar.scss" lang="scss" scoped></style>