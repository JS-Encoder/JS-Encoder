import SingleInstance from "@utils/decorators/single-instance"

/**
 * 拖拽排序服务
 */
@SingleInstance
export default class DragSortableService {
  /** 当前正在拖拽的组名 */
  private draggingGroup: string = ""

  constructor() {}

  public setDraggingGroup(group: string) {
    this.draggingGroup = group
  }

  /** 判断拖拽的元素所在组与 */
  public judgeSameGroup(element: HTMLElement): boolean {
    const draggableElement = this.getDraggableElement(element)
    return draggableElement.dataset.group === this.draggingGroup
  }

  private getDraggableElement(element: HTMLElement) {
    let currElement = element
    while(!currElement.dataset.dragSortable) {
      if (!currElement.parentElement) { break }
      currElement = currElement.parentElement!
    }
    return currElement
  }
}