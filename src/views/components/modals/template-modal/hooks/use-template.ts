import useEditorWrapperState from "@hooks/use-editor-wrapper-state"
import { useEditorConfigStore } from "@store/editor-config"
import { useEditorWrapperStore } from "@store/editor-wrapper"
import { OriginLang } from "@type/prep"
import { TemplateLang, TemplateType } from "@type/template"
import { DBStoreName, ITemplateInfo } from "@utils/config/indexed-db"
import { DBService } from "@utils/services/indexed-db-service"
import { storeToRefs } from "pinia"

// eslint-disable-next-line max-lines-per-function
const useTemplate = () => {
  const dbService = new DBService()
  const editorWrapperStore = useEditorWrapperStore()
  const editorConfigStore = useEditorConfigStore()
  const { initDefaultWrapper, initComponentWrapper } = useEditorWrapperState()

  /** 获取本地存储的自定义模板列表 */
  const getCustomTemplateList = async () => {
    return await dbService.getAll(DBStoreName.TEMPLATE)
  }

  /** 创建模板 */
  const createTemplate = async (name: string) => {
    const { codeMap, tabMap } = editorWrapperStore
    const { libraries, prepMap } = editorConfigStore
    // 获取源到编辑器代码的映射
    const origin2CodeMap = Object.keys(tabMap).reduce((acc, tabId) => {
      const { origin } = tabMap[Number(tabId)]
      acc[origin] = codeMap[Number(tabId)]
      return acc
    }, {} as Record<OriginLang, string>)
    const template: ITemplateInfo = {
      name,
      lang: TemplateLang.CUSTOM,
      type: TemplateType.CUSTOM,
      codeMap: origin2CodeMap,
      editorConfig: { libraries, prepMap },
    }
    const { success, data: id } = await dbService.add(DBStoreName.TEMPLATE, template)
    const data: ITemplateInfo | undefined = success ? { ...template, id } : undefined
    return { success, data }
  }

  /** 更新模板 */
  const updateTemplate = async (template: ITemplateInfo) => {
    return dbService.update(DBStoreName.TEMPLATE, template)
  }

  /** 应用模板 */
  const applyTemplate = async (template: ITemplateInfo) => {
    const { codeMap, editorConfig: { libraries = {}, prepMap }, isComponent } = template
    const { batchUpdateEditorConfig } = editorConfigStore
    const { batchUpdateEditorWrapper } = editorWrapperStore
    const { origin2TabIdMap } = storeToRefs(editorWrapperStore)

    const { script = [], style = [] } = libraries
    if (isComponent) {
      await initComponentWrapper()
    } else {
      await initDefaultWrapper()
    }
    // 设置代码内容
    const finalCodeMap = Object.entries(origin2TabIdMap.value).reduce((acc, [origin, tabId]) => {
      acc[tabId] = codeMap[origin as OriginLang] || ""
      return acc
    }, {} as Record<number, string>)
    batchUpdateEditorWrapper({ codeMap: finalCodeMap })
    // 设置编辑器预处理、库等配置
    batchUpdateEditorConfig({
      prepMap,
      libraries: { script, style },
    })
  }

  return {
    getCustomTemplateList,
    createTemplate,
    updateTemplate,
    applyTemplate,
  }
}

export default useTemplate