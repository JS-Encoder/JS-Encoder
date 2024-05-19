import { VNode, createVNode, render } from "vue"
import Editor from "@views/components/editor/editor.vue"
import SingleInstance from "@utils/decorators/single-instance"
import { AnyObject } from "@type/interface"
import { IEditorViewExpose } from "@views/components/editor/editor"

export interface IEditorInstance {
  vnode: VNode<any>
  wrapper: HTMLDivElement
}

@SingleInstance
export default class EditorKeeperService {
  private editorInstanceMap: Record<number, IEditorInstance> = {}

  constructor() {}

  public getEditorView(tabId: number) {
    return this.getEditorExposed(tabId).getEditorView()
  }

  public getEditorExposed(tabId: number): IEditorViewExpose {
    const vnode = this.editorInstanceMap[tabId].vnode
    return vnode.component?.exposed as IEditorViewExpose
  }

  public getEditorInstance(tabId: number, props: AnyObject = {}): IEditorInstance {
    const cacheEditorInstance = this.editorInstanceMap[tabId]
    if (cacheEditorInstance) {
      const { vnode, wrapper } = cacheEditorInstance
      vnode.component?.exposed?.restoreViewScroll(true)
      return { vnode, wrapper }
    } else {
      const { vnode, wrapper } = this.render(props)
      this.editorInstanceMap[tabId] = { vnode, wrapper }
      return { vnode, wrapper }
    }
  }

  public render(props: AnyObject): IEditorInstance {
    const editorVNode = createVNode(Editor, props)
    const editorWrapperNode = document.createElement("div")
    editorWrapperNode.classList.add("fill", "over-hidden")
    render(editorVNode, editorWrapperNode)
    return {
      vnode: editorVNode,
      wrapper: editorWrapperNode,
    }
  }

  public rerender(tabId: number, props: AnyObject) {
    const editorVNode = createVNode(Editor, props)
    this.editorInstanceMap[tabId].vnode = editorVNode
    render(editorVNode, this.editorInstanceMap[tabId].wrapper)
  }

  public clearEditorInstanceMap() {
    this.editorInstanceMap = {}
  }
}