import { defineStore } from "pinia"

export interface IConsoleSetting {
  /** 每次执行代码前是否自动清空日志 */
  autoClear: boolean
  /** 控制台日志是否进行高亮 */
  highlightLog: boolean
}

export interface IConsoleStore {
  /** 控制台设置 */
  settings: IConsoleSetting
}

export const initSettings = {
  autoClear: true,
  highlightLog: true,
}

export const useConsoleStore = defineStore("console", {
  state: (): IConsoleStore => {
    return {
      settings: { ...initSettings },
    }
  },
  actions: {
    updateSetting(newSetting: IConsoleSetting): void {
      this.$patch({ settings: { ...newSetting } })
    },
  },
})