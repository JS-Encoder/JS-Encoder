import { defineStore } from "pinia"
import { isUndefined } from "@utils/tools/judge"

export interface IModulesSize {
  /** 编辑器窗口宽度 */
  editorWidth: number
  /** 编辑器窗口宽度 */
  editorHeight: number
  /** console高度 */
  consoleHeight: number
  /** 预览高度 */
  previewHeight: number
  /** 结果(预览和console)窗口尺寸 */
  resultWidth: number
}

interface ILayoutStore {
  /** 各模块尺寸配置 */
  modulesSize: IModulesSize
  /** 是否展示结果界面（预览+console） */
  isShowResult: boolean
  /** 是否正在拖动改变模块宽高 */
  isModulesResizing: boolean
  /** 是否已经初始化了模块的尺寸 */
  hasInitModulesSize: boolean
  /** 是否收起console */
  isFoldConsole: boolean
}

export const useLayoutStore = defineStore("layout", {
  state: (): ILayoutStore => ({
    modulesSize: {
      editorWidth: 0,
      editorHeight: 0,
      consoleHeight: 0,
      previewHeight: 0,
      resultWidth: 0,
    },
    isShowResult: true,
    isFoldConsole: false,
    isModulesResizing: false,
    hasInitModulesSize: false,
  }),
  actions: {
    updateIsShowResult(newState?: boolean): void {
      this.isShowResult = isUndefined(newState) ? !this.isShowResult : newState!
    },
    updateModuleSize(newSizeConfig: Partial<IModulesSize>): void {
      Object.assign(this.modulesSize, newSizeConfig)
    },
    updateIsModulesResizing(newState: boolean): void {
      this.isModulesResizing = newState
    },
    updateHasInitModulesSize(): void {
      this.hasInitModulesSize = true
    },
    updateIsFoldConsole(newState?: boolean): void {
      this.isFoldConsole = isUndefined(newState) ? !this.isFoldConsole : newState!
    },
  },
})