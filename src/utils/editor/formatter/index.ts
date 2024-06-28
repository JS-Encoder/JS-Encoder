import { KeyBinding } from "@codemirror/view"
import { Prep } from "@type/prep"
import { PRETTIER_PLUGIN_PREFIX } from "@utils/tools/config"
import prettier, { BuiltInParserName, RequiredOptions } from "prettier"
import { CodemirrorBase } from "../utils/codemirror-base"
import { defaultFormatStyleOptions } from "./config"
import useCodeFormatting from "@hooks/use-code-formatting"

export const prep2ParserNameMap: Partial<Record<Prep, BuiltInParserName>> = {
  [Prep.HTML]: "html",
  [Prep.MARKDOWN]: "markdown",
  [Prep.CSS]: "css",
  [Prep.SASS]: "scss",
  [Prep.SCSS]: "scss",
  [Prep.LESS]: "less",
  [Prep.JAVASCRIPT]: "babel",
  [Prep.TYPESCRIPT]: "typescript",
  [Prep.BABEL]: "babel",
  [Prep.VUE]: "vue",
}

const prep2ParserName: Partial<Record<Prep, string[]>> = {
  [Prep.HTML]: ["html"],
  [Prep.MARKDOWN]: ["markdown"],
  [Prep.CSS]: ["postcss"],
  [Prep.SASS]: ["postcss"],
  [Prep.SCSS]: ["postcss"],
  [Prep.LESS]: ["postcss"],
  [Prep.JAVASCRIPT]: ["babel", "estree"],
  [Prep.TYPESCRIPT]: ["typescript"],
  [Prep.BABEL]: ["babel", "estree", "html"],
  [Prep.VUE]: ["html", "babel", "postcss"],
}

const importFormatPlugin = async (prep: Prep) => {
  const list = prep2ParserName[prep] || []
  const reqList = list?.map((name) => {
    return import(/* @vite-ignore */`${PRETTIER_PLUGIN_PREFIX}/${name}.mjs`)
  })
  return Promise.all(reqList)
}

export const formatCode = async (code: string, prep: Prep, options?: Partial<RequiredOptions>) => {
  const plugins = await importFormatPlugin(prep)
  return prettier.format(code, {
    parser: prep2ParserNameMap[prep],
    plugins,
    ...defaultFormatStyleOptions,
    ...options,
  })
}

export const getFormatCodeKeymap = (prep: Prep): KeyBinding[] => {
  const { formatEditorCode } = useCodeFormatting()
  return [{
    key: "Shift-Alt-f",
    run: (view) => {
      const baseTools = new CodemirrorBase(view)
      const code = baseTools.getContent()
      formatEditorCode(code, prep).then((result) => {
        baseTools.setContent(result)
      })
      return true
    },
  }]
}