<template>
  <div class="editor-wrapper fill">
    <!--  根splitter  -->
    <editor-splitter
      v-if="rootSplitterId"
      :id="rootSplitterId"
      :width="modulesSize.editorWidth"
      :height="modulesSize.editorHeight"
    ></editor-splitter>
  </div>
</template>

<script setup lang="ts">
import { useEditorWrapperStore } from "@store/editor-wrapper"
import EditorSplitter from "@views/components/editor-splitter/editor-splitter.vue"
import { useLayoutStore } from "@store/layout"
import { watch } from "vue"
import { storeToRefs } from "pinia"
import useEditorWrapperState from "@hooks/use-editor-wrapper-state"

const editorWrapperStore = useEditorWrapperStore()
const layoutStore = useLayoutStore()
const { modulesSize } = layoutStore
const { rootSplitterId } = storeToRefs(editorWrapperStore)
const { initDefaultWrapper } = useEditorWrapperState()

watch(() => layoutStore.hasInitModulesSize, () => {
  /** 初始化编辑窗口结构 */
  initDefaultWrapper()
})
</script>

<style lang="scss" scoped></style>