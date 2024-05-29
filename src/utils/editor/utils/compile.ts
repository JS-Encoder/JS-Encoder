import estraverse from "estraverse"
import * as espree from "espree"

interface IImportInfo {
  modules: Array<{ imported: string, local: string }>
  sourceName: string
}

/**
 * 将import语法转化为对象解构赋值形式
 * example：
 * import { ref, Fragment as _Fragment } from "vue"
 * to:
 * { sourceName: "vue", modules: [{ imported: "ref", local: "ref" }, { imported: "Fragment", local: "_Fragment" }] }
 */
export const switchImport2Destruct = (code: string): IImportInfo => {
  const result: IImportInfo = {
    modules: [],
    sourceName: "",
  }

  const AST: any = espree.parse(code, {
    ecmaVersion: "latest",
    sourceType: "module",
    comment: true,
    tokens: true,
    range: true,
  })

  estraverse.traverse(AST, {
    enter(node: any) {
      switch (node.type) {
        case "ImportDeclaration": {
          result.sourceName = node.source.value
          break
        }
        case "ImportSpecifier": {
          result.modules.push({
            imported: node.imported.name,
            local: node.local.name,
          })
          break
        }
        default: {}
      }
    },
  })

  return result
}
