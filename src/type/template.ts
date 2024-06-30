import { OriginLang } from "./prep"
import { IEditorConfig } from "./settings"
import { DeepPartial } from "./types"

/** 模板对应的语言或框架 */
export const enum TemplateLang {
  VUE = "Vue",
  VANILLA = "Vanilla",
  REACT = "React",
  ELEMENT_PLUS = "Element Plus",
  ANT_DESIGN = "Ant Design",
  ECHARTS = "Echarts",
  RXJS = "RxJS",
  CUSTOM = "Custom",
}

/** 模板类型 */
export const enum TemplateType {
  /** 内置 */
  INBUILT = "inbuilt",
  /** 自定义 */
  CUSTOM = "custom",
}

/** 模板基础配置 */
export interface ITemplateBase {
  /** 代码 */
  codeMap: Partial<Record<OriginLang, string>>
  /** 编辑器配置 */
  editorConfig: DeepPartial<Pick<IEditorConfig, "libraries" | "prepMap">>
  /** 是否为组件 */
  isComponent?: boolean
}

/** 模板内容 */
export interface ITemplate extends ITemplateBase {
  /** 模板语言 */
  lang: TemplateLang
  /** 模板类型 */
  type: TemplateType
  /** 模板名 */
  name?: string
}