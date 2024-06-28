<template>
  <modal
    v-model="isShowModal"
    title="格式化配置"
    width="500"
    okText="设置"
    show-cancel
    :mask-closable="false"
    :esc-closeable="false"
    @close="isShowModal = false"
    @cancel="isShowModal = false"
    @confirm="handleApplyConfig">
    <div class="active-text code-font mb-s font-xs">
      <span>请在下方以 JSON 格式配置 Prettier 格式化，具体可选配置项请参考</span>
      <a class="primary1-text" :href="PRETTIER_OPTIONS_URL" target="_blank">这里</a>
    </div>
    <div class="describe-text font-xxs mb-s">
      <span>注意：此处无需设置 </span>
      <span class="fw-bold code-font">useTab</span>
      <span>(是否使用制表符缩进)</span>
      <span> 和 </span>
      <span class="fw-bold code-font">tabWidth</span>
      <span>(缩进长度)，否则仍然会被外部设置的相同选项所覆盖</span>
    </div>
    <div class="editor-wrapper">
      <editor
        v-model="formattingCode"
        minimal
        :prep="Prep.JSON"
        :extensions="formattingEditorExtensions"
        :settings="formattingEditorSettings"
      ></editor>
    </div>
  </modal>
</template>

<script setup lang="ts">
import Modal from "@components/modal/modal.vue"
import editor from "@views/components/editor/editor.vue"
import useFormattingEditor from "./hooks/use-formatting-editor"
import { Prep } from "@type/prep"
import { ref, watch } from "vue"
import { PRETTIER_OPTIONS_URL } from "@utils/tools/config"
import message from "@components/message-list/message-list"
import { AnyObject } from "@type/interface"

const emits = defineEmits<{
  (e: "confirm", config: AnyObject): void
}>()

const isShowModal = defineModel<boolean>()

const {
  getFormattingEditorCode,
  formattingEditorExtensions,
  formattingEditorSettings,
  parseFormattingConfig,
} = useFormattingEditor()

const formattingCode = ref<string>(getFormattingEditorCode())

const handleApplyConfig = async () => {
  const config = await parseFormattingConfig(formattingCode.value)
  if (config) {
    emits("confirm", config)
    isShowModal.value = false
  } else {
    message.error("设置失败！请检查配置格式是否正确")
  }
}
</script>

<style lang="scss" scoped>
.editor-wrapper {
  height: 200px;
}
</style>