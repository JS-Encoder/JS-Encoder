import { OriginLang } from "./prep"
import { IEditorConfig } from "./settings"
import { DeepPartial } from "./types"

/** 模板对应的语言 */
export const enum TemplateLang {
  VUE = "Vue",
  VANILLA = "Vanilla",
  REACT = "React",
  CUSTOM = "Custom",
}

/** 模板类型 */
export const enum TemplateType {
  /** 内置 */
  INBUILT = "inbuilt",
  /** 自定义 */
  CUSTOM = "custom",
}

/** 模板内容 */
export interface ITemplate {
  /** 模板语言 */
  lang: TemplateLang
  /** 模板类型 */
  type: TemplateType
  /** 代码 */
  codeMap: Partial<Record<OriginLang, string>>
  /** 编辑器配置 */
  editorConfig: DeepPartial<Pick<IEditorConfig, "libraries" | "prepMap">>
  /** 是否为组件 */
  isComponent?: boolean
  /** 模板名 */
  name?: string
}