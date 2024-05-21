import { Prec, StateEffect, StateField, Transaction } from "@codemirror/state"
import GoToLineComponent from "@views/components/plugins/go-to-line/go-to-line.vue"
import { VNode, createVNode, render } from "vue"
import { KeyBinding, Panel, keymap, showPanel, EditorView } from "@codemirror/view"

let goToLineWrapperNode: HTMLDivElement
let goToLineVNode: VNode<any>

export const createGoToLinePanel = (view: EditorView): Panel => {
  if (!goToLineWrapperNode) {
    goToLineVNode = createVNode(GoToLineComponent, { view })
    goToLineWrapperNode = document.createElement("div")
    render(goToLineVNode, goToLineWrapperNode)
  }
  return {
    top: false,
    dom: goToLineWrapperNode,
    mount: () => {
      goToLineVNode.component?.exposed?.onMounted()
    },
    destroy: () => {
      goToLineVNode.component?.exposed?.onDestroy()
    },
  }
}

const toggleGoToLine = StateEffect.define<boolean>()

export const goToLineState = StateField.define<boolean>({
  create: () => false,
  update(value: boolean, tr: Transaction) {
    for (const effect of tr.effects) {
      if (effect.is(toggleGoToLine)) {
        value = effect.value
      }
    }
    return value
  },
  provide: (f) => {
    return showPanel.from(f, (on) => on ? createGoToLinePanel : null)
  },
})

export const toggleGoToLinePanel = (view: EditorView) => {
  view.dispatch({
    effects: toggleGoToLine.of(!view.state.field(goToLineState)),
  })
}

export const goToLineKeymap: readonly KeyBinding[] = [
  {
    key: "Ctrl-g",
    preventDefault: true,
    run: (view) => {
      toggleGoToLinePanel(view)
      return true
    },
  },
]

export const getGoToLinePanel = () => {
  return [
    goToLineState,
    Prec.highest(keymap.of(goToLineKeymap)),
  ]
}