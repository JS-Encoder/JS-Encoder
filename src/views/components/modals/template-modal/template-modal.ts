import { TemplateLang, TemplateType } from "@type/template"
import { ITemplateInfo } from "@utils/config/indexed-db"
import { componentTemplateCodeMap, componentTemplateLibrariesMap, componentTemplatePrepMap, templateCodeMap, templateLibrariesMap, templatePrepMap } from "@utils/config/template"

/** 内置模板列表, 不存入数据库中，id从-1开始递减 */
export const inbuiltTemplateList: ITemplateInfo[] = [
  {
    id: -1,
    lang: TemplateLang.VANILLA,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.VANILLA],
    editorConfig: {
      prepMap: templatePrepMap[TemplateLang.VANILLA],
    },
  },
  {
    id: -2,
    lang: TemplateLang.VUE,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.VUE],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.VUE],
      prepMap: templatePrepMap[TemplateLang.VUE],
    },
  },
  {
    id: -3,
    lang: TemplateLang.VUE,
    type: TemplateType.INBUILT,
    isComponent: true,
    codeMap: componentTemplateCodeMap[TemplateLang.VUE],
    editorConfig: {
      libraries: componentTemplateLibrariesMap[TemplateLang.VUE],
      prepMap: componentTemplatePrepMap[TemplateLang.VUE],
    },
  },
  {
    id: -4,
    lang: TemplateLang.REACT,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.REACT],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.REACT],
      prepMap: templatePrepMap[TemplateLang.REACT],
    },
  },
]