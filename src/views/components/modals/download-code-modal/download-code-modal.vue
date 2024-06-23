<template>
  <modal
    title="下载文件"
    width="500"
    top="85"
    bottom="85"
    :show-footer="false"
    @close="updateDisplayModal(null)">
    <div class="download-type flex code-font">
      <div
        class="single-file-type full-h radius-l flex-1 mr-l cursor-pointer p-xxl no-active-text fade-ease over-hidden"
        :class="currDownloadType === DownloadType.SINGLE ? 'active' : ''"
        @click="currDownloadType = DownloadType.SINGLE">
        <div class="flex-y-center">
          <i class="icon iconfont icon-single-file fade-ease"></i>
          <span class="type-title fw-bold">单文件</span>
        </div>
        <div class="font-xxs mt-m">将编译后的 HTML、CSS 和 JS 代码整合成一个 HTML 文件</div>
      </div>
      <div
        class="multiple-file-type full-h radius-l flex-1 mr-l cursor-pointer p-xxl no-active-text fade-ease over-hidden"
        :class="currDownloadType === DownloadType.MULTIPLE ? 'active' : ''"
        @click="currDownloadType = DownloadType.MULTIPLE">
        <div class="flex-y-center">
          <i class="icon iconfont icon-multiple-file fade-ease"></i>
          <span class="type-title fw-bold">多文件</span>
        </div>
        <div class="font-xxs mt-m">生成一个包含编译后的 HTML、CSS 和 JS 文件的文件夹压缩包</div>
      </div>
    </div>
    <div v-show="currDownloadType === DownloadType.MULTIPLE" class="download-pre-compile-file">
      <div class="flex-ais"><checkbox v-model="needCompiled">下载编译后的文件</checkbox></div>
    </div>
    <div class="flex-col flex-ais mt-l">
      <span class="mb-s font-xxs active-text">下载文件/文件夹名</span>
      <custom-input
        width="100%"
        placeholder="输入下载文件名，默认名是index"
        v-model="fileOrFolderName"/>
    </div>
    <div class="download-btn">
      <custom-button
        fill
        custom-class="radius-l font-s"
        :type="BtnType.PRIMARY"
        :size="Size.X_LARGE"
        @click="handleDownloadFiles"
      >下载文件</custom-button>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import Modal from "@components/modal/modal.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import Checkbox from "@components/form/checkbox/checkbox.vue"
import CustomInput from "@components/form/custom-input/custom-input.vue"
import { useCommonStore } from "@store/common"
import { Size, BtnType } from "@type/interface"
import { ref } from "vue"
import useDownloadCode from "./hooks/use-download-code"

const commonStore = useCommonStore()
const { updateDisplayModal } = commonStore

const enum DownloadType {
  SINGLE = "single",
  MULTIPLE = "multiple",
}
const currDownloadType = ref<DownloadType>(DownloadType.SINGLE)

const { downloadSingleFile, downloadMultipleFiles } = useDownloadCode()

/** 下载编译后的文件 */
const needCompiled = ref<boolean>(false)
/** 下载文件/文件夹名 */
const fileOrFolderName = ref<string>("")

const defaultFilename = "index"
/** 下载文件 */
const handleDownloadFiles = () => {
  if (currDownloadType.value === DownloadType.SINGLE) {
    downloadSingleFile(fileOrFolderName.value || defaultFilename)
  } else {
    downloadMultipleFiles(fileOrFolderName.value || defaultFilename, needCompiled.value)
  }
}
</script>

<style lang="scss" scoped>
.download-type {
  .single-file-type,
  .multiple-file-type {
    border: 2px solid var(--color-form-item);
    .type-title {
      margin-left: 8px;
    }
    .icon {
      font-size: 28px;
      opacity: 0;
      margin-left: -36px;
      color: var(--color-deep-bg-color);
    }
    &.active {
      color: var(--color-deep-bg-color);
      border-color: var(--color-primary2);
      background-color: var(--color-primary1);
      .icon {
        opacity: 1;
        width: auto;
        margin-left: 0;
      }
    }
  }
}
.download-pre-compile-file {
  margin-top: 36px;
}
.download-btn {
  margin-top: 36px;
}
</style>