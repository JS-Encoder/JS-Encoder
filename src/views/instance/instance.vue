<template>
  <navbar></navbar>
  <div class="main-content flex over-hidden">
    <sidebar></sidebar>
    <!--编辑-->
    <div class="over-hidden">
      <editor-wrapper></editor-wrapper>
    </div>
    <!--结果-->
    <div class="flex" :style="{ width: `${resultWidth}px` }">
      <div class="resize-line fill-h">
        <!--分割线-->
        <split-line
          v-if="isShowResult"
          :size="4"
          :direction="SplitDirection.HORIZONTAL"
          @mousedown.prevent="handleResizeEditorAndResult"
        ></split-line>
      </div>
      <div :style="{ width: `calc(${resultWidth - resizeLineWidth}px)` }">
        <result></result>
      </div>
    </div>
  </div>
  <!--modals-->
  <component v-if="displayModal" :is="displayModalMap[displayModal]"></component>
</template>

<script setup lang="ts">
import Navbar from "@views/components/navbar/navbar.vue"
import Sidebar from "@views/components/sidebar/sidebar.vue"
import EditorWrapper from "@views/components/editor-wrapper/editor-wrapper.vue"
import TemplateModal from "@views/components/modals/template-modal/template-modal.vue"
import PreprocessorModal from "@views/components/modals/preprocessor-modal/preprocessor-modal.vue"
import CodeSettingsModal from "@views/components/modals/code-settings-modal/code-settings-modal.vue"
import LibrariesModal from "@views/components/modals/libraries-modal/libraries-modal.vue"
import UploadCodeModal from "@views/components/modals/upload-code-modal/upload-code-modal.vue"
import DownloadCodeModal from "@views/components/modals/download-code-modal/download-code-modal.vue"
import ShortcutModal from "@views/components/modals/shortcut-modal/shortcut-modal.vue"
import UpdateLogsModal from "@views/components/modals/update-logs-modal/update-logs-modal.vue"
import SplitLine from "@components/split-line/split-line.vue"
import Result from "@views/components/result/result.vue"
import { SplitDirection } from "@type/editor"
import { computed, onMounted, watch } from "vue"
import { getModulesHeight, getModulesWidth } from "./instance"
import { useLayoutStore } from "@store/layout"
import useWindowResize from "@hooks/use-window-resize"
import useBeforeUnload from "@hooks/use-before-unload"
import ModuleSizeService, { EDITOR_MIN_WIDTH, RESULT_MIN_WIDTH } from "@utils/services/module-size-service"
import { storeToRefs } from "pinia"
import { useCommonStore } from "@store/common"
import { ModalName } from "@type/interface"
import { listenMousemove } from "@utils/tools/event"
import { onBeforeRouteLeave } from "vue-router"

const layoutStore = useLayoutStore()
const {
  updateModuleSize,
  updateIsModulesResizing,
  updateHasInitModulesSize,
  modulesSize,
} = layoutStore
const { isShowResult, isFoldConsole } = storeToRefs(layoutStore)
const { clientWidth, clientHeight } = useWindowResize()

const commonStore = useCommonStore()
const { displayModal } = storeToRefs(commonStore)
const displayModalMap = {
  [ModalName.TEMPLATE]: TemplateModal,
  [ModalName.PREPROCESSOR]: PreprocessorModal,
  [ModalName.CODE_SETTINGS]: CodeSettingsModal,
  [ModalName.LIBRARIES]: LibrariesModal,
  [ModalName.UPLOAD_CODE]: UploadCodeModal,
  [ModalName.DOWNLOAD_CODE]: DownloadCodeModal,
  [ModalName.SHORTCUT]: ShortcutModal,
  [ModalName.UPDATE_LOG]: UpdateLogsModal,
}

if (import.meta.env.PROD) {
  useBeforeUnload()
}

const moduleSizeService = new ModuleSizeService()
onMounted(() => {
  // 设置初始模块尺寸
  updateModuleSize(moduleSizeService.getInitModulesSize())
  updateHasInitModulesSize()
  // 开始监听窗口尺寸变化更新对应模块尺寸
  startObserveWindowSize()
})

/** 监听窗口尺寸变化更新对应模块尺寸 */
const startObserveWindowSize = (): void => {
  watch(clientWidth, (newWidth: number, oldWidth: number) => {
    updateModuleSize(getModulesWidth(newWidth - oldWidth, modulesSize, isShowResult.value))
  })
  watch(clientHeight, (newHeight: number, oldHeight: number) => {
    updateModuleSize(getModulesHeight(newHeight - oldHeight, modulesSize, isFoldConsole.value))
  })
}

const handleResizeEditorAndResult = (e: MouseEvent): void => {
  const { resultWidth, editorWidth } = modulesSize
  // 拖动时在iframe上显示遮罩层避免鼠标划入iframe中导致事件失效
  updateIsModulesResizing(true)
  // 鼠标拖拉editor分隔栏改变editor和结果窗口的宽度
  listenMousemove({
    onMoving: (event) => {
      // 获取editor和result窗口的新尺寸
      const [editor, result] = moduleSizeService.getNewModulesSize(
        { width: editorWidth, minWidth: EDITOR_MIN_WIDTH },
        { width: resultWidth, minWidth: RESULT_MIN_WIDTH },
        true,
        e.clientX - event.clientX,
      )
      updateModuleSize({
        editorWidth: editor.width,
        resultWidth: result.width,
      })
    },
    onUp: () => {
      updateIsModulesResizing(false)
    },
  })
}

const resizeLineWidth = 1
const resultWidth = computed(() => isShowResult.value ? modulesSize.resultWidth - resizeLineWidth : 0)

onBeforeRouteLeave(() => {
  if (import.meta.env.PROD) {
    if (!window.confirm("你所做的更改可能未保存。")) {
      return false
    }
  }
  return true
})
</script>

<style lang="scss" scoped>
.main-content {
  height: calc(100% - 50px);
  .resize-line {
    width: 1px;
    background-color: var(--color-main-bg-2);
  }
}
</style>