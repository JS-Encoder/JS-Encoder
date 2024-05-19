import { OriginLang, Prep } from "@type/prep"
import { defineStore } from "pinia"
import {
  EditorCodeMap,
  EditorMap,
  EditorSplitterMap,
  EditorTabMap, IDraggingTabInfo,
  IEditor,
  IEditorSplitter,
  IEditorTab,
  SplitDirection,
} from "@type/editor"
import ModuleSizeService from "@utils/services/module-size-service"
import UtilService from "@utils/services/util-service"
import { DeepPartial } from "@type/types"
import { useEditorConfigStore } from "./editor-config"

/**
 * 编辑器视图展示的数据结构如state所示
 * 结构以一个根视口分割器(splitter)开始，一个视口分割器至少有一个编辑视口(editorView)，至多有两个编辑视口
 */
interface IEditorWrapper {
  /** 计数器，每新生成一个tab便自增，用来作为id */
  tabIdCount: number
  /** 计数器，每新生成一个editor便自增，用来作为id */
  editorIdCount: number
  /** 计数器，每新生成一个splitter便自增，用来作为id */
  splitterIdCount: number
  /** 正在拖拽的tab信息（需要全局监听其拖动位置），null就表示没有 */
  draggingTabInfo: IDraggingTabInfo | null
  /** 编辑窗口tab id与对应代码内容的映射 */
  codeMap: EditorCodeMap
  /** editor的id对应的editor信息 */
  editorMap: EditorMap
  /** 编辑窗口tab id与对应tab内容的映射 */
  tabMap: EditorTabMap
  /** 分割器id所对应的分割器信息 */
  editorSplitterMap: EditorSplitterMap
  /** 根splitter Id */
  rootSplitterId?: number | null
  /** 是否组件模式 */
  isComponentMode?: boolean
}

const moduleSizeService = new ModuleSizeService()
const utilService = new UtilService()

export const useEditorWrapperStore = defineStore("editorWrapper", {
  state: (): IEditorWrapper => ({
    tabIdCount: 0,
    editorIdCount: 0,
    splitterIdCount: 0,
    draggingTabInfo: null,
    codeMap: {},
    editorMap: {},
    tabMap: {},
    editorSplitterMap: {},
    rootSplitterId: null,
    isComponentMode: false,
  }),
  actions: {
    /** 批量更新配置 */
    batchUpdateEditorWrapper(config: DeepPartial<IEditorWrapper>): void {
      this.$patch({ ...config })
    },
    updateDraggingTabInfo(draggingTabInfo: IDraggingTabInfo | null): void {
      this.draggingTabInfo = draggingTabInfo
    },
    /** 创建编辑窗口tab */
    createTab(origin: OriginLang): IEditorTab {
      const id = ++ this.tabIdCount
      this.tabMap[id] = { id, origin }
      return this.tabMap[id]
    },
    updateTab(id: number, options: Partial<Omit<IEditorTab, "id">>): IEditorTab {
      this.tabMap[id] = { ...this.tabMap[id], ...options }
      return this.tabMap[id]
    },
    /** 删除编辑窗口tab */
    deleteTab(id: number): void {
      Reflect.deleteProperty(this.tabMap, id)
    },
    /** 设置根splitterId，方便从下至上寻找 */
    updateRootSplitterId(id: number): void {
      this.rootSplitterId = id
    },
    /**
     * 创建splitter
     * @param options splitter配置
     * @param fromId 来自于父splitter的id(为空则初始化(获取尺寸信息)，不为空则连带更新父splitter的关联配置)
     * @param direction 分割方向
     * @returns 创建好的splitter
     */
    createSplitter(
      options?: Partial<Omit<IEditorSplitter, "id">>,
      fromId?: number,
      direction?: SplitDirection,
    ): IEditorSplitter {
      const id = ++ this.splitterIdCount
      this.editorSplitterMap[id] = {
        id,
        direction: SplitDirection.HORIZONTAL,
        children: [],
        parentId: fromId,
        ...(options || null),
      }
      // this.updateSplitterSize(id, fromId, direction)
      if (fromId) {
        const { children = [] } = this.editorSplitterMap[fromId]
        this.updateSplitter(fromId, {
          direction: direction || SplitDirection.HORIZONTAL,
          children: [...children, id],
        })
      } else {
        moduleSizeService.getWindowSize()
      }
      return this.editorSplitterMap[id]
    },
    updateSplitter(id: number, options: Partial<Omit<IEditorSplitter, "id">>): IEditorSplitter {
      return Object.assign(this.editorSplitterMap[id], { ...options })
    },
    deleteSplitter(id: number, delSelf?: boolean): void {
      // 获取splitter，寻找里面的editor，挨个删除，如果delSelf为true就仅仅删除当前splitter
      const delFunc = (splitterId: number): void => {
        const { editorId, parentId: parentSplitterId, children = [] } = this.editorSplitterMap[splitterId]
        if (delSelf) {
          if (editorId) {
            this.deleteEditor(editorId)
          } else {
            children.forEach((childSplitterId) => {
              delFunc(childSplitterId)
            })
          }
        }
        // 删除splitter的同时，还需要删除上级对当前splitter的关联
        if (parentSplitterId) {
          const { children: childSplitter = [] } = this.editorSplitterMap[parentSplitterId]
          const newChildSplitter = utilService.deleteFirstMatchArrayItem(childSplitter, splitterId)
          this.updateSplitter(parentSplitterId, {
            children: newChildSplitter,
          })
        }
        Reflect.deleteProperty(this.editorSplitterMap, splitterId)
      }
      delFunc(id)
    },
    createEditor(options: Omit<IEditor, "id">): IEditor {
      const id = ++ this.editorIdCount
      this.editorMap[id] = { id, ...options }
      return this.editorMap[id]
    },
    updateEditor(id: number, options: Partial<Omit<IEditor, "id">>): IEditor {
      Object.assign(this.editorMap[id], options)
      return this.editorMap[id]
    },
    deleteEditor(id: number): void {
      Reflect.deleteProperty(this.editorMap, id)
    },
    updateCodeMap(codeMap: Partial<EditorCodeMap>): void {
      Object.assign(this.codeMap, codeMap)
    },
    clearCodeMap(): void {
      Object.keys(this.codeMap).forEach((tabId) => {
        this.codeMap[Number(tabId)] = ""
      })
    },
    updateIsComponentMode(newState: boolean): void {
      this.isComponentMode = newState
    },
  },
  getters: {
    tabId2PrepMap(state: IEditorWrapper) {
      const { prepMap } = useEditorConfigStore()
      return Object.entries(state.tabMap).reduce((acc, [tabId, tabInfo]) => {
        const { origin } = tabInfo
        acc[Number(tabId)] = prepMap[origin]
        return acc
      }, {} as Record<number, Prep>)
    },
    origin2TabIdMap(state: IEditorWrapper) {
      const { tabMap } = state
      return Object.entries(tabMap).reduce((acc, [tabId, tabInfo]) => {
        const { origin } = tabInfo
        acc[origin] = Number(tabId)
        return acc
      }, {} as Record<OriginLang, number>)
    },
    origin2CodeMap(state: IEditorWrapper) {
      const { tabMap, codeMap } = state
      return Object.values(tabMap).reduce((acc, tabInfo) => {
        const { origin, id } = tabInfo
        acc[origin] = codeMap[id]
        return acc
      }, {} as Record<OriginLang, string>)
    },
  },
})

export const checkIsCodeEmpty = () => {
  const { codeMap } = useEditorWrapperStore()
  return !Object.values(codeMap).some((code) => code)
}