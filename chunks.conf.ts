const mainChunk = [
  "vue", "vue-router",
]

/** codemirror 相关分包 */
const codemirrorChunk = [
  "codemirror", "@codemirror/autocomplete", "@codemirror/commands", "@codemirror/language",
  "@codemirror/legacy-modes/mode/coffeescript", "@codemirror/legacy-modes/mode/stylus",
  "@codemirror/lint", "@codemirror/search", "@codemirror/state", "@lezer/highlight",
  "@codemirror/view", "@codemirror/lang-css", "@codemirror/lang-html", "@codemirror/lang-javascript",
  "@codemirror/lang-less", "@codemirror/lang-markdown", "@codemirror/lang-sass", "@codemirror/lang-vue",
  "@emmetio/codemirror6-plugin", "@replit/codemirror-indentation-markers", "@replit/codemirror-vscode-keymap",
]

/** 代码编译相关分包 */
const compileChunk = [
  "@vue/compiler-sfc", "espree", "estraverse", "marked", "marked-highlight",
]

/** 其他插件相关分包 */
const pluginChunk = [
  "eslint4b-prebuilt", "@typescript/vfs", "hash-sum", "htmlhint", "stylelint",
  "stylelint-config-recommended-less", "stylelint-config-standard", "stylelint-config-standard-scss",
  "jszip", "stylelint-config-standard-vue", "fflate",
]

const prettierChunk = [
  "prettier",
]

export default {
  mainChunk,
  codemirrorChunk,
  compileChunk,
  pluginChunk,
  prettierChunk,
}