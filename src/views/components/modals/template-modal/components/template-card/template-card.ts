import { OriginLang, Prep } from "@type/prep"
import { ITemplate, TemplateLang, TemplateType } from "@type/template"
import { ITemplateInfo } from "@utils/config/indexed-db"
import { prep2IconMap } from "@utils/tools/prep"

/** 不同类型模板对应的icon */
export const inbuiltTemplateIconMap = {
  [TemplateLang.VUE]: "icon-vue",
  [TemplateLang.VANILLA]: "icon-javascript",
  [TemplateLang.REACT]: "icon-jsx",
  [TemplateLang.ELEMENT_PLUS]: "icon-element-plus",
  [TemplateLang.ANT_DESIGN]: "icon-ant-design",
  [TemplateLang.ECHARTS]: "icon-echarts",
  [TemplateLang.RXJS]: "icon-rxjs",
}

export interface IProps {
  template: ITemplateInfo
  active: boolean
}

enum EmitType {
  CHOOSE = "choose",
  EDIT = "edit",
  DELETE = "delete",
}

export interface IEmits {
  (event: "choose" | "edit" | "delete", value: ITemplateInfo): void
}

export enum TemplateOptionType {
  EDIT,
  DELETE,
}

export const templateOptions = [
  { type: TemplateOptionType.EDIT, event: EmitType.EDIT, text: "编辑" },
  { type: TemplateOptionType.DELETE, event: EmitType.DELETE, text: "删除" },
]

/** 根据模板的预处理获取模板的主要语言 */
export const getTemplateIcon = (template: ITemplate): string => {
  const { lang, type, editorConfig: { prepMap = {} } } = template
  if (type === TemplateType.INBUILT && lang !== TemplateLang.CUSTOM) {
    return inbuiltTemplateIconMap[lang]
  } else {
    if (prepMap[OriginLang.HTML] === Prep.MARKDOWN ) {
      return "icon-markdown"
    } else {
      return prep2IconMap[prepMap[OriginLang.JAVASCRIPT] || Prep.JAVASCRIPT] || "icon-custom"
    }
  }
}