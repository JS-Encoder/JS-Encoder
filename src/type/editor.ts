import { OriginLang } from "@type/prep"
import { ISize } from "@type/interface"

/** 编辑窗口tab */
export interface IEditorTab {
  id: number
  /** 预处理语言对应的原生语言 */
  origin: OriginLang
}

/** 编辑窗口 */
export interface IEditor {
  id: number
  /** 当前展示的tab id */
  displayTabId: number
  /** editor包含的tab的id的集合 */
  tabIds: number[]
  /** 编辑窗口尺寸 */
  size?: ISize
  /** 父splitter id */
  parentId?: number
}

/** 分割方向 */
export enum SplitDirection {
  /** 横向 */
  HORIZONTAL = 1,
  /** 纵向 */
  VERTICAL,
}

/** 编辑窗口分割器 */
export interface IEditorSplitter {
  id: number
  /** 分割方向 */
  direction?: SplitDirection
  /** 分割器中展示的editor的id */
  editorId?: number
  /** 子splitter id */
  children?: number[]
  /** 父splitter id */
  parentId?: number
}

/** 编辑窗口tab id与对应tab内容的映射 */
export type EditorTabMap = Record<number, IEditorTab>

/** 编辑窗口tab id与对应代码内容的映射 */
export type EditorCodeMap = Record<number, string>

/** editor的id对应的editor信息 */
export type EditorMap = Record<number, IEditor>

/** 分割器id所对应的分割器信息 */
export type EditorSplitterMap = Record<number, IEditorSplitter>

/** 编辑窗口的宽高 */
export type EditorSizeMap = Record<number, ISize>

/** 分割器的宽高 */
export type EditorSplitterSizeMap = Record<number, ISize>

/** 区域位置 */
export enum AreaPosition {
  LEFT = "left",
  RIGHT = "right",
  UP = "up",
  DOWN = "down",
  MIDDLE = "middle",
  NULL = "null",
}

export interface IDraggingTabInfo {
  tabId: number
  editorId: number
  splitterId: number
}