import { EditorView } from "@codemirror/view"
import { reactive } from "vue"

export interface IProps {
  view: EditorView
}

export enum SearchOptionType {
  /** 不区分大小写 */
  MATCH_CASE,
  /** 匹配整个单词 */
  MATCH_WHOLE_WORD,
  /** 使用正则表达式 */
  USE_REGULAR_EXPRESSION,
  /** 匹配上一个 */
  PREVIOUS_MATCH,
  /** 匹配下一个 */
  NEXT_MATCH,
  /** 替换 */
  REPLACE,
  /** 替换全部 */
  REPLACE_ALL,
  /** 关闭 */
  CLOSE,
}

export interface ISearchOption {
  type: SearchOptionType
  title: string
  icon: string
  active?: boolean
  disabled?: boolean
}

export const searchBarOptions: ISearchOption[] = [
  { type: SearchOptionType.CLOSE, title: "Close", icon: "icon-close" },
]
export const searchItemOptions: ISearchOption[] = [
  { type: SearchOptionType.PREVIOUS_MATCH, title: "Previous Match", icon: "icon-up-arrow" },
  { type: SearchOptionType.NEXT_MATCH, title: "Next Match", icon: "icon-down-arrow" },
]
export const searchOptions = reactive<ISearchOption[]>([
  ...searchItemOptions,
  ...searchBarOptions,
])

export const searchInputOptions = reactive<ISearchOption[]>([
  { type: SearchOptionType.MATCH_CASE, title: "Match Case", icon: "icon-match-case" },
  { type: SearchOptionType.MATCH_WHOLE_WORD, title: "Match Whole Word", icon: "icon-whole-word" },
  { type: SearchOptionType.USE_REGULAR_EXPRESSION, title: "Use Regular Expression", icon: "icon-regex" },
])

export const replaceOptions = reactive<ISearchOption[]>([
  { type: SearchOptionType.REPLACE, title: "Replace", icon: "icon-replace" },
  { type: SearchOptionType.REPLACE_ALL, title: "Replace All", icon: "icon-replace-all" },
])