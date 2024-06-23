import { tags } from "@lezer/highlight"
import createTheme from "./create-theme"

const theme = createTheme({
  variant: "light",
  settings: {
    background: "#FFFFFF",
    foreground: "#4D4D4C",
    caret: "#3366FF",
    selection: "#e5ebf1",
    focusedSelection: "#add6ff",
    selectionMatch: "#add6ff66",
    lineHighlight: "#8a91991a",
    gutterBackground: "#FFFFFF",
    gutterForeground: "#4D4D4C80",
    foldBackground: "#EBEDF0",
    matchingBracket: "#0064001a",
  },
  styles: [
    {
      tag: tags.comment,
      color: "#008000",
    },
    {
      tag: tags.variableName,
      color: "#001080",
    },
    {
      tag: [tags.string, tags.special(tags.brace)],
      color: "#a31515",
    },
    // 数字字面量
    {
      tag: tags.number,
      color: "#098658",
    },
    // 布尔值字面量
    {
      tag: tags.bool,
      color: "#F5871F",
    },
    // null字面量
    {
      tag: tags.null,
      color: "#7f85a3",
    },
    {
      tag: tags.punctuation,
      color: "#3b3b3b",
    },
    // 逻辑运算符
    {
      tag: tags.logicOperator,
      color: "#000000",
    },
    // 算术相关运算符
    {
      tag: tags.arithmeticOperator,
      color: "#000000",
    },
    // 单位
    {
      tag: tags.unit,
      color: "#098658",
    },
    // 充当运算符的关键字
    {
      tag: tags.operatorKeyword,
      color: "#795e26",
    },
    // this
    {
      tag: tags.self,
      color: "#0000ff",
    },
    // 关键字
    {
      tag: tags.keyword,
      color: "#af00db",
    },
    {
      tag: tags.definitionKeyword,
      color: "#0000ff",
    },
    // 运算符
    {
      tag: tags.operator,
      color: "#3E999F",
    },
    // 类名
    {
      tag: tags.className,
      color: "#C99E00",
    },
    // 类型名称定义
    {
      tag: tags.definition(tags.typeName),
      color: "#C99E00",
    },
    // 类型名称
    {
      tag: tags.typeName,
      color: "#F5871F",
    },
    // `<` and `>`
    {
      tag: tags.angleBracket,
      color: "#3E999F",
    },
    // 标签名
    {
      tag: tags.tagName,
      color: "#800000",
    },
    // html标签属性名
    {
      tag: tags.attributeName,
      color: "#e50000",
    },
    // 属性名
    {
      tag: tags.propertyName,
      color: "#e50000",
    },
    // 函数内的属性名
    {
      tag: tags.function(tags.propertyName),
      color: "#795e26",
    },
    {
      tag: tags.definition(tags.variableName),
      color: "#795e26",
    },
    {
      tag: tags.local(tags.variableName),
      color: "#F00",
    },
    // 函数内的变量名
    {
      tag: tags.function(tags.variableName),
      color: "#718C00",
    },
    // html标签属性值
    {
      tag: tags.attributeValue,
      color: "#0000ff",
    },
    // 标题
    {
      tag: tags.heading,
      fontWeight: "bold",
      color: "#C99E00",
    },
    {
      tag: tags.meta,
      color: "#df631c",
    },
    // 链接
    {
      tag: tags.link,
      color: "#275fe4",
    },
    // 斜体
    {
      tag: tags.emphasis,
      fontStyle: "italic",
      color: "#d52753",
    },
    // 粗体
    {
      tag: tags.strong,
      fontWeight: "bold",
      color: "#d52753",
    },
    // 删除
    {
      tag: tags.strikethrough,
      textDecoration: "line-through",
      color: "#a0a1a7",
    },
    {
      tag: [tags.atom, tags.bool, tags.url, tags.contentSeparator, tags.labelName],
      color: "#0451a5",
    },
    {
      tag: tags.url,
      color: "#23974a",
      textDecoration: "underline",
    },
    {
      tag: [tags.literal, tags.inserted],
      color: "#0451a5",
    },
    {
      tag: tags.deleted,
      color: "#f55",
    },
    {
      tag: tags.regexp,
      color: "#C99E00",
    },
    {
      tag: tags.special(tags.string),
      color: "#718C00",
    },
    {
      tag: tags.escape,
      color: "#df631c",
    },
    {
      tag: [tags.namespace],
      color: "#F22",
    },
    // 如scss中定义的变量
    {
      tag: tags.special(tags.variableName),
      color: "#383a42",
    },
    {
      tag: tags.definition(tags.propertyName),
      color: "#a05a48",
    },
    {
      tag: tags.invalid,
      color: "#800000",
    },
  ],
})

export default theme