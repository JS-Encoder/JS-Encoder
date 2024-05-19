<template>
  <div class="editor-view fill flex-col over-hidden relative">
    <editor-bar
      class="flex-sh"
      :editor-id="id"
      :splitter-id="splitterId"
    ></editor-bar>
    <div
      v-if="editorWrapperStore.draggingTabInfo"
      class="absolute fill-w overlap-monitor-wrapper high-layer">
      <overlap-monitor @select-position="handleSelectSplitPosition"></overlap-monitor>
    </div>
    <template v-for="tabId in editor.tabIds" :key="tabId">
      <editor-keeper
        v-show="tabId === editor.displayTabId"
        :show-editor="tabId === editor.displayTabId"
        :prep="tabId2PrepMap[tabId]"
        :code="codeMap[tabId]"
        :settings="editorSettings"
        :extensions="tabId2Extensions[tabId]"
        :tab-id="tabId"
        @code-changed="($event) => handleCodeChanged($event, tabId)"
      ></editor-keeper>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { useEditorConfigStore } from "@store/editor-config"
import { useCommonStore } from "@store/common"
import { AreaPosition, IEditor } from "@type/editor"
import { storeToRefs } from "pinia"
import EditorBar from "@views/components/editor-bar/editor-bar.vue"
import OverlapMonitor from "@views/components/overlap-monitor/overlap-monitor.vue"
import { computed, ref, shallowRef, watch } from "vue"
import { ICodemirrorEditorSettings } from "../editor/editor"
import { debounce } from "@utils/tools/common"
import { AnyObject } from "@type/interface"
import { IEmits, IProps } from "./editor-view"
import EditorExtensionsService from "@utils/editor/services/editor-extensions-service"
import useTaskQueueControl from "@hooks/use-task-queue-control"
import { Extension } from "@codemirror/state"
import EditorKeeper from "../editor-keeper/editor-keeper.vue"

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const editorWrapperStore = useEditorWrapperStore()
const editorConfigStore = useEditorConfigStore()
const commonStore = useCommonStore()
const { settings } = storeToRefs(editorConfigStore)
const { editorMap, codeMap, tabId2PrepMap } = storeToRefs(editorWrapperStore)
const { theme } = storeToRefs(commonStore)

/** 拖动tab分割窗口 */
const handleSelectSplitPosition = (splitPosition: AreaPosition): void => {
  emits("selectSplitPosition", splitPosition)
}

/** 当前视口editor */
const editor = ref<IEditor>(editorMap.value[props.id])

/** 编辑器内部设置 */
const editorSettings = computed<ICodemirrorEditorSettings>(() => {
  const { edit, indent, other } = settings.value
  return {
    ...edit,
    ...indent,
    style: getEditorStyle(),
    shortcutTemplate: other.shortcutTemplate,
  }
})

/** 获取编辑器内部需要设置的样式 */
const getEditorStyle = (): Record<string, AnyObject> => {
  const { font } = settings.value
  return {
    ".cm-scroller": {
      fontSize: `${font.fontSize}px`,
      fontFamily: `${font.fontFamily}`,
      lineHeight: 1.6,
    },
    "&.cm-focused": {
      outline: "none",
    },
  }
}

/** editor扩展处理 */
const editorExtensionsService = new EditorExtensionsService()
const tabId2Extensions = shallowRef<Record<number, Extension[]>>({})

watch(tabId2PrepMap, (newMap, oldMap) => {
  Object.keys(newMap).forEach((item) => {
    const tabId = Number(item)
    if (!oldMap || newMap[tabId] !== oldMap[tabId]) {
      const prep = tabId2PrepMap.value[tabId]
      tabId2Extensions.value[tabId] = editorExtensionsService.getEditorExtensions(prep, theme.value)
    }
  })
}, { immediate: true })

const { addTask, executeAndClearTaskQueue } = useTaskQueueControl()
/** 延迟存储 */
const saveDebounce = debounce(
  executeAndClearTaskQueue,
  settings.value.execute.delayTimeOfExecute,
)
/** code改变存入store */
const handleCodeChanged = (code: string, tabId: number): void => {
  addTask(() => {
    editorWrapperStore.updateCodeMap({ [tabId]: code })
  }, tabId)
  saveDebounce()
}
</script>

<style lang="scss" scoped>
.overlap-monitor-wrapper {
  top: 36px;
  height: calc(100% - 36px);
}
</style>