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
import { storeToRefs } from "pinia"

const editorWrapperStore = useEditorWrapperStore()
const layoutStore = useLayoutStore()
const { modulesSize } = layoutStore
const { rootSplitterId } = storeToRefs(editorWrapperStore)
</script>

<style lang="scss" scoped></style>