import { EditorSelection, Line, SelectionRange, Text } from "@codemirror/state"
import { EditorView } from "@codemirror/view"

export interface IPos {
  /** 行 */
  line: number
  /** 列 */
  col: number
}

export interface IRangeBothSides {
  /** 头部 */
  head: IPos
  /** 尾部 */
  anchor: IPos
}

/** 封装的codemirror底层api调用 */
export class CodemirrorBase {
  protected view: EditorView

  constructor(view: EditorView) {
    this.view = view
  }

  public getDoc(): Text {
    return this.view.state.doc
  }

  public getSelection(): EditorSelection {
    return this.view.state.selection
  }

  /** 获取编辑器内容 */
  public getContent(): string {
    return this.getDoc().toString()
  }

  /** 设置编辑器内容 */
  public setContent(newContent: string): void {
    if (newContent === this.getContent()) { return }
    this.view.dispatch({
      changes: {
        from: 0,
        to: this.getDoc().length,
        insert: newContent,
      },
    })
  }

  /** 获取选中信息列表 */
  public getListSelections(): readonly SelectionRange[] {
    return this.getSelection().ranges
  }

  /** 是否有文本被选中 */
  public somethingSelected(): boolean {
    return this.getListSelections().some((r) => !r.empty)
  }

  /** 获取光标位置 */
  public getCursor(): IPos {
    return this.transOffset2Pos(this.getSelection().main.head)
  }

  public setCursorByOffset(offset: number): void {
    this.view.dispatch({ selection: { anchor: offset } })
  }

  /** 设置光标位置 */
  public setCursor(pos: IPos): void {
    const offset = this.transPos2Offset(pos)
    this.setCursorByOffset(offset)
  }

  public focus(): void {
    this.view.focus()
  }

  /** 获取行信息 */
  public getLine(line: number): Line {
    return this.getDoc().line(line)
  }

  /** 获取偏移量所在行信息 */
  public getLineByPos(offset: number): Line {
    return this.getDoc().lineAt(offset)
  }

  public getLastLine(): Line {
    return this.getLineByPos(this.getContent().length)
  }

  /** 获得范围内的文本 */
  public getRangeText(from: number | IPos, to: number | IPos): string {
    return this.view.state.sliceDoc(
      this.reformPos(from),
      this.reformPos(to),
    )
  }

  /** 获取选中的文本 */
  public getSelectionText(): string {
    const { from, to } = this.getSelection().main
    return this.getRangeText(from, to)
  }

  /** 替换范围内的文本 */
  public replaceRange(from: number | IPos, to: number | IPos, insert: string = ""): void {
    this.view.dispatch({
      changes: {
        from: this.reformPos(from),
        to: this.reformPos(to),
        insert,
      },
    })
  }

  /** 替换选择的文本 */
  public replaceSelection(insert: string = ""): void {
    this.view.dispatch(this.view.state.replaceSelection(insert))
  }

  /** 获得范围的头尾位置 */
  public getRangeBothSides(range: SelectionRange): IRangeBothSides {
    const { head, anchor } = range
    let headPos = this.transOffset2Pos(head)
    let anchorPos = this.transOffset2Pos(anchor)
    if (headPos.line > anchorPos.line || (headPos.line === anchorPos.line && headPos.col > anchorPos.col)) {
      [headPos, anchorPos] = [anchorPos, headPos]
    }
    return { head: headPos, anchor: anchorPos }
  }

  public reformPos(pos: number | IPos): number {
    return typeof pos === "number" ? pos : this.transPos2Offset(pos)
  }

  /** 将偏移量转换为位置信息 */
  public transOffset2Pos(offset: number): IPos {
    const line = this.getLineByPos(offset)
    return { line: line.number, col: offset - line.from }
  }

  /** 将位置信息转换为偏移量 */
  public transPos2Offset({ line, col }: IPos): number {
    return this.getLine(line).from + col
  }
}

/**
 * 函数式api
 */
