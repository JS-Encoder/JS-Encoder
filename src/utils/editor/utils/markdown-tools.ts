import { EditorView } from "@codemirror/view"
import { CodemirrorBase } from "./codemirror-base"
import { isHttpUrl } from "@utils/tools/common"

export class MarkdownTools extends CodemirrorBase {
  constructor(view: EditorView) {
    super(view)
  }

  /**
   * 将标志字符串如：~、**、`等插入选中文本两边以达到改变样式的效果
   * 用于代码，粗体，斜体和中划线样式
   */
  public changeTextStyle(flagText: string): void {
    const changeOffset = flagText.length
    if (this.somethingSelected()) {
      // 已经选中范围信息
      const selectRange = this.getListSelections()[0]
      // 获取选中的文本和前后光标位置
      const { head, anchor } = this.getRangeBothSides(selectRange)
      const { line: headLine, col: headCol } = head
      const { line: anchorLine, col: anchorCol } = anchor
      // 获取选中文本
      const selectText = this.getSelectionText()
      // 替换选中的文本，插入标记字符串（如果已经有标记字符串就删除）
      this.replaceRange(
        { line: headLine, col: headCol },
        { line: anchorLine, col: anchorCol },
        `${flagText}${selectText}${flagText}`,
      )
    } else {
      const cursor = this.getCursor()
      const { line: cursorLine, col: cursorCol } = cursor
      this.replaceSelection(flagText + flagText)
      this.setCursor({ line: cursorLine, col: cursorCol + changeOffset })
    }
  }

  /** 插入有序列表 */
  public insertOrderList(): void {
    if (this.somethingSelected()) {
      // 已经选中范围信息
      const selectRange = this.getListSelections()[0]
      // 获取选中的文本和前后光标位置
      const { head, anchor } = this.getRangeBothSides(selectRange)
      const { line: headLine } = head
      const { line: anchorLine } = anchor
      if (headLine === anchorLine) {
        const selectText = this.getSelectionText()
        const preRangeText = this.getRangeText({ line: headLine, col: 0 }, head)
        // 获取item前面的制表符空格和列表号数
        const { orderNumber, preBlank } = this.getSplitListItem(preRangeText)
        const preEnter = preRangeText ? "\n" : ""
        const replaceText = `${preBlank}${orderNumber + 1}. ${selectText}`
        this.replaceSelection(`${preEnter}${replaceText}`)
        this.setCursor({ line: headLine + preEnter.length, col: replaceText.length })
      } else {
        let orderNumber = 1
        for (let i = headLine; i <= anchorLine; i++) {
          // 光标移到选择的每一行开头加上数字
          this.setCursor({ line: i, col: 0 })
          const replaceText = `${orderNumber++}. `
          this.replaceSelection(replaceText)
        }
        this.setCursor({ line: anchorLine, col: this.getLine(anchorLine).text.length })
      }
    } else {
      const cursor = this.getCursor()
      const { line: cursorLine } = cursor
      const preRangeText = this.getRangeText({ line: cursorLine, col: 0 }, cursor)
      // 获取item前面的制表符空格和列表号数
      const { orderNumber, preBlank } = this.getSplitListItem(preRangeText)
      const preEnter = preRangeText ? "\n" : ""
      const replaceText = `${preBlank}${orderNumber + 1}. `
      this.replaceSelection(`${preEnter}${replaceText}`)
      this.setCursor({ line: cursorLine + preEnter.length, col: replaceText.length })
    }
  }

  /** 插入无序列表或引用 */
  public insertUnorderedList(flagText: string): void {
    if (this.somethingSelected()) {
      // 已经选中范围信息
      const selectRange = this.getListSelections()[0]
      // 获取选中的文本和前后光标位置
      const { head, anchor } = this.getRangeBothSides(selectRange)
      const { line: headLine } = head
      const { line: anchorLine } = anchor
      if (headLine === anchorLine) {
        const selectText = this.getSelectionText()
        const preRangeText = this.getRangeText({ line: headLine, col: 0 }, head)
        const preEnter = preRangeText ? "\n" : ""
        const replaceText = `${flagText}${selectText}`
        this.replaceSelection(`${preEnter}${replaceText}`)
        this.setCursor({ line: headLine + preEnter.length, col: replaceText.length })
      } else {
        for (let i = headLine; i <= anchorLine; i++) {
          // 光标移到选择的每一行开头加上无序列表或引用标志
          this.setCursor({ line: i, col: 0 })
          this.replaceSelection(flagText)
        }
        this.setCursor({ line: anchorLine, col: this.getLine(anchorLine).text.length })
      }
    } else {
      const cursor = this.getCursor()
      // eslint-disable-next-line prefer-const
      let { line: cursorLine, col: cursorCol } = cursor
      const preRangeText = this.getRangeText({ line: cursorLine, col: 0 }, cursor)
      const { preBlank } = this.getSplitListItem(preRangeText)
      let replaceText = flagText
      const preEnter = cursorCol ? "\n" : ""
      if (cursorCol) {
        // 前面已经有东西就换到下一行
        replaceText = `${preBlank}${replaceText} `
        cursorLine ++
      }
      this.replaceSelection(`${preEnter}${replaceText}`)
      this.setCursor({ line: cursorLine, col: replaceText.length })
    }
  }

  /** 插入横线 */
  public insertLine(): void {
    if (this.somethingSelected()) {
      const selectRange = this.getListSelections()[0]
      const { head: { line: headLine } } = this.getRangeBothSides(selectRange)
      this.replaceSelection("\n\n---\n\n")
      this.setCursor({ line: headLine + 4, col: 0 })
    } else {
      const cursor = this.getCursor()
      // eslint-disable-next-line prefer-const
      let { line: cursorLine, col: cursorCol } = cursor
      const replaceText = cursorCol ? "\n\n---\n\n" : "\n---\n\n"
      cursorLine += cursorCol ? 4 : 3
      this.replaceSelection(replaceText)
      this.setCursor({ line: cursorLine, col: 0 })
    }
  }

  /** 根据标题级别H1,H2,H3,H4,H5,H6，添加标题 */
  public insertTitle(level: number): void {
    let prefix = ""
    for (let i = 0; i < level; i++) {
      prefix += "#"
    }
    prefix += " "
    if (this.somethingSelected()) {
      const selectRange = this.getListSelections()[0]
      const selectText = this.getSelectionText()
      const { head, anchor } = this.getRangeBothSides(selectRange)
      const { line: headLine, col: headCol } = head
      const { line: anchorLine } = anchor
      if (headCol) {
        prefix = "\n\n" + prefix
      }
      this.replaceSelection(`${prefix}${selectText}`)
      if (headLine !== anchorLine) {
        this.setCursor({ line: headLine + 2, col: level + 1 })
      }
    } else {
      const cursor = this.getCursor()
      let { line: cursorLine, col: cursorCol } = cursor
      if (cursorCol) {
        prefix = "\n\n" + prefix
      }
      this.replaceSelection(prefix)
      if (cursorCol) {
        cursorLine += 2
      }
      cursorCol = level + 1
      this.setCursor({ line: cursorLine, col: cursorCol })
    }
  }

  /** 插入链接或图片 */
  public insertLink(isImage?: boolean): void {
    if (this.somethingSelected()) {
      const selectRange = this.getListSelections()[0]
      const selectText = this.getSelectionText()
      const { head, anchor } = this.getRangeBothSides(selectRange)
      // eslint-disable-next-line prefer-const
      let { line: headLine, col: headCol } = head
      const { line: anchorLine } = anchor
      if (headLine !== anchorLine) { return }
      const isLink = isHttpUrl(selectText)
      let replaceText = isLink ? `[](${selectText})` : `[${selectText}]()`
      headCol += isLink ? 1 : selectText.length + 3
      if (isImage) {
        headCol += 1
        replaceText = "!" + replaceText
      }
      this.replaceSelection(replaceText)
      this.setCursor({ line: headLine, col: headCol })
    } else {
      const cursor = this.getCursor()
      // eslint-disable-next-line prefer-const
      let { line: cursorLine, col: cursorCol } = cursor
      let replaceText = "[]()"
      cursorCol += 3
      if (isImage) {
        replaceText = "!" + replaceText
        cursorCol ++
      }
      this.replaceSelection(replaceText)
      this.setCursor({ line: cursorLine, col: cursorCol })
    }
  }

  private getSplitListItem(text: string): { orderNumber: number, preBlank: string } {
    const matchRegExp = /^( |\t)+/
    /** 列表每项前面的数字 */
    let orderNumber = 0
    /** 列表每项前面的制表符或空格 */
    let preBlank = ""
    if (matchRegExp.test(text)) {
      // 取出前面的空格和制表符
      preBlank = text.match(matchRegExp)?.[0] || ""
      text = text.trimStart()
    }
    if (/^\d+(\.) /.test(text)) {
      // 取出前面的数字
      orderNumber = Number(text.match(/^\d+/)?.[0] || orderNumber)
    }
    return { orderNumber, preBlank }
  }
}