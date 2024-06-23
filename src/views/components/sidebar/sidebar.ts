import { ModalName, Theme } from "@type/interface"
import { reactive } from "vue"

export enum SidebarType {
  /** 模板 */
  TEMPLATE = "template",
  /** 预处理 */
  PREPROCESSOR = "preprocessor",
  /** 编码设置 */
  CODE_SETTINGS = "codeSettings",
  /** 库 */
  LIBRARIES = "libraries",
  /** 上传代码 */
  UPLOAD_CODE = "uploadCode",
  /** 下载代码 */
  DOWNLOAD_CODE = "downloadCode",
  /** 快捷键 */
  SHORTCUT = "shortcut",
  /** 更新日志 */
  UPDATE_LOG = "updateLog",
  /** 帮助文档 */
  HELP_DOCUMENT = "helpDocument",
  /** 主题 */
  THEME = "theme",
  /** Github */
  GITHUB = "Github",
}

export const sidebarType2Text = {
  [SidebarType.TEMPLATE]: "模板",
  [SidebarType.PREPROCESSOR]: "预处理",
  [SidebarType.CODE_SETTINGS]: "编码设置",
  [SidebarType.LIBRARIES]: "库",
  [SidebarType.UPLOAD_CODE]: "上传代码",
  [SidebarType.DOWNLOAD_CODE]: "下载代码",
  [SidebarType.SHORTCUT]: "快捷键",
  [SidebarType.UPDATE_LOG]: "更新日志",
  [SidebarType.HELP_DOCUMENT]: "帮助文档",
  [SidebarType.THEME]: "主题",
  [SidebarType.GITHUB]: "Github",
}

export const themeIcon = {
  [Theme.LIGHT]: "icon-sun",
  [Theme.DARK]: "icon-moon",
}

export const sidebarType2Icon = {
  [SidebarType.TEMPLATE]: "icon-template",
  [SidebarType.PREPROCESSOR]: "icon-preprocessor",
  [SidebarType.CODE_SETTINGS]: "icon-setting",
  [SidebarType.LIBRARIES]: "icon-library",
  [SidebarType.UPLOAD_CODE]: "icon-upload",
  [SidebarType.DOWNLOAD_CODE]: "icon-download",
  [SidebarType.SHORTCUT]: "icon-keyboard",
  [SidebarType.UPDATE_LOG]: "icon-light",
  [SidebarType.HELP_DOCUMENT]: "icon-doc-help",
  [SidebarType.THEME]: themeIcon[Theme.DARK],
  [SidebarType.GITHUB]: "icon-github",
}

export const sidebarType2ModalName: Partial<Record<SidebarType, ModalName>> = {
  [SidebarType.TEMPLATE]: ModalName.TEMPLATE,
  [SidebarType.PREPROCESSOR]: ModalName.PREPROCESSOR,
  [SidebarType.CODE_SETTINGS]: ModalName.CODE_SETTINGS,
  [SidebarType.LIBRARIES]: ModalName.LIBRARIES,
  [SidebarType.UPLOAD_CODE]: ModalName.UPLOAD_CODE,
  [SidebarType.DOWNLOAD_CODE]: ModalName.DOWNLOAD_CODE,
  [SidebarType.SHORTCUT]: ModalName.SHORTCUT,
  [SidebarType.UPDATE_LOG]: ModalName.UPDATE_LOG,
}

/** 侧边栏选项列表，每个子列表之间用横线分割 */
export const sidebarTypeList: SidebarType[][] = [
  [SidebarType.TEMPLATE, SidebarType.PREPROCESSOR, SidebarType.CODE_SETTINGS, SidebarType.LIBRARIES],
  [SidebarType.UPLOAD_CODE, SidebarType.DOWNLOAD_CODE],
  [SidebarType.SHORTCUT, SidebarType.UPDATE_LOG, SidebarType.HELP_DOCUMENT],
  [],
  // TODO: 添加黑白主题切换功能
  [SidebarType.THEME, SidebarType.GITHUB],
]

export interface ISidebarOption {
  /** 选项名称 */
  name: string
  /** icon class */
  icon: string
  /** 模态框名称，如有则点击弹出模态框 */
  modalName?: ModalName
  /** 是否展示提示点 */
  isShowBadge?: boolean
}

export const sidebarList = reactive(
  sidebarTypeList.flat().reduce((acc, sidebarType) => {
    acc[sidebarType] = {
      name: sidebarType2Text[sidebarType],
      icon: sidebarType2Icon[sidebarType],
      modalName: sidebarType2ModalName[sidebarType],
    }
    return acc
  }, {} as Record<SidebarType, ISidebarOption>),
)