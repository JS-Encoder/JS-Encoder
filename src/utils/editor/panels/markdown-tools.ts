import { StateEffect, StateField, Transaction } from "@codemirror/state"
import { EditorView, KeyBinding, Panel, showPanel } from "@codemirror/view"
import MarkdownToolsComponent from "@views/components/plugins/markdown-tools/markdown-tools.vue"
import { VNode, createVNode, render } from "vue"
import { MarkdownTools } from "../utils/markdown-tools"

let markdownToolsWrapperNode: HTMLDivElement
let markdownToolsVNode: VNode<any>

export const createMarkdownToolsPanel = (view: EditorView): Panel => {
  if (!markdownToolsWrapperNode) {
    markdownToolsVNode = createVNode(MarkdownToolsComponent, { view })
    markdownToolsWrapperNode = document.createElement("div")
    render(markdownToolsVNode, markdownToolsWrapperNode)
  }
  return {
    top: true,
    dom: markdownToolsWrapperNode,
    mount: () => {},
    destroy: () => {},
  }
}

const toggleMarkdownTools = StateEffect.define<boolean>()

export const markdownToolsState = StateField.define<boolean>({
  create: () => false,
  update(value: boolean, tr: Transaction) {
    for (const effect of tr.effects) {
      if (effect.is(toggleMarkdownTools)) {
        value = effect.value
      }
    }
    return value
  },
  provide: (f) => {
    return showPanel.from(f, (on) => on ? createMarkdownToolsPanel : null)
  },
})

export const toggleMarkdownToolsPanel = (view: EditorView) => {
  view.dispatch({
    effects: toggleMarkdownTools.of(!view.state.field(markdownToolsState)),
  })
}

export const markdownKeymap: readonly KeyBinding[] = [
  {
    key: "Ctrl-b",
    run: (view) => {
      new MarkdownTools(view).changeTextStyle("**")
      return true
    },
  },
  {
    key: "Ctrl-i",
    run: (view) => {
      new MarkdownTools(view).changeTextStyle("*")
      return true
    },
  },
  {
    key: "Ctrl-d",
    run: (view) => {
      new MarkdownTools(view).changeTextStyle("~~")
      return true
    },
  },
  {
    key: "Ctrl-l",
    run: (view) => {
      new MarkdownTools(view).insertLink()
      return true
    },
  },
  {
    key: "Ctrl-p",
    run: (view) => {
      new MarkdownTools(view).insertLink(true)
      return true
    },
  },
  {
    key: "Ctrl-Shift-q",
    run: (view) => {
      new MarkdownTools(view).insertUnorderedList(">")
      return true
    },
  },
  {
    key: "Ctrl-j",
    run: (view) => {
      new MarkdownTools(view).changeTextStyle("`")
      return true
    },
  },
  {
    key: "Ctrl-u",
    run: (view) => {
      new MarkdownTools(view).insertUnorderedList("-")
      return true
    },
  },
  {
    key: "Ctrl-o",
    run: (view) => {
      new MarkdownTools(view).insertOrderList()
      return true
    },
  },
  {
    key: "Ctrl-h",
    run: (view) => {
      new MarkdownTools(view).insertLine()
      return true
    },
  },
]