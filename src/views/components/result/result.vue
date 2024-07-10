<template>
  <preview
    ref="previewRef"
    :style="{ height: `${modulesSize.previewHeight}px` }"
    :isShowSize="layoutStore.isModulesResizing"
  ></preview>
  <div class="relative">
    <div class="resize-line absolute high-layer">
      <split-line
        size="4"
        :direction="SplitDirection.VERTICAL"
        @mousedown.prevent="(e: MouseEvent) => handleResizeConsoleAndPreview(e.clientY)"
      ></split-line>
    </div>
  </div>
  <console
    v-if="previewRef"
    :style="{ height: `${modulesSize.consoleHeight}px` }"
  ></console>
</template>

<script setup lang="ts">
import Preview from "@views/components/preview/preview.vue"
import Console from "@views/components/console/console.vue"
import { listenMousemove } from "@utils/tools/event"
import { useLayoutStore } from "@store/layout"
import ModuleSizeService, { CONSOLE_MIN_HEIGHT, PREVIEW_MIN_HEIGHT } from "@utils/services/module-size-service"
import { onMounted, shallowRef, watch } from "vue"
import PreviewService from "@utils/services/preview-service"
import ConsoleService from "@utils/services/console-service"
import { IPreviewExpose } from "../preview/preview.interface"
import { useEditorConfigStore } from "@store/editor-config"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { storeToRefs } from "pinia"
import { useConsoleStore } from "@store/console"
import SplitLine from "@components/split-line/split-line.vue"
import { SplitDirection } from "@type/editor"

const layoutStore = useLayoutStore()
const {
  modulesSize,
  updateIsModulesResizing,
  updateIsFoldConsole,
  updateModuleSize,
} = layoutStore
const editorWrapperStore = useEditorWrapperStore()
const editorConfigStore = useEditorConfigStore()
const { codeMap } = storeToRefs(editorWrapperStore)
const { prepMap, libraries, settings } = storeToRefs(editorConfigStore)
const consoleStore = useConsoleStore()
const { settings: consoleSettings } = storeToRefs(consoleStore)

const moduleSizeService = new ModuleSizeService()

const handleResizeConsoleAndPreview = (startY: number): void => {
  const { consoleHeight, previewHeight } = modulesSize
  // 拖动时在iframe上显示遮罩层避免鼠标划入iframe中导致事件失效
  updateIsModulesResizing(true)
  updateIsFoldConsole(false)
  // 鼠标拖拉console分隔栏改变console和iframe的高度
  listenMousemove({
    onMoving: (event) => {
      // 获取console和preview窗口的新尺寸
      const [preview, console] = moduleSizeService.getNewModulesSize(
        { height: previewHeight, minHeight: PREVIEW_MIN_HEIGHT },
        { height: consoleHeight, minHeight: CONSOLE_MIN_HEIGHT },
        false,
        startY - event.clientY,
      )
      // 更新尺寸
      updateModuleSize({
        previewHeight: preview.height,
        consoleHeight: console.height,
      })
    },
    onUp: () => {
      updateIsModulesResizing(false)
    },
  })
}

const previewRef = shallowRef<IPreviewExpose | null>()
let previewService: PreviewService
let consoleService: ConsoleService

const initResult = () => {
  // 获取到iframe，进行初始化
  const iframeElement = previewRef.value!.getIframe()
  previewService = new PreviewService(iframeElement!)
  consoleService = new ConsoleService(iframeElement!)

  processRefreshIframe()
}

const processRefreshIframe = () => {
  // 设置iframe刷新前后需要执行的额外操作
  previewService.setRefreshOptions({
    onIframeUpdated: (iframe) => {
      consoleService.init(iframe)
    },
    onBeforeRefresh: (iframe) => {
      // 清空控制台
      if (consoleSettings.value.autoClear) {
        consoleService.clear()
      }
      iframe.contentWindow!.onerror = (message) => {
        consoleService.error(message)
      }
      iframe.contentWindow!.onunhandledrejection = (message) => {
        consoleService.error(`Unhandled promise rejection: ${message.reason}`)
      }
    },
    onRefreshed: () => {},
  })
  /**
   * 监听改变处理iframe的刷新，目前暂有以下几种情况
   * 1. 代码更改
   * 2. 预处理语言更改
   * 3. 代码设置中头部标签（headTag）更改
   * 4. 使用外部库更改
   */
  watch([
    codeMap,
    prepMap,
    libraries,
    () => settings.value.other.headTags,
  ], () => {
    if (settings.value.execute.autoExecute) {
      previewService.refreshIframe()
    }
  }, { deep: true })
}

onMounted(() => {
  initResult()
})
</script>

<style lang="scss" scoped>
.resize-line {
  height: 2px;
  width: 100%;
}
</style>