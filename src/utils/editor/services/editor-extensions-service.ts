import { Extension } from "@codemirror/state"
import { Prep } from "@type/prep"
import SingleInstance from "@utils/decorators/single-instance"
import { getDefaultEditorConfigByPrep, getDefaultEditorExtensions, getPanelExtension, getPrepAutocompleteExtension, getPrepBaseExtension, getPrepHoverTooltipExtension } from "../config/editor.config"

/**
 * 处理缓存编辑器的扩展
 */
@SingleInstance
export default class EditorExtensionsService {
  /** 所有editor通用的拓展 */
  private commonEditorExtensions: Extension[] = []

  constructor() {
    this.commonEditorExtensions = getDefaultEditorExtensions()
  }

  /** 获取预处理相关拓展 */
  public getEditorExtensionsByPrep(prep: Prep): Extension[] {
    return [
      getDefaultEditorConfigByPrep(prep),
      getPrepBaseExtension(prep),
      getPanelExtension(),
      getPrepAutocompleteExtension(prep),
      getPrepHoverTooltipExtension(prep),
    ]
  }

  public getEditorExtensions(prep: Prep): Extension[] {
    const extensions = [
      ...this.commonEditorExtensions,
      ...this.getEditorExtensionsByPrep(prep),
    ]
    return extensions
  }
}