import { EditorView } from "@codemirror/view"
import { HighlightStyle, TagStyle, syntaxHighlighting } from "@codemirror/language"
import { Extension } from "@codemirror/state"
import commonStyle from "./common"

interface Settings {
  background: string
  foreground: string
  caret: string
  selection: string
  focusedSelection: string
  selectionMatch: string
  lineHighlight: string
  gutterBackground: string
  gutterForeground: string
  foldBackground: string
  matchingBracket: string
}

interface IThemeInfo {
  variant: string
  settings: Settings
  styles: TagStyle[]
}

const createTheme = ({ variant, settings, styles }: IThemeInfo): Extension => {
  const theme = EditorView.theme({
    "&": {
      height: "100%",
      backgroundColor: settings.background,
      color: settings.foreground,
    },
    ".cm-content": {
      caretColor: settings.caret,
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: settings.caret,
      borderLeftWidth: "2px",
    },
    ".cm-content .cm-selectionMatch": {
      backgroundColor: settings.selectionMatch,
    },
    ".cm-content .cm-foldPlaceholder": {
      backgroundColor: settings.foldBackground,
      border: "none",
    },
    ".cm-activeLine": {
      backgroundColor: settings.lineHighlight,
    },
    ".cm-gutters": {
      backgroundColor: settings.gutterBackground,
      color: settings.gutterForeground,
    },
    ".cm-activeLineGutter": {
      backgroundColor: settings.lineHighlight,
    },
    ".cm-matchingBracket": {
      backgroundColor: `${settings.matchingBracket} !important`,
    },
    "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
      backgroundColor: settings.focusedSelection,
    },
    ...commonStyle,
  }, {
    dark: variant === "dark",
  })
  const highlightStyle = HighlightStyle.define(styles)
  const extension = [theme, syntaxHighlighting(highlightStyle)]
  return extension
}

export default createTheme