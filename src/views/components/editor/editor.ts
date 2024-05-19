import { Extension } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { AnyObject } from "@type/interface"
import { Prep } from "@type/prep"
import { ShortcutMode } from "@type/settings"

export interface ICodemirrorEditorSettings {
  codeHinting?: boolean
  codeLint?: boolean
  lineWrapping?: boolean
  lineNumbers?: boolean
  useEmmet?: boolean
  indentWithTab?: boolean
  tabSize?: number
  shortcutTemplate?: ShortcutMode
  autocomplete?: boolean
  style?: Record<string, AnyObject>
}

export interface IProps {
  prep: Prep
  settings?: ICodemirrorEditorSettings
  code?: string
  modelValue?: string
  extensions?: Extension[]
  minimal?: boolean
  /** 该属性是用来在editor内监听该编辑器是否被展示的（v-show=true），用来执行副作用 */
  showEditor?: boolean
}

export interface IEmits {
  (e: "codeChanged" | "update:modelValue", code: string): void
  (e: "focus" | "blur"): void
}

export interface IEditorViewExpose {
  getEditorView: () => EditorView | undefined
  /** 重新恢复editor状态 */
  restoreViewScroll: (delay?: boolean) => void
}