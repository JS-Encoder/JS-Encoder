<template>
  <div class="home fill code-font flex-col flex-y-center">
    <nav class="navbar fill-w fixed flex-jcb border-box">
      <div class="logo-wrapper flex-y-center">
        <div class="logo flex-center">
          <img class="logo-img font-r" src="../../assets/images/logo.svg" alt="logo">
        </div>
        <span
          class="logo-text fw-bold font-r mr-s text-clip primary-bg-gradient"
          :title="PROJECT_NAME"
        >{{ PROJECT_NAME }}</span>
      </div>
      <div class="navbar-menu flex">
        <div
          class="menu-item flex-y-center font-s fade-ease emphasis4-text cursor-pointer"
          v-for="menuItem in navMenuList"
          :key="menuItem.type"
          @click="handleClickNavMenuItem(menuItem.type)">
          <span>{{ menuItem.title }}</span>
        </div>
      </div>
    </nav>
    <main class="container active-text flex-1 flex-y-center">
      <div class="introduce-wrapper fill-w">
        <div class="typewrite-name fw-bold">
          <span class="text-clip primary-bg-gradient">{{ typewriteName }}</span>
        </div>
        <div class="introduce mt-xl">
          <div class="introduce-text fw-bold font-l">{{ describeText }}</div>
          <div class="describe-wrapper">
            <div class="describe flex-y-center mt-s" v-for="(item, index) in projectDescribeTexts" :key="index">
              <i class="green2-text icon iconfont icon-message-success font-s"></i>
              <span class="font-s ml-s">{{ item }}</span>
            </div>
          </div>
        </div>
        <div class="btn-group fill-w mt-xxl flex-jcb">
          <div class="btn-group-left">
            <button class="btn-github" @click="handleJumpToGithub">
              <i class="icon iconfont icon-github-fill font-m"></i>
              <span class="ml-m code-font">Github</span>
            </button>
          </div>
          <div class="btn-group-right">
            <button class="btn-docs code-font" @click="handleJumpToHelp">说明文档</button>
            <button class="btn-start code-font" @click="handleJumpToInstance">体验</button>
          </div>
        </div>
      </div>
    </main>
    <footer class="footer fill-w flex-x-center">
      <div class="footer-container fill flex-y-center flex-jcb flex-sh">
        <div class="logo-wrapper flex-y-center">
          <div class="logo">
            <img class="logo-img" src="../../assets/images/logo.svg" alt="logo">
          </div>
          <span
            class="logo-text ml-s font-xl fw-bold text-clip primary-bg-gradient"
            :title="PROJECT_NAME"
          >{{ PROJECT_NAME }}</span>
        </div>
        <div class="flex-sh">
          <a class="font-xs bei-an-link fade-ease emphasis4-text" href="https://beian.miit.gov.cn/">黑ICP备19007665号-2</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { getRandom } from "@utils/tools/common"
import { PROJECT_NAME } from "@utils/tools/config"
import { nextTick, onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { HELP_DOCS_URL, GITHUB_REPO_URL } from "@utils/tools/config"
import { describeText, projectDescribeTexts, NavMenuType, navMenuList } from "./home"

const typewriteName = ref<string>("")
/** 打字效果 */
const startTypewrite = async () => {
  for (const char of PROJECT_NAME) {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        typewriteName.value += char
        nextTick(resolve)
      }, getRandom(100, 400))
    })
  }
}

const handleClickNavMenuItem = (type: NavMenuType) => {
  switch (type) {
    case NavMenuType.DOCS:
      handleJumpToHelp()
      break
    case NavMenuType.GITHUB:
    handleJumpToGithub()
      break
    default: {}
  }
}

/** 跳转到文档 */
const handleJumpToHelp = (): void => {
  window.open(HELP_DOCS_URL, "_blank")
}

/** 跳转到Github */
const handleJumpToGithub = (): void => {
  window.open(GITHUB_REPO_URL, "_blank")
}

const router = useRouter()
const handleJumpToInstance = (): void => {
  router.push("/code")
}

onMounted(() => {
  startTypewrite()
})
</script>

<style src="./home.scss" lang="scss" scoped></style>