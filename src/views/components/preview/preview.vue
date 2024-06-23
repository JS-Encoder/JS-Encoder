<template>
  <div class="flex-col fill-w" :class="namespace">
    <div class="bg-main2 flex no-select pr-l flex-sh" :class="`${namespace}-bar`">
      <!--tab-->
      <div
        class="fill-h text-hover-active cursor-pointer flex-y-center active"
        :class="`${namespace}-tab`">
        <span class="code-font">Output</span>
      </div>
      <!--占位-->
      <div class="flex-1"></div>
      <!--工具按钮-->
      <div
        class="flex-center"
        :class="`${namespace}-options`"
        v-for="option in previewOptions"
        :key="option.type">
        <icon-btn
          :size="IconBtnSize.MD"
          :icon-class="option.icon"
          :title="option.title"
          @click="handleClickOption(option.type)"
        ></icon-btn>
      </div>
    </div>
    <div class="flex-1 relative" :class="[isFullScreen ? 'fixed pos-full high-layer' : '']">
      <!--预览html-->
      <div class="fill-h relative no-select" :class="`${namespace}-iframe-wrapper`">
        <iframe
          title="preview"
          id="iframe"
          name="iframe"
          ref="iframeElement"
          src="/src/assets/html/preview.html"
          class="fill no-border absolute pos-full bg-white"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups
                  allow-presentation allow-same-origin allow-scripts"
          allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope;
                payment; ambient-light-sensor; encrypted-media; fullscreen;"
          :class="`${namespace}-iframe`"
        ></iframe>
        <!--遮罩层-->
        <div
          v-show="isShowSize"
          class="fill absolute pos-full over-hidden no-select"
          :class="`${namespace}-iframe-screen`">
          <!--尺寸显示-->
          <div
            class="absolute pos-left pos-bottom font-xxs describe-text p-x-s flex-center"
            :class="`${namespace}-iframe-size`">
            <span class="flex-sh">{{modulesSize.resultWidth}}px * {{modulesSize.previewHeight - 36}}px</span>
          </div>
        </div>
      </div>
      <!--新手引导-->
      <div
        v-if="isShowNewUserGuide"
        class="flex-col-center code-font font-xxl active-text absolute pos-full bg-main3 over-hidden"
        :class="`${namespace}-guide`">
        <div class="first-title">首次使用<span class="primary1-text p-x-s">JS-Encoder</span>?</div>
        <span class="font-r mt-xxl">查看帮助文档了解更多好用功能</span>
        <custom-button class="jump-btn flex-sh" :type="BtnType.PRIMARY" @click="handleJumpToHelp">前往文档</custom-button>
        <span
          class="text-hover-active fade-ease cursor-pointer mt-m font-xs"
          @click="handleSkipGuide"
        >跳过</span>
      </div>
      <!-- 全屏时顶部菜单 -->
      <div
        v-if="isFullScreen"
        class="top-bar bg-main1 p-y-xs absolute pos-origin pos-right high-layer flex-x-center fade-ease"
        :class="isFoldTopBar ? 'fold' : 'unfold'">
        <div class="flex-center p-x-xs" v-for="option in previewFullscreenOptions" :key="option.type">
          <icon-btn
            :size="IconBtnSize.MD"
            :icon-class="option.icon"
            :title="option.title"
            @click="handleClickOption(option.type)"
          ></icon-btn>
        </div>
        <div
          class="top-bar-folder absolute bg-main1 flex-center cursor-pointer fade-ease"
          @click="handleToggleFoldTopBar">
          <i class="icon iconfont icon-down active-text font-xs"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconBtn from "@components/icon-btn/icon-btn.vue"
import CustomButton from "@components/custom-button/custom-button.vue"
import { BtnType } from "@type/interface"
import { HELP_DOCS_URL } from "@utils/tools/config"
import { onMounted, ref, shallowRef } from "vue"
import { useLayoutStore } from "@store/layout"
import { IconBtnSize } from "@components/icon-btn/icon-btn.interface"
import { IProps, previewFullscreenOptions, previewOptions, PreviewOptionType } from "./preview"
import { IPreviewExpose } from "./preview.interface"
import { getLocalStorage, setLocalStorage } from "@utils/tools/storage"
import { LocalStorageKey } from "@utils/config/storage"
import PreviewService from "@utils/services/preview-service"

defineProps<IProps>()

/** 组件名 */
const namespace = "preview"
const { modulesSize } = useLayoutStore()

/** 新手引导 */
const hasHidedNewUserGuide = Boolean(getLocalStorage(LocalStorageKey.HAS_HIDED_NEW_USER_GUIDE))
const isShowNewUserGuide = ref<boolean>(!hasHidedNewUserGuide)

/** 跳过引导 */
const handleSkipGuide = (): void => {
  isShowNewUserGuide.value = false
  setLocalStorage(LocalStorageKey.HAS_HIDED_NEW_USER_GUIDE, true)
}

/** 跳转到文档 */
const handleJumpToHelp = (): void => {
  window.open(HELP_DOCS_URL, "_blank")
  setLocalStorage(LocalStorageKey.HAS_HIDED_NEW_USER_GUIDE, true)
}

const iframeElement = shallowRef<HTMLIFrameElement | null>()
let previewService: PreviewService

onMounted(() => {
  previewService = new PreviewService(iframeElement.value!)
})

/** 点击预览选项 */
const handleClickOption = (type: PreviewOptionType) => {
  switch(type) {
    case PreviewOptionType.FULLSCREEN:
    case PreviewOptionType.EXIT_FULLSCREEN:
      isFullScreen.value = !isFullScreen.value
      break
    case PreviewOptionType.REFRESH:
      previewService.refreshIframe()
      break
    default:
      // do nothing
  }
}

/** 是否全屏展示iframe */
const isFullScreen = ref<boolean>(false)
/** 是否缩起顶部操作栏（全屏下） */
const isFoldTopBar = ref<boolean>(false)
const handleToggleFoldTopBar = () => {
  isFoldTopBar.value = !isFoldTopBar.value
}

defineExpose<IPreviewExpose>({
  getIframe: () => previewService.getIframe(),
})
</script>

<style src="./preview.scss" lang="scss" scoped></style>