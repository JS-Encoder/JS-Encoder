<template>
  <div class="search-panel relative bg-main3 flex-jce">
    <div class="search-bar bg-main2 shadow p-y-xs pl-xs pr-s flex">
      <div
        class="mr-xs cursor-pointer active-text flex-y-center"
        title="Toggle Replace"
        @click="isFold = !isFold">
        <i class="icon iconfont icon-down block font-xxs" :class="isFold ? 'fold' : ''"></i>
      </div>
      <div>
        <div class="flex-y-center">
          <div
            class="search-input-wrapper bg-main3 border-box flex-y-center pr-xs"
            :class="isSearchFocus ? 'focus' : ''">
            <input
              class="search-input bg-main3 active-text border-box p-x-s font-xs"
              type="text"
              placeholder="Find"
              title="Find"
              ref="searchInputRef"
              v-model="searchValue"
              @focus="isSearchFocus = true"
              @blur="isSearchFocus = false"
            />
            <div
              class="cursor-pointer search-option"
              :class="[
                option.disabled ? 'disabled' : '',
                option.active ? 'active' : '',
              ]"
              v-for="option in searchInputOptions"
              :key="option.type"
              :title="option.title"
              @click="handleClickSearchOption(option)">
              <i class="icon iconfont font-xs" :class="option.icon"></i>
            </div>
          </div>
          <!-- TODO: 搜索结果数量展示 -->
          <!-- <div class="result ml-xs mr-l flex-sh flex-y-center active-text font-xxs">
            <template v-if="matchesCount">
              <span v-if="currentMatch">{{ currentMatch }} of {{ matchesCount }}</span>
              <span v-else>{{ matchesCount }} results</span>
            </template>
            <span v-else :class="searchValue ? 'error-text' : ''">No results</span>
          </div> -->
          <div
            class="cursor-pointer search-option"
            :class="[
              option.disabled ? 'disabled' : '',
              option.active ? 'active' : '',
            ]"
            v-for="option in searchOptions"
            :key="option.type"
            :title="option.title"
            @click="handleClickSearchOption(option)">
            <i class="icon iconfont font-xs" :class="option.icon"></i>
          </div>
        </div>
        <div v-show="!isFold" class="flex-y-center mt-xs">
          <div class="replace-input-wrapper bg-main3 border-box flex mr-xs" :class="isReplaceFocus ? 'focus' : ''">
            <input
              class="replace-input bg-main3 active-text border-box p-x-s font-xs"
              type="text"
              placeholder="Replace"
              title="Replace"
              aria-label="Replace"
              name="replace"
              form="true"
              v-model="replaceValue"
              @focus="isReplaceFocus = true"
              @blur="isReplaceFocus = false"
            />
          </div>
          <div
            class="cursor-pointer search-option"
            :class="[
              option.disabled ? 'disabled' : '',
              option.active ? 'active' : '',
            ]"
            v-for="option in replaceOptions"
            :key="option.type"
            :title="option.title"
            @click="handleClickSearchOption(option)">
            <i class="icon iconfont font-xs" :class="option.icon"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SearchQuery, closeSearchPanel, findNext, findPrevious, replaceAll, replaceNext, setSearchQuery } from "@codemirror/search"
import { nextTick, onMounted, reactive, ref, shallowRef, watch } from "vue"
import { IProps, SearchOptionType, searchOptions, searchItemOptions, searchInputOptions, replaceOptions, ISearchOption } from "./search"
import { CodemirrorBase } from "@utils/editor/utils/codemirror-base"

const props = defineProps<IProps>()

const codemirrorBase = new CodemirrorBase(props.view)

const searchInputRef = shallowRef<HTMLInputElement | null>(null)

onMounted(() => {
  // 查询输入框获取焦点
  nextTick(() => {
    searchInputRef.value!.focus()
  })
  // 获取当前是否有选中文本，有选中自动查询
  if (!codemirrorBase.somethingSelected()) { return }
  // 获取已经选中范围信息，默认获取第一个进行查询，如果里面包含换行，则不做处理
  const selectRange = codemirrorBase.getListSelections()[0]
  const fromLine = codemirrorBase.transOffset2Pos(selectRange.from).line
  const toLine = codemirrorBase.transOffset2Pos(selectRange.to).line
  if (fromLine !== toLine) { return }
  searchValue.value = codemirrorBase.getRangeText(selectRange.from, selectRange.to)
})

const isSearchFocus = ref<boolean>(false)
const searchValue = ref<string>("")
const isReplaceFocus = ref<boolean>(false)
const replaceValue = ref<string>("")
const isFold = ref<boolean>(true)
const searchQueryOptions = reactive({
  caseSensitive: false,
  regexp: false,
  wholeWord: false,
})

/** 监听查询字符为空时不能操作前后查询和替换 */
watch(searchValue, (newValue) => {
  const disabledOptions = [...searchItemOptions, ...replaceOptions]
  disabledOptions.forEach((item) => {
    item.disabled = !newValue
  })
}, { immediate: true })
/** 查询字符和查询选项改变时更新配置 */
watch([searchQueryOptions, searchValue], ([_, [newValue]]) => {
  if (newValue) {
    setSearchQueryOptions()
    return
  }
  matchesCount.value = 0
  currentMatch.value = 0
}, { deep: true })

const handleClickSearchOption = (option: ISearchOption) => {
  const { type } = option
  switch (type) {
    case SearchOptionType.PREVIOUS_MATCH: {
      findPrevious(props.view)
      setCurrentMatch()
      break
    }
    case SearchOptionType.NEXT_MATCH: {
      findNext(props.view)
      setCurrentMatch()
      break
    }
    case SearchOptionType.CLOSE: {
      closeSearchPanel(props.view)
      break
    }
    case SearchOptionType.REPLACE: {
      setSearchQueryOptions()
      replaceNext(props.view)
      break
    }
    case SearchOptionType.REPLACE_ALL: {
      setSearchQueryOptions()
      replaceAll(props.view)
      break
    }
    case SearchOptionType.MATCH_CASE: {
      option.active = !option.active
      searchQueryOptions.caseSensitive = option.active
      break
    }
    case SearchOptionType.MATCH_WHOLE_WORD: {
      option.active = !option.active
      searchQueryOptions.wholeWord = option.active
      break
    }
    case SearchOptionType.USE_REGULAR_EXPRESSION: {
      option.active = !option.active
      searchQueryOptions.regexp = option.active
      break
    }
    default: {}
  }
}

let searchQuery: SearchQuery
/** 获取查询匹配位置列表 */
const getSearchMatches = () => {
  return Array.from(searchQuery.getCursor(props.view.state) as unknown as Iterable<{ from: number, to: number }>)
}

/** 设置查询选项 */
const setSearchQueryOptions = () => {
  const query = new SearchQuery({
    search: searchValue.value,
    replace: replaceValue.value,
    ...searchQueryOptions,
  })
  if (!searchQuery || !query.eq(searchQuery)) {
    searchQuery = query
    props.view.dispatch({ effects: setSearchQuery.of(query) })
    setSearchMatchesCount()
    setCurrentMatch()
  }
}

const matchesCount = ref<number>(0)
const currentMatch = ref<number>(0)
/** 获取搜索匹配项总数 */
const setSearchMatchesCount = () => {
  const cursor = getSearchMatches()
  let count = 0
  for (const _ of cursor) {
    count++
  }
  matchesCount.value = count
}

/** 设置当前匹配的是哪一个 */
const setCurrentMatch = () => {
  const matches = getSearchMatches()
  const main = props.view.state.selection.main
  for (let i = 0; i < matches.length; i ++) {
    const match = matches[i]
    if (main.from === match.from && main.to === match.to) {
      currentMatch.value = i + 1
      break
    }
  }
}

defineExpose({
  onMounted() {
    searchInputRef.value!.focus()
  },
  onDestroy(){
    matchesCount.value = 0
    currentMatch.value = 0
  },
})
</script>

<style lang="scss" scoped>
.search-panel {
  .search-bar {
    border-left: 2px solid var(--color-main-bg-1);
    .icon-down {
      &.fold {
        transform: rotate(-90deg);
      }
    }
    .search-input-wrapper,
    .replace-input-wrapper {
      height: 24px;
      border: 1px solid transparent;
      .search-input,
      .replace-input {
        max-width: 120px;
        outline: none;
      }
      .replace-input {
        max-width: 184px;
      }
      &.focus {
        border-color: var(--color-primary1);
      }
    }
    .search-option {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      &:hover {
        background-color: var(--color-main-bg-0);
      }
      &.active {
        background-color: var(--color-main-bg-0);
      }
      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }
}
</style>