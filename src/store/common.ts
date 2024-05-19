import { defineStore } from "pinia"
import { ModalName, Theme } from "@type/interface"

interface ICommonStore {
  /** 显示的modal名称 */
  displayModal: ModalName | null,
  theme: Theme,
}

export const useCommonStore = defineStore("common", {
  state: (): ICommonStore => {
    return {
      displayModal: null,
      theme: Theme.DARK,
    }
  },
  actions: {
    updateDisplayModal(name: ModalName | null): void {
      this.displayModal = name
    },
    updateTheme(theme: Theme): void {
      this.theme = theme
    },
  },
})