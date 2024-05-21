import { FreeRecord } from "@type/types"
import { EditorView } from "@codemirror/view"
import { reactive } from "vue"

export interface IProps {
  view: EditorView
}

export enum ToolType {
  /** 粗体 */
  BOLD = "bold",
  /** 斜体 */
  ITALIC = "italic",
  /** 删除线 */
  DELETE = "delete",
  /** 标题 */
  TITLE = "title",
  /** 链接 */
  LINK = "link",
  /** 图片 */
  IMAGE = "image",
  /** 引用 */
  QUOTE = "quote",
  /** 代码 */
  CODE = "code",
  /** 无序列表 */
  UL = "ul",
  /** 有序列表 */
  OL = "ol",
  /** 分割线 */
  LINE = "line",
  /** 转换pdf */
  PDF = "pdf",
}

export type ToolDropdownItem = FreeRecord<Pick<IToolInfo, "title" | "icon">>

export interface IToolInfo {
  /** 类型 */
  type: ToolType
  /** 标题 */
  title: string
  /** icon class */
  icon?: string
  /** 子选项列表 */
  dropdown?: ToolDropdownItem[]
  /** 是否展示下拉列表 */
  showDropdown?: boolean
}

export interface ITitleInfo extends ToolDropdownItem {
  level: number,
}

export const titleDropdown: ITitleInfo[] = [
  { title: "H1", level: 1 },
  { title: "H2", level: 2 },
  { title: "H3", level: 3 },
  { title: "H4", level: 4 },
  { title: "H5", level: 5 },
  { title: "H6", level: 6 },
]

export const toolInfoMap = reactive<IToolInfo[]>([
  { type: ToolType.BOLD, title: "粗体", icon: "icon-bold" },
  { type: ToolType.ITALIC, title: "斜体", icon: "icon-italic" },
  { type: ToolType.DELETE, title: "删除线", icon: "icon-delete" },
  { type: ToolType.TITLE, title: "标题", icon: "icon-title", dropdown: titleDropdown, showDropdown: false },
  { type: ToolType.LINK, title: "链接", icon: "icon-link" },
  { type: ToolType.IMAGE, title: "图片", icon: "icon-image" },
  { type: ToolType.QUOTE, title: "引用", icon: "icon-quote" },
  { type: ToolType.CODE, title: "代码", icon: "icon-code" },
  { type: ToolType.UL, title: "无序列表", icon: "icon-ul" },
  { type: ToolType.OL, title: "有序列表", icon: "icon-ol" },
  { type: ToolType.LINE, title: "分割线", icon: "icon-line" },
  { type: ToolType.PDF, title: "转换pdf", icon: "icon-pdf" },
])