/** 侧边栏宽度 */
import { IModulesSize } from "@store/layout"
import {
  CONSOLE_MIN_HEIGHT,
  EDITOR_MIN_WIDTH,
  PREVIEW_MIN_HEIGHT,
  RESULT_MIN_WIDTH,
} from "@utils/services/module-size-service"

/**
 * 获取各模块宽度
 * 当可见窗口宽度改变时，更改编辑窗口和结果(预览和console)窗口的宽度
 * 如果任意一个窗口宽度达到了最小值，只改变另一个窗口的宽度
 * changedWidth < 0 表示宽度变小，> 0 则为宽度变大
 */
export const getModulesWidth = (
  changedWidth: number,
  modulesSize: IModulesSize,
  isShowResult: boolean,
): Partial<IModulesSize> => {
  const { editorWidth, resultWidth } = modulesSize
  const isWindowWidthDecreased = changedWidth < 0

  // 均分改变的宽度（为避免出现小数点，使用floor）
  const editorChangeWidth = isShowResult ? Math.floor(changedWidth / 2) : changedWidth
  const resultChangeWidth = changedWidth - Math.floor(changedWidth / 2)
  // 处理宽度变小的情况
  if (isWindowWidthDecreased) {
    const changedEditorWidth = editorWidth + editorChangeWidth
    const changedResultWidth = resultWidth + resultChangeWidth
    // 如果改变后的宽度小于最小值，就把多余宽度分到另一边
    if (changedEditorWidth < EDITOR_MIN_WIDTH) {
      return {
        editorWidth: EDITOR_MIN_WIDTH,
        resultWidth: resultWidth + resultChangeWidth - (EDITOR_MIN_WIDTH - (changedEditorWidth)),
      }
    } else if (changedResultWidth < RESULT_MIN_WIDTH) {
      return {
        editorWidth: editorWidth + editorChangeWidth - (RESULT_MIN_WIDTH - (changedResultWidth)),
        resultWidth: RESULT_MIN_WIDTH,
      }
    }
  }
  return {
    editorWidth: editorWidth + editorChangeWidth,
    resultWidth: resultWidth + resultChangeWidth,
  }
}

/**
 * 获取各模块高度
 * 当可见窗口高度改变时，更改预览和console窗口的高度
 * 如果任意一个窗口高度达到了最小值，只改变另一个窗口的高度
 * changedHeight < 0 表示高度变小，> 0 则为高度变大
 */
export const getModulesHeight = (
  changedHeight: number,
  modulesSize: IModulesSize,
  isFoldConsole: boolean,
): Partial<IModulesSize> => {
  const { previewHeight, consoleHeight, editorHeight } = modulesSize
  const isWindowHeightDecreased = changedHeight < 0
  // 均分改变的宽度为避免出现小数点，使用floor
  const consoleChangeHeight = isFoldConsole ? 0 : Math.floor(changedHeight / 2)
  const previewChangeWidth = changedHeight - consoleChangeHeight
  // 处理宽度变小的情况
  if (isWindowHeightDecreased) {
    const changedConsoleHeight = consoleHeight + consoleChangeHeight
    const changedPreviewHeight = previewHeight + previewChangeWidth
    // 如果改变后的宽度小于最小值，就把多余宽度分到另一边
    if (changedConsoleHeight < CONSOLE_MIN_HEIGHT) {
      return {
        consoleHeight: CONSOLE_MIN_HEIGHT,
        previewHeight: previewHeight + previewChangeWidth - (CONSOLE_MIN_HEIGHT - (changedConsoleHeight)),
        editorHeight: editorHeight + changedHeight,
      }
    } else if (changedPreviewHeight < PREVIEW_MIN_HEIGHT) {
      return {
        consoleHeight: consoleHeight + consoleChangeHeight - (PREVIEW_MIN_HEIGHT - (changedPreviewHeight)),
        previewHeight: PREVIEW_MIN_HEIGHT,
        editorHeight: editorHeight + changedHeight,
      }
    }
  }
  return {
    consoleHeight: consoleHeight + consoleChangeHeight,
    previewHeight: previewHeight + previewChangeWidth,
    editorHeight: editorHeight + changedHeight,
  }
}
