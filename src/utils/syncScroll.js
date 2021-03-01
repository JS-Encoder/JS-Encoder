/**
 * markdown的编辑窗口与预览窗口同步滚动功能
 */
import Loader from './loader'
const loader = new Loader()

export default class SyncScroll {
  /**
   * 初始化同步滚动类SyncScroll(单例)
   * @param {object} cm 当前CodeMirror实例
   * @param {iframeElement} preview 当前预览窗口
   */
  constructor(cm, preview) {
    if (!SyncScroll.instance) {
      this.cm = cm
      this.preWindow = preview.contentWindow
      this.matchTagsStr = 'p, h1, h2, h3, h4, h5, h6, li, pre, blockquote, hr, table, code>span'
      this.topEle = null
      this.init()
      SyncScroll.instance = this
    }
    return SyncScroll.instance
  }
  init() {
    this.setScroll()
    this.isInit = true
  }
  /**
   * 监听编辑窗口滚动事件
   */
  setScroll() {
    const cm = this.cm
    cm.on('scroll', () => {
      const length = this.getCMMatchEleLen()
      this.setPreviewScrollPos(length)
    })
    // const preWindow = this.preWindow
    // preWindow.onscroll = () => {
    //   const scrollPos = this.getPreviewScrollPosY()
    //   console.log(`pos:${scrollPos}`)
    //   const length = this.getViewMatchEleLen()
    //   this.setCMScrollPos(length)
    // }
  }
  /**
   * 获取markdown编辑器当前可见窗口最顶行行号
   * 获取该行之前所有markdown代码所生成的匹配元素列，并返回长度
   * @returns {number} 匹配元素列长度
   */
  getCMMatchEleLen() {
    const cm = this.cm
    const scrollInfo = cm.getScrollInfo()
    const lineNumber = cm.lineAtHeight(scrollInfo.top, 'local')
    const range = cm.getRange({ line: 0, ch: null }, { line: lineNumber, ch: null })
    const marked = this.getMarked()
    const doc = new DOMParser().parseFromString(marked(range), 'text/html')
    const matchEleList = doc.body.querySelectorAll(this.matchTagsStr)
    return matchEleList.length
  }
  // /**
  //  *
  //  * @returns {number} 匹配元素列长度
  //  */
  // getPreviewMatchEleLen() {}
  /**
   * 获取preview中的匹配标签
   * 将preview可见区域的顶部定位匹配元素列表中第length个元素
   * @param {number} length 匹配元素列长度
   */
  setPreviewScrollPos(length) {
    const preWindow = this.preWindow
    if (length) {
      const matchEleList = preWindow.document.body.querySelectorAll(this.matchTagsStr)
      if (length === 1) length--
      if (matchEleList.length) {
        const target = matchEleList[length]
        target.scrollIntoView()
      }
    } else {
      preWindow.scrollTo(0, 0)
    }
  }
  // /**
  //  * 获取预览页面滚动条位置
  //  * @returns {number} sy 预览页面滚动条纵坐标
  //  */
  // getPreviewScrollPosY() {
  //   const preWindow = this.preWindow
  //   const sy = preWindow.pageYOffset
  //   if (sy !== undefined) return sy
  //   const doc = preWindow.document
  //   return doc.documentElement.scrollTop || doc.body.scrollTop || 0
  // }
  /**
   * @returns {object} marked
   */
  getMarked() {
    let marked
    if (!loader.get('markdown')) {
      marked = require('marked')
      loader.set('markdown', marked)
    } else {
      marked = loader.get('markdown')
    }
    return marked
  }
  clearSyncScroll() {
    if (this.isInit) {
      const cm = this.cm
      cm.on('scroll', () => {})
      this.isInit = false
    }
  }
}
