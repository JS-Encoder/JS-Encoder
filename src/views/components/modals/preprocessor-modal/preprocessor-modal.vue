<template>
  <modal
    title="预处理"
    width="500"
    top="120"
    :confirm-btn-opts="{
      size: Size.LARGE,
      disabled: isComponentMode,
    }"
    @close="handleCloseModal"
    @confirm="handleConfirmModal">
    <div v-if="isComponentMode" class="describe-text font-xs">
      <span>无法修改预处理，因为当前使用了组件模式，你可以通过使用普通模式的模板来修改预处理。</span>
    </div>
    <template v-else>
      <div v-for="item in prepInfoList" :key="item.origin">
        <div class="active-text mt-l mb-xs code-font font-xs">{{item.title}}预处理</div>
        <custom-select
          select-style="width: 100%;"
          appendToBody
          v-model="cachePrepMap[item.origin]"
          :disabled="isComponentMode"
          :size="Size.LARGE"
          :data-list="item.prepList"
          @selected="($event) => handleSelectPrep($event, item.origin)">
        </custom-select>
      </div>
    </template>
  </modal>
</template>

<script setup lang="ts">
import Modal from "@components/modal/modal.vue"
import CustomSelect from "@components/form/custom-select/custom-select.vue"
import { useCommonStore } from "@store/common"
import { Size } from "@type/interface"
import { ref } from "vue"
import { prepInfoList } from "./preprocessor-modal"
import { OriginLang, Prep } from "@type/prep"
import { ISelectOption } from "@components/form/custom-select/custom-select"
import { useEditorConfigStore } from "@store/editor-config"
import { IEditorPrepMap } from "@type/settings"
import { storeToRefs } from "pinia"
import { useEditorWrapperStore } from "@store/editor-wrapper"

const { updateDisplayModal } = useCommonStore()
const editorWrapperStore = useEditorWrapperStore()
const { isComponentMode } = storeToRefs(editorWrapperStore)
const editorConfigStore = useEditorConfigStore()
const { updatePrepMap } = editorConfigStore
const { prepMap } = storeToRefs(editorConfigStore)

const cachePrepMap = ref<IEditorPrepMap>({ ...prepMap.value })

const handleSelectPrep = ({ value }: ISelectOption, origin: OriginLang) => {
  cachePrepMap.value[origin] = value as Prep
}

const handleCloseModal = () => {
  updateDisplayModal(null)
}

const handleConfirmModal = () => {
  updatePrepMap({ ...cachePrepMap.value })
  updateDisplayModal(null)
}
</script>

<style lang="scss" scoped></style>