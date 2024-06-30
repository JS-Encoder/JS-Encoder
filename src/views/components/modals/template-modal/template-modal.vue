<template>
  <modal
    title="模板"
    width="730"
    top="85"
    bottom="85"
    okText="使用该模板"
    :esc-closeable="false"
    :confirm-btn-opts="{
      customClass: 'p-l',
      disabled: !currTemplate,
    }"
    @close="updateDisplayModal(null)"
    @confirm="handleConfirmModal">
    <div class="modal-sub-title">内置模板</div>
    <div class="modal-desc-text">选择你想使用的模板</div>
    <!--内置模板列表-->
    <div class="template-list pb-l">
      <template-card
        v-for="(item, index) in inbuiltTemplateList"
        :key="index"
        :template="item"
        :active="item.id === currTemplate?.id"
        @choose="handleChooseTemplate(item)"
      ></template-card>
    </div>
    <div class="modal-sub-title flex-y-center">
      <span>自定义模板</span>
      <help-popover class="ml-s" describe="你可以编写好模板代码添加相关配置并点击创建模板按钮即可创建自定义模板。"></help-popover>
      <div class="flex-1"></div>
      <custom-button :type="BtnType.PRIMARY" :size="Size.SMALL" @click="handleClickCreateBtn">
        <i class="icon iconfont icon-add font-xxs mr-xs"></i>
        <span>以当前代码创建</span>
      </custom-button>
    </div>
    <div v-if="isTemplateLoading" class="mt-l">
      <loading></loading>
    </div>
    <!--自定义模板列表-->
    <div v-else-if="customTemplateList.length" class="template-list">
      <template-card
        v-for="(item, index) in customTemplateList"
        :key="index"
        :template="item"
        :active="item.id === currTemplate?.id"
        @choose="handleChooseTemplate(item)"
        @edit="handleClickEditTemplate(item)"
        @delete="handleClickDeleteTemplate(item)"
      ></template-card>
    </div>
    <template v-else>
      <!-- 缺省提示 -->
      <div class="flex-col flex-center bg-main3 radius-l blank-tip-area">
        <span class="no-active-text font-xxs mb-s">当前未创建任何自定义模板</span>
      </div>
    </template>
    <!-- 创建/编辑模板 -->
    <edit-template-modal
      v-if="isShowEditModal"
      :isEdit="!!currOperateTemplate"
      :template="currOperateTemplate"
      :confirm-loading="isEditModalLoading"
      @confirm="handleUpdateTemplate"
      @cancel="handleCancelUpdateTemplate"
    ></edit-template-modal>
  </modal>
  <!-- 确认提示 -->
  <modal
    title="提示"
    v-model="isShowEditTipModal"
    :mask-closable="false"
    :esc-closeable="false"
    show-cancel
    @cancel="isShowEditTipModal = false"
    @confirm="handleUseTemplate">
    <div class="active-text">
      <i class="icon iconfont icon-message-warning amber2-text"></i>
      <span>&nbsp;应用模板会覆盖当前编辑器的内容及配置哦~</span>
    </div>
  </modal>
  <!-- 删除提示 -->
  <modal
    title="提示"
    v-model="isShowDeleteTipModal"
    :mask-closable="false"
    :esc-closeable="false"
    show-cancel
    @cancel="isShowDeleteTipModal = false"
    @confirm="handleDeleteTemplate">
    <div class="active-text">
      <i class="icon iconfont icon-message-warning amber2-text"></i>
      <span>&nbsp;确认删除模板</span>
      <span class="fw-bold red2-text">&nbsp;{{ currOperateTemplate?.name }}&nbsp;</span>
      <span>么？</span>
    </div>
  </modal>
</template>

<script setup lang="ts">
import Modal from "@components/modal/modal.vue"
import HelpPopover from "@views/components/help-popover/help-popover.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import Loading from "@components/loading/loading.vue"
import TemplateCard from "./components/template-card/template-card.vue"
import EditTemplateModal from "./components/edit-template-modal/edit-template-modal.vue"
import { IEditTemplateForm } from "./components/edit-template-modal/edit-template-modal"
import { ref, shallowRef } from "vue"
import { useCommonStore } from "@store/common"
import { BtnType, Size } from "@type/interface"
import { inbuiltTemplateList } from "./template-modal"
import { ITemplateInfo } from "@utils/config/indexed-db"
import useTemplate from "./hooks/use-template"
import { checkIsCodeEmpty } from "@store/editor-wrapper"
import message from "@components/message-list/message-list"

const commonStore = useCommonStore()
const { updateDisplayModal } = commonStore

/** 当前选中的自定义模板id */
const currTemplate= ref<ITemplateInfo | null>(null)
const handleChooseTemplate = (template: ITemplateInfo) => {
  currTemplate.value = template
}

const { getCustomTemplateList, createTemplate, updateTemplate, applyTemplate, deleteTemplate } = useTemplate()
const customTemplateList = ref<ITemplateInfo[]>([])
const isTemplateLoading = ref<boolean>(false)
/** 设置自定义模板 */
const setCustomTemplateList = () => {
  customTemplateList.value = []
  isTemplateLoading.value = true
  getCustomTemplateList().then(({ success, data = [] }) => {
    if (!success) { return }
    isTemplateLoading.value = false
    customTemplateList.value = data
  })
}
setCustomTemplateList()

const isShowEditModal = ref<boolean>(false)
const isEditModalLoading = ref<boolean>(false)
/** 当前正在编辑或删除的模板 */
const currOperateTemplate = shallowRef<ITemplateInfo | undefined>(undefined)

/** 点击编辑模板 */
const handleClickEditTemplate = (template: ITemplateInfo) => {
  currOperateTemplate.value = template
  isShowEditModal.value = true
}

const processCloseEditModal = () => {
  currOperateTemplate.value = undefined
  isShowEditModal.value = false
}

/** 创建/更新模板 */
const handleUpdateTemplate = async (info: IEditTemplateForm) => {
  if (currOperateTemplate.value) {
    processUpdateTemplate(info)
  } else {
    processCreateTemplate(info)
  }
}

/** 取消创建/更新模板 */
const handleCancelUpdateTemplate = () => {
  processCloseEditModal()
}

const handleClickCreateBtn = () => {
  if (checkIsCodeEmpty()) {
    message.notice("请先编写代码再创建模板")
    return
  }
  isShowEditModal.value = true
}

/** 更新模板信息 */
const processUpdateTemplate = async (info: IEditTemplateForm) => {
  const { id } = currOperateTemplate.value!
  const editIndex = customTemplateList.value.findIndex((template) => id === template.id)
  const newTemplate = {
    ...customTemplateList.value[editIndex],
    name: info.name,
  }
  isEditModalLoading.value = true
  const { success } = await updateTemplate(newTemplate)
  if (success) {
    message.success("模板更新成功")
    customTemplateList.value[editIndex] = newTemplate
    processCloseEditModal()
  } else {
    message.error("模板更新失败")
  }
  isEditModalLoading.value = false
}

/** 创建新模板 */
const processCreateTemplate = async (info: IEditTemplateForm) => {
  isEditModalLoading.value = true
  const { success, data } = await createTemplate(info.name)
  if (success) {
    message.success("模板创建成功")
    customTemplateList.value.push(data!)
    processCloseEditModal()
  } else {
    message.error("模板创建失败")
  }
  isEditModalLoading.value = false
}

const isShowEditTipModal = ref<boolean>(false)
const handleConfirmModal = () => {
  if (checkIsCodeEmpty()) {
    processUseTemplate()
  } else {
    isShowEditTipModal.value = true
  }
}
const handleUseTemplate = () => {
  processUseTemplate()
}
const processUseTemplate = async () => {
  await applyTemplate(currTemplate.value!)
  isShowEditTipModal.value = false
  updateDisplayModal(null)
  message.success("应用模板成功")
}

const isShowDeleteTipModal = ref<boolean>(false)
const handleClickDeleteTemplate = (template: ITemplateInfo) => {
  currOperateTemplate.value = template
  isShowDeleteTipModal.value = true
}
const handleDeleteTemplate = async () => {
  const template = currOperateTemplate.value!
  const result = await deleteTemplate(template)
  if (!result.success) {
    message.error("删除模板失败")
    return
  }
  const deleteIndex = customTemplateList.value.findIndex((item) => template.id === item.id)
  customTemplateList.value.splice(deleteIndex, 1)
  isShowDeleteTipModal.value = false
  if (template.id === currTemplate.value?.id) {
    currTemplate.value = null
  }
  currOperateTemplate.value = undefined
  message.success("删除模板成功")
}
</script>

<style lang="scss" scoped>
.template-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.blank-tip-area {
  height: 100px;
}
</style>