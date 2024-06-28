import { Diagnostic, linter } from "@codemirror/lint"
import { HTMLHint } from "htmlhint"
import stylusLintRecommendConfig from "@utils/editor/linter/stylus-lint-recommend.config"
import Linter from "eslint4b-prebuilt/dist/eslint4b.es"
import { esLint } from "@codemirror/lang-javascript"
import { tsLinter } from "../lsp/typescript"
import LoaderService from "@utils/services/loader-service"
import htmlLintRuleConfig from "./html-lint.config"
import { CodemirrorBase } from "../utils/codemirror-base"
import { jsonParseLinter } from "@codemirror/lang-json"

const loaderService = new LoaderService()

/** 用HTMLHint实现htmlLinter */
export const htmlLinter = linter(
  (view) => {
    const code = view.state.doc.toString()
    if (!code) { return [] }
    const results = HTMLHint.verify(code, htmlLintRuleConfig)
    return results.map((result) => {
      const from = view.state.doc.line(result.line).from
      const to = from + result.evidence.length
      return {
        from, to,
        severity: result.type,
        message: result.message,
      }
    })
  },
)

/**
 * 用styleLint实现的styleLinter
 * PS: stylelint本身无法支持浏览器，只支持node，问题可见
 * https://github.com/stylelint/stylelint/issues/3935
 * 解决办法是使用适用于浏览器的bundle文件，在html文件中引入
 * https://github.com/openstyles/stylelint-bundle
 */
const styleLinter = (config: any) => {
  return linter(
    async (view) => {
      const code = view.state.doc.toString()
      if (!code) { return [] }
      if (!window.stylelint) {
        const url = `${import.meta.env.BASE_URL}src/assets/js/stylelint-bundle.min.cjs`
        await loaderService.loadScript(url)
      }
      const { results } = await window.stylelint.lint({ code, config })
      const codemirrorBase = new CodemirrorBase(view)
      return results.map((result: any) => {
        return result.warnings.map((warning: any) => {
          const { column, endColumn = column, line, endLine = line } = warning
          // stylelint的列是从1开始算起，而codemirror是从0开始，因此需要减1
          const from = codemirrorBase.transPos2Offset({ line, col: column - 1 })
          const to = codemirrorBase.transPos2Offset({ line: endLine, col: endColumn - 1 })
          return {
            from, to,
            severity: warning.severity,
            message: warning.text,
          }
        })
      }).flat()
    },
  )
}

export const cssLinter = styleLinter({ extends: ["stylelint-config-standard"] })

export const scssLinter = styleLinter({ extends: ["stylelint-config-standard-scss"] })

export const lessLinter = styleLinter({ extends: ["stylelint-config-recommended-less"] })

export const stylusLinter = styleLinter(stylusLintRecommendConfig)

// TODO: 将eslint4b-prebuilt替换成jslint https://www.npmjs.com/package/jslint
export const javascriptLinter = linter(esLint(new Linter()))

export const typescriptLinter = linter(() => tsLinter() as Diagnostic[])

export const jsonLinter = linter(jsonParseLinter())