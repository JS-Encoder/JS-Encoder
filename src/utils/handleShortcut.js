/**
 * 配置窗口切换的快捷键
 */
import shortcut from './shortcut'
import store from '../vuex/store'

export default class HandleShortcut {
  constructor() {
    if (!HandleShortcut.instance) {
      /**
       * 快捷键方案
       * CTRL + 1 HTML窗口
       * CTRL + 2 CSS窗口
       * CTRL + 3 JS窗口
       */
      this.shortcutList = {
        switchHTML: 'Ctrl+1',
        switchCSS: 'Ctrl+2',
        switchJS: 'Ctrl+3'
      }
      this.preprocess = store.state.preprocess
      this.commit = store.commit
      this.install = false
      HandleShortcut.instance = this
    }
    return HandleShortcut.instance
  }
  /**
   * 快捷键添加
   */
  init () {
    const shortcutList = this.shortcutList
    const keys = Object.keys(shortcutList)
    keys.forEach(item => {
      shortcut.add(shortcutList[item], this[item], this)
    })
  }
  /**
   * 快捷键移除
   */
  clear () {
    const shortcutList = this.shortcutList
    for(let item in shortcutList){
      shortcut.remove(shortcutList[item])
    }
  }
  isInit(){
    return this.install
  }
  switchHTML () {
    this.commit('updateCurrentTab', this.preprocess[0])
  }
  switchCSS () {
    this.commit('updateCurrentTab', this.preprocess[1])
  }
  switchJS () {
    this.commit('updateCurrentTab', this.preprocess[2])
  }
}


