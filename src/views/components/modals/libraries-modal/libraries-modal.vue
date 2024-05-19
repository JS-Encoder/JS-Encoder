<template>
  <modal
    title="库"
    width="550"
    top="85"
    bottom="85"
    :show-footer="false"
    @close="handleCloseModal">
    <div>
      <div class="modal-sub-title">外部样式</div>
      <div class="modal-small-desc-text">你所添加的外部样式，将按照顺序在本地 CSS 执行之前依次执行，支持 http 和 https 协议链接</div>
      <div class="mt-s mb-l">
        <custom-select
          showSearch
          placeholder="查找样式库..."
          select-style="width: 100%;"
          appendToBody
          v-model="styleLibraryInfo.keyword"
          :size="Size.LARGE"
          :data-list="styleLibraryInfo.match"
          @selected="($event) => handleSelectLibrary($event, LibraryType.STYLE)"
        ></custom-select>
      </div>
      <drag-sortable
        v-model="styleLibraryInfo.selected"
        uniqueKey="id"
        group="styles"
        :disabled="disabledDrag">
        <template
          v-for="(item, index) in styleLibraryInfo.selected"
          :key="item.id"
          v-slot:[`item-${item.id}`]>
          <div class="mt-s flex">
            <custom-input
              width="100%"
              placeholder="请输入样式库链接..."
              v-model="styleLibraryInfo.selected[index].url"
              :size="Size.LARGE"
              @blur="disabledDrag = false"
              @focus="disabledDrag = true">
              <template v-slot:leftSide>
                <div class="cursor-move flex-y-center fill-h">
                  <i class="icon iconfont icon-drag font-xs p-x-s no-active-text"></i>
                </div>
              </template>
              <template v-slot:rightSide>
                <div
                  class="cursor-pointer flex-y-center fill-h"
                  @click="handleDeleteLibrary(index, LibraryType.STYLE)">
                  <i class="icon iconfont icon-close text-hover-active font-xs p-x-s"></i>
                </div>
              </template>
            </custom-input>
          </div>
        </template>
      </drag-sortable>
      <div
        class="add-new-item no-active-text flex-center cursor-pointer mt-s fade-ease"
        @click="handleAddLibrary(LibraryType.STYLE)">
        <i class="icon iconfont icon-add font-s"></i>
        <span class="ml-s font-xs">添加新样式</span>
      </div>
      <div class="modal-sub-title">外部脚本</div>
      <div class="modal-small-desc-text">你所添加的外部样式，将按照顺序在本地 JavaScript 执行之前依次执行，支持 http 和 https 协议链接</div>
      <div class="mt-s mb-l">
        <custom-select
          showSearch
          placeholder="查找脚本库..."
          select-style="width: 100%;"
          appendToBody
          v-model="scriptLibraryInfo.keyword"
          :size="Size.LARGE"
          :data-list="scriptLibraryInfo.match"
          @selected="($event) => handleSelectLibrary($event, LibraryType.SCRIPT)"
        ></custom-select>
      </div>
      <drag-sortable
        v-model="scriptLibraryInfo.selected"
        uniqueKey="id"
        group="scripts"
        :disabled="disabledDrag">
        <template
          v-for="(item, index) in scriptLibraryInfo.selected"
          :key="item.id"
          v-slot:[`item-${item.id}`]>
          <div class="mt-s flex">
            <custom-input
              width="100%"
              placeholder="请输入脚本库链接..."
              v-model="scriptLibraryInfo.selected[index].url"
              :size="Size.LARGE"
              @blur="disabledDrag = false"
              @focus="disabledDrag = true">
              <template v-slot:leftSide>
                <div class="cursor-move flex-y-center fill-h">
                  <i class="icon iconfont icon-drag font-xs p-x-s no-active-text"></i>
                </div>
              </template>
              <template v-slot:rightSide>
                <div
                  class="cursor-pointer flex-y-center fill-h"
                  @click="handleDeleteLibrary(index, LibraryType.SCRIPT)">
                  <i class="icon iconfont icon-close text-hover-active fade-ease font-xs p-x-s"></i>
                </div>
              </template>
            </custom-input>
          </div>
        </template>
      </drag-sortable>
      <div
        class="add-new-item no-active-text flex-center cursor-pointer mt-s fade-ease"
        @click="handleAddLibrary(LibraryType.SCRIPT)">
        <i class="icon iconfont icon-add font-s"></i>
        <span class="ml-s font-xs">添加新脚本</span>
      </div>
    </div>
  </modal>
</template>

<script lang="ts" setup>
import Modal from "@components/modal/modal.vue"
import CustomInput from "@components/form/custom-input/custom-input.vue"
import CustomSelect from "@components/form/custom-select/custom-select.vue"
import { useCommonStore } from "@store/common"
import { Size } from "@type/interface"
import { reactive, ref, watch, nextTick } from "vue"
import useLibraries, { ILibrary } from "./use-libraries"
import DragSortable from "@components/drag-sortable/drag-sortable.vue"
import { ILibraryInfo, ISelectedLibrary, LibraryType } from "./libraries.modal"
import { useEditorConfigStore } from "@store/editor-config"
import { debounce } from "@utils/tools/common"
import { ISelectOption } from "@components/form/custom-select/custom-select"

const commonStore = useCommonStore()
const editorConfigStore = useEditorConfigStore()

const disabledDrag = ref<boolean>(false)


const styleLibraryInfo = reactive<ILibraryInfo>({
  selected: [],
  match: [],
  loading: false,
  keyword: "",
})
const scriptLibraryInfo = reactive<ILibraryInfo>({
  selected: [],
  match: [],
  loading: false,
  keyword: "",
})
const getLibraryInfo = (type: LibraryType): ILibraryInfo => {
  return type === LibraryType.STYLE ? styleLibraryInfo : scriptLibraryInfo
}

/** id自增 */
let libraryIdCount: number = 1
const getSelectedLibrary = (url: string = ""): ISelectedLibrary => ({
  id: libraryIdCount ++,
  url,
})

/** 初始化外部库内容 */
const initSelectedLibraries = () => {
  const { libraries: { style, script } } = editorConfigStore
  const styles = style.map((url) => getSelectedLibrary(url))
  const scripts = script.map((url) => getSelectedLibrary(url))
  styleLibraryInfo.selected = styles
  scriptLibraryInfo.selected = scripts
}
initSelectedLibraries()

/** 处理搜索 */
const { searchStyleLibraries, searchScriptLibraries } = useLibraries()
const trans2MatchLibrary = ({ name: value, url }: ILibrary) => ({ value, url })
/** 监听搜索词改变查询匹配库列表 */
const processKeywordChanged = (type: LibraryType) => {
  return debounce((newKeyword) => {
    const libraryInfo = getLibraryInfo(type)
    libraryInfo.loading = true
    const searchReq = type === LibraryType.STYLE ? searchStyleLibraries : searchScriptLibraries
    searchReq(newKeyword).then((res) => {
      libraryInfo.loading = false
      libraryInfo.match = res.map((item) => trans2MatchLibrary(item))
    })
  }, 300)
}
watch(
  () => styleLibraryInfo.keyword,
  processKeywordChanged(LibraryType.STYLE),
)
watch(
  () => scriptLibraryInfo.keyword,
  processKeywordChanged(LibraryType.SCRIPT),
)

/** 选中库后设置到选中的样式和脚本库列表中 */
const handleSelectLibrary = ({ url }: ISelectOption, type: LibraryType) => {
  const libraryInfo = getLibraryInfo(type)
  libraryInfo.selected.push(getSelectedLibrary(url))
  nextTick(() => {
    libraryInfo.keyword = ""
  })
}
/** 删除库 */
const handleDeleteLibrary = (index: number, type: LibraryType) => {
  getLibraryInfo(type).selected.splice(index, 1)
}
/** 添加库 */
const handleAddLibrary = (type: LibraryType) => {
  getLibraryInfo(type).selected.push(getSelectedLibrary())
}

const handleCloseModal = () => {
  commonStore.updateDisplayModal(null)
  editorConfigStore.updateLibraries({
    style: styleLibraryInfo.selected.map(({ url }) => url),
    script: scriptLibraryInfo.selected.map(({ url }) => url),
  })
}
</script>

<style lang="scss" scoped>
.add-new-item {
  height: 41px;
  border: 2px dashed var(--color-no-active-color);
  border-radius: 8px;
  &:hover {
    border-color: var(--color-describe);
    color: var(--color-describe);
  }
}
</style>