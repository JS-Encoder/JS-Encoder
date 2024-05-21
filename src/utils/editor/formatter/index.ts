import { Prep } from "@type/prep"
import { PRETTIER_PLUGIN_PREFIX } from "@utils/tools/config"
import prettier, { BuiltInParserName, RequiredOptions } from "prettier"

const prep2ParserNameMap: Partial<Record<Prep, BuiltInParserName>> = {
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

// TODO: 可以在设置里面添加prettier配置
/** 初始格式化风格配置 */
export const initialFormatStyleOptions: Partial<RequiredOptions> = {
  /** 分号 */
  semi: false,
  /** 单引号 */
  singleQuote: false,
  /** jsx中使用单引号 */
  jsxSingleQuote: false,
  /** 尾随逗号 */
  trailingComma: "all",
  /** 对象大括号内部空格 */
  bracketSpacing: true,
  /** 将多行 HTML（HTML、JSX、Vue）元素的“>”放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）。 */
  bracketSameLine: false,
  /** 强制一行只能放一个属性(HTML、JSX、Vue) */
  singleAttributePerLine: false,
  /** tab大小 */
  tabWidth: 2,
  /** 用tab代替空格 */
  useTabs: true,
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
    ...initialFormatStyleOptions,
    ...options,
  })
}