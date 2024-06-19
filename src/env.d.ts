/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue"
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module "eslint4b-prebuilt/dist/eslint4b.es"

declare class Sass {
  [x: string]: any
  compile: (input: string, cb: (result: string) => void) => void
}

declare interface Window {
  stylelint: any
  less: GlobalType.lessJS
  stylus: GlobalType.stylusJS
  ts: GlobalType.typescript
  CoffeeScript: GlobalType.coffeescript
  Babel: GlobalType.babelStandalone
  jade: GlobalType.pugJS
  hljs: GlobalType.hljs
}

/**
 * vite define
 */

/** app版本 */
declare const APP_VERSION: string