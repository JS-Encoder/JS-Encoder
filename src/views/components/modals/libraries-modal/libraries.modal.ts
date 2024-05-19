import { ISelectOption } from "@components/form/custom-select/custom-select"

/** 选中的外部库 */
export interface ISelectedLibrary {
  /** 自增字段，表唯一 */
  id: number
  url: string
}

export interface IMatchLibrary extends ISelectOption {
  url: string
}

export enum LibraryType {
  STYLE = "style",
  SCRIPT = "script",
}

export interface ILibraryInfo {
  /** 选中的外部库 */
  selected: ISelectedLibrary[]
  /** 匹配的库列表 */
  match: IMatchLibrary[]
  /** 搜索时展示loading */
  loading: boolean
  /** 搜索词 */
  keyword: string
}