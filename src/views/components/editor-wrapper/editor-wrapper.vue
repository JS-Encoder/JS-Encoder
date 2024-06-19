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
import { useRoute } from "vue-router"
import useTemplate from "@views/components/modals/template-modal/hooks/use-template"
import useInstanceLink from "@hooks/use-instance-link"

const editorWrapperStore = useEditorWrapperStore()
const layoutStore = useLayoutStore()
const { modulesSize } = layoutStore
const { rootSplitterId } = storeToRefs(editorWrapperStore)
const { initDefaultWrapper } = useEditorWrapperState()

const route = useRoute()

/**
 * 初始化部分，如果链接中带有配置信息，则将应用配置，否则使用默认配置
 */
const initWrapper = () => {
  const { query } = route
  const { applyTemplate } = useTemplate()
  const { getInstanceConfig } = useInstanceLink()
  const instanceConfig = getInstanceConfig(query.config as string)
  if (instanceConfig) {
    applyTemplate(instanceConfig)
  } else {
    initDefaultWrapper()
  }
}

watch(() => layoutStore.hasInitModulesSize, () => {
  // 初始化编辑窗口结构
  initWrapper()
}, { once: true })
</script>

<style lang="scss" scoped></style>