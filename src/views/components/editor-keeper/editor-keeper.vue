<template>
  <div class="editor-keeper fill over-hidden" ref="editorKeeper"></div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, useAttrs, watch } from "vue"
import { IProps as IEditorProps } from "../editor/editor"
import EditorKeeperService, { IEditorInstance } from "@utils/services/editor-keeper-service"

interface IProps extends IEditorProps {
  tabId: number
}

const props = withDefaults(defineProps<IProps>(), {
  code: "",
  modelValue: "",
})
const editorKeeperService = new EditorKeeperService()
const attrs = useAttrs()

const editorKeeper = shallowRef<HTMLElement | null>(null)
let editorInstance: IEditorInstance

onMounted(() => {
  editorInstance = editorKeeperService.getEditorInstance(props.tabId, { ...props, ...attrs })
  editorKeeper.value?.appendChild(editorInstance.wrapper)
  /**
   * 监听props变化，使用createVNode传递props可能会失去响应式
   * 正确的使用方法是在props改变的时候使用新的props重新创建VNode然后render到之前的dom中
   */
  watch(
    () => props.settings,
    () => rerenderVNode(),
    { deep: true },
  )

  watch(
    [
      () => props.extensions,
      () => props.code,
      () => props.modelValue,
      () => props.prep,
      () => props.showEditor,
    ],
    () => rerenderVNode(),
  )
})

const rerenderVNode = () => {
  editorKeeperService.rerender(props.tabId, { ...props, ...attrs })
}
</script>

<style lang="scss" scoped></style>