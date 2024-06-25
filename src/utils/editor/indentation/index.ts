import { htmlLanguage } from "@codemirror/lang-html"
import { TreeIndentContext, indentNodeProp } from "@codemirror/language"

/** vue 单文件组件的 script 和 style 不应有第一层默认缩进，需要去掉 */
export const vueLanguageNoIndent = htmlLanguage.configure({
  props: [indentNodeProp.add({
    Element(context: TreeIndentContext) {
      const after = /^(\s*)(<\/)?/.exec(context.textAfter)
      if (!after || (context.node.to <= context.pos + after[0].length)) { return context.continue() }
      // 检查是否在 script 或 style 节点内得出是否需要缩进
      const noIndent = context.node.getChild("Script") || context.node.getChild("StyleSheet")
      return context.lineIndent(context.node.from) + (noIndent || after[2] ? 0 : context.unit)
    },
  })],
})