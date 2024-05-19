<template>
  <modal
    title="更新日志"
    width="730"
    top="85"
    bottom="85"
    :show-footer="false"
    @close="updateDisplayModal(null)">
    <loading v-if="isReleasesLoading" height="200px"></loading>
    <div v-else-if="isShowLoadError" class="p-y-xxl flex-col flex-y-center">
      <div class="active-text font-l">Aoh，更新日志加载失败:(</div>
      <custom-button class="mt-xxl" type="primary" @click="handleClickReloadUpdateLogs">重新加载</custom-button>
    </div>
    <div v-else-if="releases.length" class="update-logs-wrapper flex mt-m active-text code-font over-hidden">
      <div class="version-list over-y-auto common-scrollbar">
        <div
          class="version p-y-s pl-l mb-s cursor-pointer flex-y-center radius-xl fade-ease"
          :class="version === currUpdateLog?.version ? 'bg-main3 active-text' : 'text-hover-active'"
          v-for="(version, index) in versionList"
          :key="version"
          @click="handleChooseVersion(version)">
          <span class="font-xs">{{ version }}</span>
          <span v-if="!index" class="version-tag font-xxs ml-xs active-text">Latest</span>
        </div>
      </div>
      <div v-if="currUpdateLog" class="log-detail flex-1 flex-col over-y-auto common-scrollbar">
        <span class="log-title font-r">JS-Encoder {{ currUpdateLog.version }} 更新事项</span>
        <span class="log-time no-active-text font-xxs mt-s">{{ currUpdateLog.publishTime }}</span>
        <div class="log-content mt-xxl">
          <template v-for="category in currUpdateLog.updateCategories" :key="category.title">
            <div v-if="category.logs.length" class="pb-s mb-l">
              <div class="log-title pl-s font-xxs mb-m" :style="categoryTitleStyle[category.title]">
                <span>{{ category.title }}</span>
              </div>
              <div class="mb-s font-xs" v-for="(log, index) in category.logs" :key="index">
                <span>{{ index + 1 }}. {{ log }}</span>
              </div>
            </div>
          </template>
        </div>
        <div class="text-right">
          <i
            class="icon iconfont icon-github-fill cursor-pointer font-l fade-ease text-hover-active"
            title="view on github"
            @click="handleClickGithubLink"
          ></i>
        </div>
      </div>
    </div>
    <div v-else class="empty-tip flex-center">
      <span class="describe-text">暂无数据</span>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import Modal from "@components/modal/modal.vue"
import { useCommonStore } from "@store/common"
import loading from "@components/loading/loading.vue"
import { ref, shallowRef } from "vue"
import useUpdateLogs, { IRelease, CategoryTitle } from "@hooks/use-update-logs"
import { setLocalStorage } from "@utils/tools/storage"
import { LocalStorageKey } from "@utils/config/storage"
import CustomButton from "@components/custom-button/custom-button.vue"

const commonStore = useCommonStore()
const { updateDisplayModal } = commonStore

const categoryTitleStyle = {
  [CategoryTitle.FEATURES]: { borderColor: "var(--color-primary2)" },
  [CategoryTitle.ENHANCEMENTS]: { borderColor: "var(--color-green2)" },
  [CategoryTitle.BUGFIX]: { borderColor: "var(--color-red2)" },
}

const isReleasesLoading = ref<boolean>(false)
const releases = shallowRef<IRelease[]>([])
const versionList = shallowRef<string[]>([])
const currUpdateLog = shallowRef<IRelease>()
const isShowLoadError = ref<boolean>(false)
const { getReleases } = useUpdateLogs()
const setUpdateLogsInfo = async () => {
  isReleasesLoading.value = true
  const { success, data: list = [] } = await getReleases()
  setTimeout(() => isReleasesLoading.value = false, 200)
  // 请求失败提示
  if (success) {
    isShowLoadError.value = true
    return
  }
  if (!list.length) { return }
  // 将最新版本号储存
  setLocalStorage(LocalStorageKey.VERSION, list[0].version)
  // 过滤掉没有需要展示日志的release
  const displayReleases = list.filter(({ updateCategories }) => !!updateCategories.length)
  releases.value = displayReleases
  versionList.value = displayReleases.map(({ version }) => version)
  currUpdateLog.value = displayReleases[0]
}
setUpdateLogsInfo()

const handleChooseVersion = (version: string) => {
  const updateLog = releases.value.find(({ version: currVersion }) => currVersion === version)
  currUpdateLog.value = updateLog
}

const handleClickGithubLink = () => {
  window.open(currUpdateLog.value!.url!)
}

const handleClickReloadUpdateLogs = () => {
  isShowLoadError.value = false
  setUpdateLogsInfo()
}
</script>

<style lang="scss" scoped>
.update-logs-wrapper {
  max-height: calc(100vh - 170px - 124px);
  .version-list {
    width: 150px;
    max-height: 100%;
    .version-tag {
      padding: 1px 9px;
      border-radius: 9px;
      background-color: var(--color-primary1);
    }
  }
  .log-detail {
    margin-left: 40px;
    max-height: 100%;
    .log-content {
      .log-title {
        border-left: 4px solid;
      }
    }
  }
}
.empty-tip {
  height: 200px;
}
</style>