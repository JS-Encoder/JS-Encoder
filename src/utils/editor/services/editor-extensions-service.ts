import { Extension } from "@codemirror/state"
import { OriginLang, Prep } from "@type/prep"
import SingleInstance from "@utils/decorators/single-instance"
import { getDefaultEditorConfigByPrep, getDefaultEditorExtensions, getEditorThemeExtension, getPanelExtension, getPrepAutocompleteExtension, getPrepBaseExtension, getPrepFormatCodeExtension, getPrepHoverTooltipExtension } from "../config/editor.config"
import { AnyArray, Theme } from "@type/interface"
import { getPrepOrigin } from "@utils/tools/prep"
import { reactive } from "vue"

interface IExtensionsInfo {
  prep: Prep,
  // fix: 这里如果要填Extension类型的话会提示"Type instantiation is excessively deep and possibly infinite."
  extensions: AnyArray,
}

/**
 * 处理缓存编辑器的扩展
 */
@SingleInstance
export default class EditorExtensionsService {
  private lang2ExtensionsMap = reactive<Map<OriginLang, IExtensionsInfo>>(new Map())
  /** 所有editor通用的拓展 */
  private commonEditorExtensions: Extension[] = []
  private themeExtensions: Extension = []

  constructor() {
    this.commonEditorExtensions = getDefaultEditorExtensions()
  }

  public setExtensionsInfo(prep: Prep, extensions: Extension[]): void {
    const originLang = getPrepOrigin(prep)
    this.lang2ExtensionsMap.set(originLang!, { prep, extensions })
  }

  /** 获取编辑器所需扩展，首次设置必须传theme */
  public getExtensionsByPrep(prep: Prep, theme?: Theme): Extension[] {
    const originLang = getPrepOrigin(prep)
    const originExtensionsInfo = this.lang2ExtensionsMap.get(originLang!)
    if (!originExtensionsInfo || prep !== originExtensionsInfo.prep) {
      this.setEditorExtensionsByPrep(prep, theme)
    }
    return this.lang2ExtensionsMap.get(originLang!)?.extensions!
  }

  /** 获取预处理相关拓展 */
  public getEditorExtensionsByPrep(prep: Prep): Extension[] {
    return [
      getDefaultEditorConfigByPrep(prep),
      getPrepBaseExtension(prep),
      getPanelExtension(),
      getPrepAutocompleteExtension(prep),
      getPrepHoverTooltipExtension(prep),
      getPrepFormatCodeExtension(prep),
    ]
  }

  public getEditorExtensions(prep: Prep, theme?: Theme): Extension[] {
    const extensions = [
      ...this.commonEditorExtensions,
      ...this.getEditorExtensionsByPrep(prep),
    ]
    if (theme) {
      const extension = getEditorThemeExtension(theme)
      extensions.push(extension)
      this.themeExtensions = extension
    } else {
      extensions.push(this.themeExtensions)
    }
    return extensions
  }

  /** 设置编辑器所需扩展，首次设置必须传theme */
  public setEditorExtensionsByPrep(prep: Prep, theme?: Theme): void {
    this.setExtensionsInfo(prep, this.getEditorExtensions(prep, theme))
  }
}