import type { RequiredOptions } from "prettier"

/** 默认格式化风格配置 */
export const defaultFormatStyleOptions: Partial<RequiredOptions> = {
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
}