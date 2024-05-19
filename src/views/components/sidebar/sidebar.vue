<template>
  <div class="bg-main1 flex-col-x-center" :class="namespace">
    <template v-for="(list, index) in sidebarTypeList" :key="index">
      <!-- 分割线 -->
      <div v-if="!!index && index !== sidebarTypeList.length - 1 && list.length" class="split-line"></div>
      <!-- 子选项列表 -->
      <div v-if="list.length" class="fill-w p-y-s" :class="`${namespace}-sub`">
        <div
          class="flex-center"
          :class="`${namespace}-item-wrapper`"
          v-for="item in list"
          :key="item">
          <tooltip
            offset="2"
            level="15"
            :content="sidebarList[item].name"
            :show-triangle="false"
            :delay="200">
            <icon-btn
              :size="IconBtnSize.LG"
              @click="handleClickItem(item)">
              <badge :value="sidebarList[item].isShowBadge">
                <i class="icon iconfont font-inherit" :class="sidebarList[item].icon"></i>
              </badge>
            </icon-btn>
          </tooltip>
        </div>
      </div>
      <div class="flex-1" v-else></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Tooltip from "@components/tooltip/tooltip.vue"
import IconBtn from "@components/icon-btn/icon-btn.vue"
import { IconBtnSize } from "@components/icon-btn/icon-btn.interface"
import { sidebarList, sidebarTypeList, SidebarType } from "./sidebar"
import useSidebar from "./hooks/use-sidebar"
import Badge from "@components/badge/badge.vue"

const namespace = "sidebar"

const {
  processClickTheme,
  processClickGithub,
  processClickHelp,
  processClickUpdateLogs,
  processOpenModal,
  setUpdateLogBadge,
} = useSidebar()

setUpdateLogBadge()

const sidebarType2Func: Partial<Record<SidebarType, () => void>> = {
  [SidebarType.THEME]: () => processClickTheme(),
  [SidebarType.GITHUB]: () => processClickGithub(),
  [SidebarType.HELP_DOCUMENT]: () => processClickHelp(),
  [SidebarType.UPDATE_LOG]: () => processClickUpdateLogs(),
}

const handleClickItem = (type: SidebarType): void => {
  const processor = sidebarType2Func[type]
  if (processor) {
    processor()
  } else {
    processOpenModal(type)
  }
}
</script>

<style lang="scss" scoped>
$namespace: "sidebar";

.#{$namespace} {
  width: 49px;
  border-right: 1px solid var(--color-main-bg-3);
  .split-line {
    width: 36px;
    background-color: transparent;
    border-bottom: 1px solid var(--color-main-bg-3);
  }
  .#{$namespace}-sub {
    .#{$namespace}-item-wrapper {
      width: 48px;
      height: 48px;
    }
  }
}
</style>