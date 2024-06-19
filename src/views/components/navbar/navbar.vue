<template>
  <div class="navbar fill-w pr-l code-font flex-y-center bg-main1 no-select">
    <!-- logo信息 -->
    <router-link to="/" custom v-slot="{ navigate }">
      <div class="flex-y-center fill-h cursor-pointer" @click="navigate">
        <div class="logo fill-h flex-center" title="logo">
          <img src="../../../assets/images/logo.svg" alt="logo" />
        </div>
        <span class="logo-text fw-bold mr-s primary1-text" title="JS-Encoder">JS-Encoder</span>
      </div>
    </router-link>

    <!-- 版本 -->
    <span class="version font-xxs pt-xs describe-text" title="version">v{{ appVersion }}</span>

    <!-- 占位 -->
    <div class="flex-1"></div>

    <!-- 右侧菜单 -->
    <div class="right-side-menu flex-y-center">
      <custom-button
        outline
        class="mr-l"
        type="primary"
        size="small"
        @click="handleGoToOldVersion"
      >去旧版</custom-button>
      <icon-btn
        icon-class="icon-share"
        custom-class="mr-s"
        title="分享"
        hover-bg="transparent"
        @click="handleClickShare"
      ></icon-btn>
      <icon-btn
        hover-bg="transparent"
        :icon-class="`icon-move-right ${showResult ? '' : 'rotate-180'}`"
        :title="showResult ? '隐藏预览窗口' : '显示预览窗口'"
        @click="handleClickToggleResult"
      ></icon-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useLayoutStore } from "@store/layout"
import CustomButton from "@components/custom-button/custom-button.vue"
import { OLD_VERSION_URL } from "@utils/tools/config"
import IconBtn from "@components/icon-btn/icon-btn.vue"
import useInstanceLink from "@hooks/use-instance-link"
import useTemplate from "../modals/template-modal/hooks/use-template"
import { copyString } from "@utils/tools/string"
import message from "@components/message-list/message-list"

// eslint-disable-next-line no-undef
const appVersion = APP_VERSION

const handleGoToOldVersion = () => {
  window.open(OLD_VERSION_URL, "_blank")
}

const layoutStore = useLayoutStore()
/** 是否显示结果窗口 */
const showResult = ref<boolean>(true)
/** 显示/隐藏预览窗口，更新模块宽度 */
const handleClickToggleResult = (): void => {
  showResult.value = !showResult.value
  const { modulesSize: { resultWidth, editorWidth } } = layoutStore
  layoutStore.updateModuleSize({
    editorWidth: editorWidth + (showResult.value ? -resultWidth : resultWidth),
  })
  layoutStore.updateIsShowResult(showResult.value)
}

const { stringifyInstanceConfig } = useInstanceLink()
/** 分享按钮复制配置链接 */
const handleClickShare = async () => {
  const { getTemplateBaseInfo } = useTemplate()
  // 将配置压缩编码
  const configStr = stringifyInstanceConfig(getTemplateBaseInfo())
  const shareLink = `${location.origin}${location.pathname}?config=${configStr}`
  await copyString(shareLink)
  message.success("复制链接成功！")
}
</script>

<style src="./navbar.scss" lang="scss" scoped></style>
