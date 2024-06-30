<template>
  <modal
    title="上传文件"
    width="600"
    top="85"
    bottom="85"
    :show-footer="false"
    @close="handleCloseModal">
    <div class="font-s active-text code-font mt-s">
      <span>支持 HTML、CSS、JS、MD、PUG、SASS、SCSS、STYL、LESS、COFFEE、TS、VUE 及 JSX 格式的文件</span>
    </div>
    <div class="mt-xs">
      <div class="font-xs red1-text flex-y-center renew-line-s">
        <span class="mr-xs">注意: 上传相应格式的文件会覆盖对应窗口的代码</span>
        <help-popover
          append-to-body
          level="1001"
          describe="预处理语言对应着其编译后语言的窗口，如MD对应的窗口为HTML。"
          :position="Position.BOTTOM"
        ></help-popover>
      </div>
    </div>
    <!-- 拖拽上传文件区域 -->
    <div
      class="upload-area mt-l cursor-pointer relative p-y-l"
      :class="highlightDragArea ? 'active' : ''"
      @click="handleClickDragArea"
      @dragover.prevent=""
      @dragenter="highlightDragArea = true"
      @dragleave="highlightDragArea = false"
      @drop.prevent="handleDropFile">
      <div class="font-xs describe-text text-center p-y-xxl events-none">
        <span>拖拽文件到此区域/</span>
        <span class="primary1-text">点击上传文件</span>
      </div>
      <input
        class="display-none"
        type="file"
        ref="fileInput"
        multiple
        @change="handleChooseFiles($event)"/>
    </div>

    <!-- start 已上传文件列表 -->
    <div v-if="chosenFiles.length" class="file-list mt-l">
      <div class="describe-text mb-s">已选择文件列表</div>
      <div
        v-for="(file, index) in chosenFiles"
        :key="index"
        class="file relative p-y-s flex-jcb font-xs">
        <span class="file-name code-font active-text font-xs flex-1">{{ file.name }}</span>
        <span class="no-active-text mr-l">{{ getFileSizeText(file) }}</span>
        <div
          class="delete-btn cursor-pointer text-hover-error fade-ease fill-h p-x-l flex-y-center"
          title="删除文件"
          @click="chosenFiles.splice(index, 1)">
          <i class="icon iconfont icon-bin font-m"></i>
        </div>
      </div>
    </div>

    <custom-button
      class="mt-l"
      fill
      custom-class="radius-l font-s"
      :disabled="!chosenFiles.length"
      :type="BtnType.PRIMARY"
      :size="Size.X_LARGE"
      @click="handleUpdateFiles"
    >上传文件</custom-button>
    <div v-if="isShowSplitHTML" class="mt-xs flex-x-center">
      <div class="active-text flex-y-center renew-line-s mt-l">
        <checkbox class="mr-xs" v-model="isSplitHTML">分解HTML</checkbox>
        <help-popover
          append-to-body
          level="1002"
          describe="我们将分解HTML中的各部分的代码以及引入的外部链接，将他们配置到实例中。"
          :position="Position.TOP"
        ></help-popover>
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import Modal from "@components/modal/modal.vue"
import HelpPopover from "@views/components/help-popover/help-popover.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import Checkbox from "@components/form/checkbox/checkbox.vue"
import { useCommonStore } from "@store/common"
import { BtnType, Position, Size } from "@type/interface"
import { computed, ref, shallowRef } from "vue"
import { getFileMimeType, getFileSizeText } from "@utils/tools/file"
import { setAllowMimeTypeFiles, chosenFiles, isSplitHTML, processUploadFiles } from "./upload-code-modal"
import { MimeType } from "@type/prep"
import message from "@components/message-list/message-list"

const commonStore = useCommonStore()
const { updateDisplayModal } = commonStore

const fileInput = shallowRef<HTMLInputElement | null>(null)
/** 清除input中上一次传入的文件，因为如果不清除，下次上传同一个文件时不会触发change事件 */
const clearInputFiles = () => {
  if (!fileInput.value) { return }
  fileInput.value.value = ""
}
/** 点击拖拽区域 */
const handleClickDragArea = () => {
  // 手动触发input点击，如果直接将input展示在拖拽区域内会影响拖拽文件进入时的高亮效果
  fileInput.value?.click()
}
/** input选择文件 */
const handleChooseFiles = (e: Event) => {
  const inputElement = e.target as HTMLInputElement
  const files = inputElement.files
  if (!files?.length) { return }
  setAllowMimeTypeFiles(files)
  clearInputFiles()
}

const highlightDragArea = ref<boolean>(false)
/** 文件拖拽到上传区域释放 */
const handleDropFile = (e: DragEvent) => {
  highlightDragArea.value = false
  const files = e.dataTransfer?.files
  if (!files?.length) { return }
  setAllowMimeTypeFiles(files)
}

const isShowSplitHTML = computed(() => {
  /** 只有上传了html文件才展示分割html文件的选项 */
  return chosenFiles.some(({ name }) => getFileMimeType(name) === MimeType.HTML)
})

const processCloseModal = () => {
  clearInputFiles()
  updateDisplayModal(null)
}
const handleCloseModal = () => {
  processCloseModal()
}

/** 点击上传文件按钮 */
// TODO: 兼容单文件组件下进行文件上传
const handleUpdateFiles = async () => {
  await processUploadFiles(chosenFiles)
  message.success("代码上传成功")
  chosenFiles.splice(0)
  processCloseModal()
}
</script>

<style lang="scss" scoped>
.upload-area {
  border: 2px dashed var(--color-form-item);
  border-radius: 8px;
  &.active {
    background-color: var(--color-main-bg-1);
  }
  .upload-input {
    right: 0;
    top: 0;
    opacity: 0;
  }
}
</style>