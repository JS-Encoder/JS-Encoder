import { TemplateLang, TemplateType } from "@type/template"
import { ITemplateInfo } from "@utils/config/indexed-db"
import { componentTemplateCodeMap, componentTemplateLibrariesMap, componentTemplatePrepMap, templateCodeMap, templateLibrariesMap, templatePrepMap } from "@utils/config/template"

/** 内置模板列表, 不存入数据库中，id从-1开始递减 */
export const inbuiltTemplateList: ITemplateInfo[] = [
  {
    lang: TemplateLang.VANILLA,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.VANILLA],
    editorConfig: {
      prepMap: templatePrepMap[TemplateLang.VANILLA],
    },
  },
  {
    lang: TemplateLang.VUE,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.VUE],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.VUE],
      prepMap: templatePrepMap[TemplateLang.VUE],
    },
  },
  {
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
    lang: TemplateLang.REACT,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.REACT],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.REACT],
      prepMap: templatePrepMap[TemplateLang.REACT],
    },
  },
  {
    lang: TemplateLang.ELEMENT_PLUS,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.ELEMENT_PLUS],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.ELEMENT_PLUS],
      prepMap: templatePrepMap[TemplateLang.ELEMENT_PLUS],
    },
  },
  {
    lang: TemplateLang.ANT_DESIGN,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.ANT_DESIGN],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.ANT_DESIGN],
      prepMap: templatePrepMap[TemplateLang.ANT_DESIGN],
    },
  },
  {
    lang: TemplateLang.ECHARTS,
    type: TemplateType.INBUILT,
    codeMap: templateCodeMap[TemplateLang.ECHARTS],
    editorConfig: {
      libraries: templateLibrariesMap[TemplateLang.ECHARTS],
      prepMap: templatePrepMap[TemplateLang.ECHARTS],
    },
  },
].map((item, index) => ({
  ...item,
  id: -(index + 1),
}))