import { Prep } from "@type/prep"
import prettier, { BuiltInParserName, RequiredOptions } from "prettier"
import parserBabel from "prettier/plugins/babel"
import parserESTree from "prettier/plugins/estree"
import parserHTML from "prettier/plugins/html"
import parserMarkdown from "prettier/plugins/markdown"
import parserCSS from "prettier/plugins/postcss"
import parserTypescript from "prettier/plugins/typescript"

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

const prep2ParserPlugins: Partial<Record<Prep, Array<prettier.Plugin<any>>>> = {
  [Prep.HTML]: [parserHTML],
  [Prep.MARKDOWN]: [parserMarkdown],
  [Prep.CSS]: [parserCSS],
  [Prep.SASS]: [parserCSS],
  [Prep.SCSS]: [parserCSS],
  [Prep.LESS]: [parserCSS],
  [Prep.JAVASCRIPT]: [parserBabel, parserESTree],
  [Prep.TYPESCRIPT]: [parserTypescript],
  [Prep.BABEL]: [parserBabel, parserESTree, parserHTML],
  [Prep.VUE]: [parserHTML, parserBabel, parserCSS],
}

// TODO: 可以在设置里面添加prettier配置
/** 初始格式化风格配置 */
export const initialFormatStyleOptions: Partial<RequiredOptions> = {
  /** 分号 */
  semi: true,
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

export const formatCode = async (code: string, prep: Prep, options?: Partial<RequiredOptions>) => {
  return prettier.format(code, {
    parser: prep2ParserNameMap[prep],
    plugins: prep2ParserPlugins[prep],
    ...initialFormatStyleOptions,
    ...options,
  })
}