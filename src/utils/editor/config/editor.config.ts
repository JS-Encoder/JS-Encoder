import { StreamLanguage } from "@codemirror/language"
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript"
import { css, cssLanguage } from "@codemirror/lang-css"
import { html, htmlLanguage } from "@codemirror/lang-html"
import { less } from "@codemirror/lang-less"
import { vue } from "@codemirror/lang-vue"
import { sass } from "@codemirror/lang-sass"
import { json } from "@codemirror/lang-json"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { coffeeScript } from "@codemirror/legacy-modes/mode/coffeescript"
import { stylus } from "@codemirror/legacy-modes/mode/stylus"
import { Prep } from "@type/prep"
import { cssLinter, htmlLinter, javascriptLinter, lessLinter, scssLinter, stylusLinter, typescriptLinter, jsonLinter } from "@utils/editor/linter"
import { Extension, Prec } from "@codemirror/state"
import { hoverTooltip, keymap } from "@codemirror/view"
import { vscodeKeymap } from "@replit/codemirror-vscode-keymap"
import { emmetConfig, abbreviationTracker, expandAbbreviation, EmmetKnownSyntax } from "@emmetio/codemirror6-plugin"
import { emacsStyleKeymap } from "@codemirror/commands"
import { ShortcutMode } from "@type/settings"
import { Theme } from "@type/interface"
import themes from "@utils/editor/themes"
import { scrollPastEnd } from "@codemirror/view"
import { search } from "@codemirror/search"
import { createSearchPanel } from "../panels/search"
import { markdownKeymap, markdownToolsState } from "../panels/markdown-tools"
import { javascriptAutocomplete, typescriptAutocomplete } from "../auto-complete"
import { tsTypeDefinition, typescriptLSPPlugin } from "../lsp/typescript"
import { indentationMarkers } from "@replit/codemirror-indentation-markers"
import { getGoToLinePanel } from "../panels/go-to-line"
import { getFormatCodeKeymap, prep2ParserNameMap } from "../formatter"
import { vueLanguageNoIndent } from "../indentation"

/** 快捷键模式对应的按键映射扩展 */
export const ShortCutMode2ExtensionMap = {
  [ShortcutMode.VSCODE]: vscodeKeymap,
  [ShortcutMode.EMACS]: emacsStyleKeymap,
}

/** 获取编辑器通用默认配置 */
export const getDefaultEditorExtensions = (): Extension[] => {
  return [
    keymap.of(vscodeKeymap),
    scrollPastEnd(),
    indentationMarkers(),
  ]
}

const Prep2DefaultExtensionMap: Partial<Record<Prep, () => Extension[]>> = {
  [Prep.MARKDOWN]: () => [markdownToolsState, keymap.of(markdownKeymap)],
  [Prep.JAVASCRIPT]: () => [typescriptLSPPlugin],
  [Prep.TYPESCRIPT]: () => [typescriptLSPPlugin],
  [Prep.VUE]: () => [vueLanguageNoIndent],
}

/** 获取每个预处理器的默认配置 */
export const getDefaultEditorConfigByPrep = (prep: Prep): Extension[] => {
  return Prep2DefaultExtensionMap[prep]?.() || []
}

const markdownCodeLanguages = (info: string) => {
  switch (info) {
    case "javascript":
    case "js":
    case "ts":
    case "typescript":
    case "tsx":
    case "jsx":
      return javascriptLanguage
    case "css":
      return cssLanguage
    case "html":
      return htmlLanguage
    case "markdown":
    case "md":
      return markdownLanguage
    default:
      return null
  }
}

const Prep2LanguageExtensionMap: Partial<Record<Prep, () => Extension | StreamLanguage<unknown>>> = {
  [Prep.HTML]: () => html(),
  [Prep.MARKDOWN]: () => markdown({
    base: markdownLanguage,
    codeLanguages: markdownCodeLanguages,
  }),
  [Prep.CSS]: () => css(),
  [Prep.SASS]: () => sass({ indented: true }),
  [Prep.SCSS]: () => sass(),
  [Prep.LESS]: () => less(),
  [Prep.JAVASCRIPT]: () => javascript({ typescript: false, jsx: false }),
  [Prep.TYPESCRIPT]: () => javascript({ typescript: true }),
  [Prep.BABEL]: () => javascript({ jsx: true }),
  [Prep.JSON]: () => json(),
  // maybe should support tsx :)
  [Prep.VUE]: () => vue({ base: html() }),
  // legacy-modes 下面的语言扩展
  [Prep.STYLUS]: () => StreamLanguage.define(stylus),
  [Prep.COFFEESCRIPT]: () => StreamLanguage.define(coffeeScript),
}

/** 获取语言对应的基础扩展 */
export const getPrepBaseExtension = (prep: Prep): Extension => {
  return Prep2LanguageExtensionMap[prep]?.() || []
}

/** 语言对应的linter扩展 */
const Prep2LinterExtensionMap: Partial<Record<Prep, () => Extension>> = {
  [Prep.HTML]: () => htmlLinter,
  [Prep.CSS]: () => cssLinter,
  [Prep.SASS]: () => scssLinter,
  [Prep.SCSS]: () => scssLinter,
  [Prep.LESS]: () => lessLinter,
  [Prep.STYLUS]: () => stylusLinter,
  [Prep.JAVASCRIPT]: () => javascriptLinter,
  [Prep.TYPESCRIPT]: () => typescriptLinter,
  [Prep.JSON]: () => jsonLinter,
}

/** 获取语言对应的linter扩展 */
export const getPrepLintExtension = (prep: Prep): Extension => {
  const extension = Prep2LinterExtensionMap[prep]?.()
  return extension || []
}

const Prep2EmmetSyntaxMap: Partial<Record<Prep, EmmetKnownSyntax>> = {
  [Prep.HTML]: EmmetKnownSyntax.html,
  [Prep.PUG]: EmmetKnownSyntax.pug,
  [Prep.CSS]: EmmetKnownSyntax.css,
  [Prep.SASS]: EmmetKnownSyntax.sass,
  [Prep.SCSS]: EmmetKnownSyntax.scss,
  [Prep.LESS]: EmmetKnownSyntax.less,
  [Prep.VUE]: EmmetKnownSyntax.vue,
}

/** 获取语言对应的Emmet扩展 */
export const getPrepEmmetExtension = (prep: Prep): Extension => {
  const emmetSyntax = Prep2EmmetSyntaxMap[prep]
  const extensions = emmetSyntax
    ? [
        emmetConfig.of({ syntax: emmetSyntax }),
        // 暂时不用emmet格式展示组件
        abbreviationTracker({ syntax: emmetSyntax }),
        Prec.highest(keymap.of([{
          key: "Tab",
          run: expandAbbreviation,
        }])),
      ]
    : []
  return extensions
}

/** 主题对应的编辑器样式拓展 */
const theme2EditorStyleMap: Record<Theme, () => Extension> = {
  [Theme.DARK]: () => themes.darkTheme,
  [Theme.LIGHT]: () => themes.lightTheme,
}

export const getEditorThemeExtension = (theme: Theme): Extension => {
  return theme2EditorStyleMap[theme]()
}

// TODO: 添加gotoLine插件
export const getPanelExtension = (): Extension => {
  return [
    search({ top: true, createPanel: createSearchPanel }),
    getGoToLinePanel(),
  ]
}

const prep2AutocompleteExtensionMap: Partial<Record<Prep, () => Extension>> = {
  [Prep.JAVASCRIPT]: () => javascriptAutocomplete(),
  [Prep.TYPESCRIPT]: () => typescriptAutocomplete(),
}

export const getPrepAutocompleteExtension = (prep: Prep): Extension => {
  const extension = prep2AutocompleteExtensionMap[prep]?.()
  return extension || []
}

const prep2HoverTooltipExtensionMap: Partial<Record<Prep, () => Extension>> = {
  [Prep.TYPESCRIPT]: () => hoverTooltip(tsTypeDefinition),
}

export const getPrepHoverTooltipExtension = (prep: Prep): Extension => {
  const extension = prep2HoverTooltipExtensionMap[prep]?.()
  return extension || []
}

export const getPrepFormatCodeExtension = (prep: Prep): Extension => {
  if (!prep2ParserNameMap[prep]) { return [] }
  return keymap.of(getFormatCodeKeymap(prep))
}