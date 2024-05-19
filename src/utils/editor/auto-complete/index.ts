import { scopeCompletionSource } from "@codemirror/lang-javascript"
import { tsComplete } from "../lsp/typescript"
import { autocompletion } from "@codemirror/autocomplete"

export const javascriptAutocomplete = () => {
  return autocompletion({ override: [tsComplete] })
}

export const typescriptAutocomplete = () => {
  return autocompletion({ override: [tsComplete] })
}