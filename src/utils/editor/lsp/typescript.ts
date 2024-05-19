/**
 * 通过虚拟文件系统构建typescript语言服务器
 * Ref: https://stackblitz.com/edit/codemirror-6-typescript
 */

import * as tsVfs from "@typescript/vfs"
import ts from "typescript"
import { CompletionContext, CompletionResult } from "@codemirror/autocomplete"
import { EditorView } from "codemirror"
import { Tooltip, ViewPlugin, ViewUpdate } from "@codemirror/view"

const DEFAULT_FILE_NAME = "index.ts"
const vfsMap = await tsVfs.createDefaultMapFromCDN(
  {},
  ts.version,
  true,
  ts,
)
vfsMap.set(DEFAULT_FILE_NAME, " ")

const system = tsVfs.createSystem(vfsMap)
const tsEnv = tsVfs.createVirtualTypeScriptEnvironment(
  system,
  [DEFAULT_FILE_NAME],
  ts,
  {},
)

export const tsLinter = () => {
  const tsErrors = tsEnv.languageService
    .getSemanticDiagnostics(DEFAULT_FILE_NAME)
    .concat(tsEnv.languageService.getSyntacticDiagnostics(DEFAULT_FILE_NAME))
  return tsErrors.map(({ start = 0, length = 0, messageText }) => ({
    from: start,
    to: start + length,
    severity: "error",
    message: typeof messageText === "string"
      ? messageText
      : messageText.messageText,
  }))
}

export const tsComplete = async (context: CompletionContext): Promise<CompletionResult | null> => {
  const tsCompletions = tsEnv.languageService.getCompletionsAtPosition(
    DEFAULT_FILE_NAME,
    context.pos,
    {},
  )

  if (!tsCompletions) { return { from: context.pos, options: [] } }

  const code = context.state.doc.toString()
  let lastWord: string = ""
  let from: number
  const completeMarkList = [".", "\n", ":", " "]
  for (let i = context.pos - 1; i >= 0; i--) {
    if (completeMarkList.includes(code[i]) || i === 0) {
      from = i === 0 ? i : i + 1
      lastWord = code.slice(from, context.pos).trim()
      break
    }
  }

  if (lastWord) {
    tsCompletions.entries = tsCompletions.entries.filter((completion) =>{
      return completion.name.startsWith(lastWord)
    })
  }

  return {
    from: context.pos,
    options: tsCompletions.entries.map((completion) => ({
      type: completion.kind === "var" ? "variable" : completion.kind,
      label: completion.name,
      apply: (view: EditorView) => {
        view.dispatch({
          changes: { from, to: context.pos, insert: completion.name },
        })
      },
    })),
  }
}

/**
 * 判断是否为token
 * @param kind 节点的 SyntaxKind 枚举，用于标识 AST 中的类型
 * @returns boolean
 */
const isTokenKind = (kind: ts.SyntaxKind) => {
  return kind >= ts.SyntaxKind.FirstToken && kind <= ts.SyntaxKind.LastToken
}

/**
 * @param node AST节点
 * @param pos 位置
 * @param sourceFile 原文件
 * @returns
 */
const getTokenAtPositionWorker = (
  astNode: ts.Node,
  pos: number,
  sourceFile: ts.SourceFile,
) => {
  const getTokenKindChild = (node: ts.Node): ts.Node | undefined => {
    // 遍历子节点
    for (const child of node.getChildren(sourceFile)) {
      if (child.end > pos && child.kind !== ts.SyntaxKind.JSDocComment) {
        if (isTokenKind(child.kind)) { return child }
        // 下一个token嵌套在另一个节点中
        return getTokenKindChild(child)
      }
    }
    return
  }
  return getTokenKindChild(astNode)
}

/** 获取指定位置的token */
const getTokenAtPosition = (
  parent: ts.Node,
  pos: number,
  sourceFile?: ts.SourceFile,
) => {
  if (pos < parent.pos || pos >= parent.end) { return }
  if (isTokenKind(parent.kind)) { return parent }
  if (!sourceFile) {
    sourceFile = parent.getSourceFile()
  }
  return getTokenAtPositionWorker(parent, pos, sourceFile)
}

/** 鼠标悬停展示typescript定义tooltip */
export const tsTypeDefinition = (
  view: EditorView,
  pos: number,
  side: number,
): Tooltip | null => {
  const { from, to, text } = view.state.doc.lineAt(pos)
  /**
   * 计算悬停展示定义tooltip的位置范围
   * Ref: https://codemirror.net/examples/tooltip/
   */
  let start = pos; let end = pos
  while (start > from && /\w/.test(text[start - from - 1])) {
    start--
  }
  while (end < to && /\w/.test(text[end - from])) {
    end++
  }
  if ((start === pos && side < 0) || (end === pos && side > 0)) {
    return null
  }

  // 创建文件的AST并做语法分析
  const program = tsEnv.languageService.getProgram()
  if (!program) { return null }
  // 创建checker，获取语义语法分析中的报错
  const typeChecker = program.getTypeChecker()
  const sourceFile = program.getSourceFile(DEFAULT_FILE_NAME)
  if (!sourceFile) { return null }
  const token = getTokenAtPosition(sourceFile, pos)
  if (!token) { return null }
  /** 获取悬停位置变量的类型 */
  const type = typeChecker.getTypeAtLocation(token)
  return {
    pos: start,
    end,
    above: true,
    create: () => {
      // 拼接tooltip内需要展示的内容
      const dom = document.createElement("div")
      dom.innerHTML = [
        "<pre>",
        typeChecker.typeToString(
          type,
          undefined,
          ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias,
        ),
        "</pre>",
      ].join("")
      return { dom }
    },
  }
}

export const typescriptLSPPlugin = ViewPlugin.fromClass(
  class {
    update(update: ViewUpdate) {
      if (update.docChanged) {
        tsEnv.updateFile(DEFAULT_FILE_NAME, update.view.state.doc.toString() || " ")
      }
    }
  },
)