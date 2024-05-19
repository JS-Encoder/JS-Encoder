import SingleInstance from "@utils/decorators/single-instance"

/**
 * 工具服务类
 */
@SingleInstance
export default class UtilService {
  constructor() {}

  /** 调换数组中指定两个元素的位置 */
  public swapArrayItem(arr: any[], index1: number, index2: number): void {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0]
  }

  /** 将数字分成两半并且不要小数点 */
  public splitNumberWithoutDot(num: number): number[] {
    const halfOfNum = Math.floor(num / 2)
    return [halfOfNum, num - halfOfNum]
  }

  /** 删除第一个数组中匹配的元素 */
  public deleteFirstMatchArrayItem<T>(arr: T[], deleteItem: T): T[] {
    const copyArr = [...arr]
    copyArr.splice(arr.findIndex((item) => deleteItem === item), 1)
    return copyArr
  }

  /** 移动数组的某个元素位置 */
  public moveArrayItem<T>(arr: T[], oldIndex: number, newIndex: number): T[] {
    const copyArr = [...arr]
    copyArr.splice(newIndex, 0, copyArr.splice(oldIndex, 1)[0])
    return copyArr
  }

  /** 移动一个数组某个位置的元素到另外一个数组的某个位置 */
  public moveArrItemToOtherArr<T>(params: {
    fromArr: T[],
    toArr: T[],
    fromIndex: number,
    toIndex?: number,
  }): [T[], T[]] {
    const { fromArr, toArr, fromIndex, toIndex } = params
    // copy一波
    const copyFromArr = [...fromArr]
    const copyToArr = [...toArr]
    // 如果没有toIndex就直接放在最后面
    copyToArr.splice(
      toIndex || copyToArr.length,
      0,
      copyFromArr.splice(fromIndex, 1)[0],
    )
    return [copyFromArr, copyToArr]
  }
}