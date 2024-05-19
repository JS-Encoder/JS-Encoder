import type less from "less"
import type stylus from "stylus"
import type ts from "typescript"
import type coffee from "coffeescript"
import type babel from "@babel/standalone"
import type pug from "pug"

declare namespace GlobalType {
  interface lessJS extends less {}
  type stylusJS = typeof stylus
  type typescript = typeof ts
  type coffeescript = typeof coffee
  type babelStandalone = typeof babel
  type pugJS = typeof pug
}

export = GlobalType
export as namespace GlobalType