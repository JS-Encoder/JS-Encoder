<template>
  <modal
    title="快捷键"
    width="500"
    top="85"
    bottom="85"
    :show-footer="false"
    @close="updateDisplayModal(null)">
    <div class="search-bar pt-s pb-l flex-ais sticky bg-main2">
      <custom-input
        width="100%"
        placeholder="查询快捷键..."
        v-model="shortcutKeyword"
        :size="Size.LARGE">
        <template #leftSide>
          <div class="flex-y-center fill-h pl-s">
            <i class="icon iconfont icon-search font-s line-h-unset no-active-text"></i>
          </div>
        </template>
      </custom-input>
    </div>
    <div class="shortcut-list-wrapper font-xs fill-h flex-1 common-scrollbar relative">
      <template v-if="searchResult.length">
        <template v-for="(item, index) in searchResult" :key="index">
          <div class="shortcut-list-name active-text pb-s sticky bg-main2">
            <span>{{item.type}}</span>
          </div>
          <template v-for="shortcut in item.keymap" :key="shortcut.name">
            <div class="shortcut flex-y-center">
              <span class="active-text">{{shortcut.name}}</span>
              <div class="flex-1"></div>
              <template v-for="key in shortcut.keys" :key="key">
                <kbd class="key describe-text code-font radius-l p-y-xs p-x-s">{{key}}</kbd>
              </template>
            </div>
          </template>
        </template>
      </template>
      <div v-else class="flex-x-center p-y-xl">
        <span class="describe-text">没有匹配的快捷键~</span>
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import Modal from "@components/modal/modal.vue"
import CustomInput from "@components/form/custom-input/custom-input.vue"
import { useCommonStore } from "@store/common"
import { Size } from "@type/interface"
import { ShortcutMapList, IShortcutMap } from "./shortcut-modal.interface"
import { ref, shallowRef, watch } from "vue"

const commonStore = useCommonStore()
const { updateDisplayModal } = commonStore

const shortcutKeyword = ref<string>("")
const searchResult = shallowRef<IShortcutMap[]>(ShortcutMapList)

const searchShortcut = (keyword: string): IShortcutMap[] => {
  if (!keyword) { return ShortcutMapList }
  return ShortcutMapList.map((shortcutMap) => {
    const regExp = new RegExp(`${keyword}`, "g")
    const { type, keymap } = shortcutMap
    return {
      type,
      keymap: keymap.filter(({ name }) => regExp.test(name)),
    }
  }).filter(({ keymap }) => !!keymap.length)
}

watch(shortcutKeyword, (newKeyword) => {
  searchResult.value = searchShortcut(newKeyword)
})
</script>

<style lang="scss" scoped>
.search-bar {
  z-index: 1;
  top: 0;
}
.shortcut-list-name {
  height: 28px;
  border-bottom: 1px solid var(--color-form-item);
  top: 64px;
  &:not(:first-child) {
    margin-top: 16px;
  }
}
.shortcut {
  margin-top: 8px;
}
.key {
  background-color: var(--color-main-bg-3);
  &:not(:last-child) {
    margin-right: 4px;
  }
}
</style>