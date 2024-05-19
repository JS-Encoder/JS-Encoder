<template>
  <modal
    width="300"
    top="220"
    :mask-closable="false"
    :esc-closeable="false"
    :show-close="false"
    :show-cancel="true"
    :title="`${isEdit ? '编辑' : '创建'}模板`"
    :confirm-btn-opts="{
      disabled: !editTemplateForm.name,
      loading: confirmLoading,
    }"
    @cancel="handleCancelModal"
    @confirm="emits('confirm', editTemplateForm)">
    <div class="active-text mt-l mb-xs code-font font-xs">模板名</div>
    <custom-input width="100%" v-model.trim="editTemplateForm.name"></custom-input>
  </modal>
</template>

<script setup lang="ts">
import Modal from "@components/modal/modal.vue"
import CustomInput from "@components/form/custom-input/custom-input.vue"
import { ref } from "vue"
import { IProps, IEmits, IEditTemplateForm } from "./edit-template-modal"

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const initFormValue: IEditTemplateForm = {
  name: "",
}
const editTemplateForm = ref<IEditTemplateForm>({ ...initFormValue })

const init = () => {
  const { isEdit, template } = props
  if (!isEdit) { return }
  editTemplateForm.value = { name: template?.name || "" }
}
init()

const handleCancelModal = () => {
  editTemplateForm.value = { ...initFormValue }
  emits("cancel")
}
</script>

<style lang="scss" scoped></style>