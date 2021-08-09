/**
 * Configure the shortcut keys to jump between the CodeMirror editing windows
 * 配置CodeMirror编辑窗口之间相互跳转的快捷键
 */

import shortcut from './shortcut'
import store from '../store/index'
import { isMac } from './tools'

export default class ShortcutHandler {
  constructor() {
    if (!ShortcutHandler.instance) {
      /**
       * 快捷键方案
       * CTRL/Cmd + 1 HTML窗口
       * CTRL/Cmd + 2 CSS窗口
       * CTRL/Cmd + 3 JS窗口
       */
      const runKey = isMac() ? 'Cmd' : 'Ctrl'
      this.shortcutList = {
        switchHTML: `${runKey}+1`,
        switchCSS: `${runKey}+2`,
        switchJS: `${runKey}+3`,
      }
      this.preprocessor = store.state.preprocessor
      this.commit = store.commit
      this.isInstalled = false
      ShortcutHandler.instance = this
    }
    return ShortcutHandler.instance
  }
  install() {
    const shortcutList = this.shortcutList
    const keys = Object.keys(shortcutList)
    keys.forEach((item) => {
      shortcut.add(shortcutList[item], this[item], this)
    })
  }
  remove() {
    const shortcutList = this.shortcutList
    for (let item in shortcutList) {
      shortcut.remove(shortcutList[item])
    }
  }
  getIsInstalled() {
    return this.isInstalled
  }
  switchHTML() {
    this.commit('handleCurrentTab', this.preprocessor[0])
  }
  switchCSS() {
    this.commit('handleCurrentTab', this.preprocessor[1])
  }
  switchJS() {
    this.commit('handleCurrentTab', this.preprocessor[2])
  }
}
