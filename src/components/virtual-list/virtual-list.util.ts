export interface IVirtualListConfig {
  /** 列表选择器 */
  listArea: HTMLElement | null
  listItemSelector: string
  rootMargin: string
  threshold: number
  cb: () => void
}

export const V_PROP_NAME = "$v"
export const V_LIST_ITEM_INDEX_PROP_NAME = "data-virtual-list-item-index"

export interface IVirtualListItemState {
  state: number
  height: string
}

export interface IBaseVirtualListItemData {
  [V_PROP_NAME]?: IVirtualListItemState
}

export interface IToBeUpdateListItem extends IBaseVirtualListItemData {
  index: number
}

export type ToBeUpdateItemMapType = {
  [x in string]: IVirtualListItemState
}

export class VirtualList {
  private toBeUpdateItemMap: ToBeUpdateItemMapType = {}
  private listAreaIntersectionObserver?: IntersectionObserver
  private readonly virtualListConfig!: IVirtualListConfig
  private updateListItemTimer: NodeJS.Timeout | null = null

  constructor(options: IVirtualListConfig) {
    this.virtualListConfig = options
    this.init()
  }

  public disconnect(): void {
    this.listAreaIntersectionObserver?.disconnect()
  }

  public startObserve(): void {
    const { listItemSelector, listArea } = this.virtualListConfig
    const listItemList = listArea?.querySelectorAll(listItemSelector) || []
    listItemList.forEach((listItem) => {
      this.listAreaIntersectionObserver!.observe(listItem)
    })
  }

  public getToBeUpdateItemMap(): ToBeUpdateItemMapType {
    return this.toBeUpdateItemMap
  }

  private init(): void {
    const { listArea, rootMargin, threshold } = this.virtualListConfig
    this.listAreaIntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((row) => {
        const { intersectionRatio } = row
        const target = row.target as HTMLElement
        const index = target.getAttribute(V_LIST_ITEM_INDEX_PROP_NAME)
        const targetHeight = `${target.clientHeight}px`
        const state = Number(intersectionRatio > 0)
        this.toBeUpdateItemMap[index!] = {
          state, height: targetHeight,
        }
      })
      this.diffVirtualHeightAndInvokeUpdate()
    }, { root: listArea, rootMargin, threshold })
    this.startObserve()
  }

  private diffVirtualHeightAndInvokeUpdate(): void {
    const { cb } = this.virtualListConfig
    if (!this.updateListItemTimer) {
      cb()
      this.updateListItemTimer = setTimeout(() => {
        cb()
        this.updateListItemTimer = null
      }, 200)
    }
  }
}