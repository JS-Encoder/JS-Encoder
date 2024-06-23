import { indentWithTab } from "@codemirror/commands"
import { indentUnit } from "@codemirror/language"
import { Compartment, EditorState, Extension, StateEffect } from "@codemirror/state"
import { EditorView, keymap, lineNumbers } from "@codemirror/view"
import { AnyObject, Theme } from "@type/interface"
import { ShortcutMode } from "@type/settings"
import { ShortCutMode2ExtensionMap, getEditorThemeExtension } from "../config/editor.config"

export type ExtensionToggler = (newStatus?: boolean | undefined) => void

export class CodemirrorExtensionsUpdater {
  public view: EditorView
  public extensionUpdater = this.getExtensionUpdater()
  public tabIndentToggler = this.getExtensionToggler(keymap.of([indentWithTab]))
  public lineNumbersToggler = this.getExtensionToggler(lineNumbers())
  public lineWrappingToggler = this.getExtensionToggler(EditorView.lineWrapping)
  private tabSizeUpdater = this.getExtensionUpdater()
  private styleUpdater = this.getExtensionUpdater()
  private keymapBindingUpdater = this.getExtensionUpdater()
  private themeUpdater = this.getExtensionUpdater()

  constructor(view: EditorView) {
    this.view = view
  }

  /** 获取扩展更新方法 */
  public getExtensionUpdater() {
    const compartment = new Compartment()
    // 返回个函数保留compartment引用
    return (extension: Extension) => {
      compartment.get(this.view.state)
        // 重新配置插件
        ? this.view.dispatch({ effects: compartment.reconfigure(extension) })
        // 注入新插件
        : this.view.dispatch({ effects: StateEffect.appendConfig.of(compartment.of(extension)) })
    }
  }

  /** 开启或关闭扩展 */
  public getExtensionToggler(extension: Extension): ExtensionToggler {
    const updater = this.getExtensionUpdater()
    return (newStatus?: boolean) => {
      updater(newStatus ? extension : [])
    }
  }

  /** 设置tab size */
  public setTabSize(tabSize: number) {
    this.tabSizeUpdater([
      EditorState.tabSize.of(tabSize),
      indentUnit.of(" ".repeat(tabSize)),
    ])
  }

  /**
   * 设置编辑器样式
   * example：
   * "&": {
        color: "white",
        backgroundColor: "#034"
      },
      ".cm-content": {
        caretColor: "#0e9"
      },
   */
  public setStyle(style: Record<string, AnyObject> = {}) {
    this.styleUpdater(EditorView.theme(style))
  }

  /** 设置快捷键模式 */
  public setKeymapBinding(shortcutMode: ShortcutMode) {
    this.keymapBindingUpdater(keymap.of(ShortCutMode2ExtensionMap[shortcutMode]))
  }

  /** 设置主题 */
  public setTheme(theme: Theme) {
    this.themeUpdater(getEditorThemeExtension(theme))
  }
}