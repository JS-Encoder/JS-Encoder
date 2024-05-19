<template>
  <div class="navbar fill-w pr-xl code-font flex-y-center bg-main1 no-select">
    <!-- logo信息 -->
    <router-link to="/" custom v-slot="{ navigate }">
      <div class="flex-y-center fill-h" @click="navigate">
        <div class="logo fill-h flex-center" title="logo">
          <img src="../../../assets/images/logo.svg" alt="logo" />
        </div>
        <span class="logo-text fw-bold mr-s primary1-text" title="JS-Encoder">JS-Encoder</span>
      </div>
    </router-link>

    <!-- 版本 -->
    <span class="version font-xxs pt-xs describe-text" title="version">v{{ projectConfig.version }}</span>

    <!-- 占位 -->
    <div class="flex-1"></div>

    <!-- 右侧菜单 -->
    <div class="right-side-menu flex-y-center">
      <custom-button outline class="mr-l" type="primary" size="small" @click="handleGoToOldVersion">去旧版</custom-button>
      <div
        class="menu-item cursor-pointer fade-ease"
        :title="showResult ? '隐藏预览窗口' : '显示预览窗口'"
        @click="handleClickTogglePreview">
        <i class="icon iconfont icon-move-right inline-block font-m" :class="showResult ? '' : 'rotate-180'"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import projectConfig from "../../../../package.json"
import { useLayoutStore } from "@store/layout"
import CustomButton from "@components/custom-button/custom-button.vue"
import { OLD_VERSION_URL } from "@utils/tools/config"

const layoutStore = useLayoutStore()

const processHideResult = () => {
  const { modulesSize: { resultWidth, editorWidth } } = layoutStore
  layoutStore.updateModuleSize({ editorWidth: editorWidth + resultWidth })
  layoutStore.updateIsShowResult(false)
}
const processShowResult = () => {
  const { modulesSize: { resultWidth, editorWidth } } = layoutStore
  layoutStore.updateModuleSize({ editorWidth: editorWidth - resultWidth })
  layoutStore.updateIsShowResult(true)
}

const handleGoToOldVersion = () => {
  window.open(OLD_VERSION_URL, "_blank")
}

/** 是否显示结果窗口 */
const showResult = ref<boolean>(true)
const handleClickTogglePreview = (): void => {
  showResult.value = !showResult.value
  if (showResult.value) {
    processShowResult()
  } else {
    processHideResult()
  }
}
</script>

<style src="./navbar.scss" lang="scss" scoped></style>
