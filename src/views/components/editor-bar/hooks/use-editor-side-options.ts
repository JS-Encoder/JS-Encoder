import { useEditorWrapperStore } from "@store/editor-wrapper"
import { Prep } from "@type/prep"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const useEditorSideOptions = (editorId: number) => {
  const editorWrapperStore = useEditorWrapperStore()
  const { editorMap, tabId2PrepMap } = storeToRefs(editorWrapperStore)

  /** 是否显示更多选项下拉菜单 */
  const showSideMenu = ref<boolean>(false)
  const sideOptions = computed(() => {
    const { displayTabId } = editorMap.value[editorId]
    const prep = tabId2PrepMap.value[displayTabId]
    return prep2EditorSideOptionsMap[prep] || { display: [], more: [] }
  })

  return {
    showSideMenu,
    sideOptions,
  }
}

export default useEditorSideOptions

export const enum EditorSideOptionType {
  /** 格式化代码 */
  FORMAT_CODE,
  /** Markdown工具栏 */
  MARKDOWN_TOOLS,
}

/** 选项列表 */
export const editorSideOptionsListMap: Record<EditorSideOptionType, { text?: string, icon?: string }> = {
  [EditorSideOptionType.FORMAT_CODE]: { text: "格式化代码" },
  [EditorSideOptionType.MARKDOWN_TOOLS]: { text: "Markdown工具栏", icon: "icon-markdown-tools" },
}

export interface IEditorSideOptions {
  display: EditorSideOptionType[]
  more: EditorSideOptionType[]
}

/** 存储各个预处理器所包含的选项id，分为直接展示出的选项和在菜单中展示的更多选项 */
export const prep2EditorSideOptionsMap: Partial<Record<Prep, IEditorSideOptions>> = {
  [Prep.HTML]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.MARKDOWN]: { display: [EditorSideOptionType.MARKDOWN_TOOLS], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.PUG]: { display: [], more: [] },
  [Prep.CSS]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.SASS]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.SCSS]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.LESS]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.STYLUS]: { display: [], more: [] },
  [Prep.JAVASCRIPT]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.TYPESCRIPT]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.COFFEESCRIPT]: { display: [], more: [] },
  [Prep.BABEL]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
  [Prep.VUE]: { display: [], more: [EditorSideOptionType.FORMAT_CODE] },
}