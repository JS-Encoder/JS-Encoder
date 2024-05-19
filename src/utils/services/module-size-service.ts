import SingleInstance from "@utils/decorators/single-instance"
import { ISize } from "@type/interface"
import { IModulesSize } from "@store/layout"

/** 侧边栏宽度 */
export const SIDEBAR_WIDTH = 49
/** navbar高度 */
export const NAV_BAR_HEIGHT = 49
/** 结果(预览和console)窗口最小宽度 */
export const RESULT_MIN_WIDTH = 50
/** 编辑窗口最小宽度 */
export const EDITOR_MIN_WIDTH = 150
/** console最小高度 */
export const CONSOLE_MIN_HEIGHT = 24
/** 预览窗口最小高度 */
export const PREVIEW_MIN_HEIGHT = 36
/** splitter的最小宽度 */
export const SPLITTER_MIN_WIDTH = 50
/** splitter的最小高度 */
export const SPLITTER_MIN_HEIGHT = 50

interface IModuleInfo extends Partial<ISize> {
  minWidth?: number
  minHeight?: number
}

/**
 * 处理模块尺寸
 */
@SingleInstance
export default class ModuleSizeService {
  constructor() {}

  /** 获取整个窗口高度 */
  public getWindowSize(): ISize {
    return { width: window.innerWidth, height: window.innerHeight }
  }

  public getResizeAreaSize(): ISize {
    const { width, height } = this.getWindowSize()
    return {
      width: width - SIDEBAR_WIDTH,
      height: height - NAV_BAR_HEIGHT,
    }
  }

  /**
   * 获取初始模块宽高
   * 编辑窗口高度占满，宽度与(预览窗口、console窗口)平分
   * 预览窗口和console窗口高度比为3:1
   */
  public getInitModulesSize(): IModulesSize {
    const { width, height } = this.getResizeAreaSize()
    const editorHeight = height
    const editorWidth = Math.floor(width / 2)
    const resultWidth = width - editorWidth
    const consoleHeight = Math.floor(height / 4)
    const previewHeight = height - consoleHeight
    return {
      editorWidth,
      editorHeight,
      previewHeight,
      consoleHeight,
      resultWidth,
    }
  }

  /**
   * 在拖动分割线时更改相邻两个模块的尺寸
   * 当一个模块的尺寸达到了最小尺寸的限制，就停止改变
   * 注意：module1表示相对位置为左或上的module，module2表示相对位置为右或下的module
   */
  public getNewModulesSize(
    module1: IModuleInfo,
    module2: IModuleInfo,
    isHorizontal: boolean,
    changeSize: number,
  ): Array<Partial<ISize>> {
    let finalChangeSize = changeSize
    // 根据分割方向判断要处理的key
    const sizeKey = isHorizontal ? "width" : "height"
    const minSizeKey = isHorizontal ? "minWidth" : "minHeight"
    // 如果对应的尺寸没有传，直接原样返回
    if (module1[sizeKey] === undefined || module2[sizeKey] === undefined) {
      return [module1, module2]
    }
    // 根据changeSize是否小于0判断拖动方向，小于0表示相对位置为右或下的module尺寸变小，反之则是相对位置为左或上的module尺寸变小
    // 如果任何一个module达到了最小的尺寸，就不再减小了
    if (changeSize < 0) {
      const module2RestSize = module2[sizeKey]! - (module2[minSizeKey] || 0)
      if (module2RestSize <= Math.abs(changeSize)) {
        finalChangeSize = -module2RestSize
      }
    } else {
      const module1RestSize = module1[sizeKey]! - (module1[minSizeKey] || 0)
      if (module1RestSize <= changeSize) {
        finalChangeSize = module1RestSize
      }
    }
    return [
      {
        width: module1.width,
        height: module1.height,
        [sizeKey]: module1[sizeKey]! - finalChangeSize,
      },
      {
        width: module2.width,
        height: module2.height,
        [sizeKey]: module2[sizeKey]! + finalChangeSize,
      },
    ]
  }

  /** 将尺寸分割成两半 */
  public getHalfModuleSize(module: ISize, isHorizontal: boolean): ISize[] {
    const sizeKey = isHorizontal ? "width" : "height"
    const halfSize = Math.floor(module[sizeKey]! / 2)
    return [
      { ...module, [sizeKey]: halfSize },
      { ...module, [sizeKey]: module[sizeKey]! - halfSize },
    ]
  }
}