export default class SyncScroll {
  constructor(editor, preview) {
    if (!SyncScroll.instance) {
      this.el = editor.el
      this.cm = editor.cm
      this.docEle = preview.docEle
      this.docBody = preview.docBody
      this.docWindow = preview.docWindow
      this.isInitScale = false
      this.init()
      SyncScroll.instance = this
    }
    this.initScale = false
    return SyncScroll.instance
  }
  init () {
    this.isInit = true
    this.getScale()
    this.initScroll()
    this.setMouseEnter()
    this.setScroll()
  }
  setMouseEnter () {
    let { docBody, el } = this
    el.onmouseenter = () => {
      this.isPreviewScroll = false
      this.isEditorScroll = true
    }
    docBody.onmouseenter = () => {
      this.isPreviewScroll = true
      this.isEditorScroll = false
    }
  }
  getScale () {
    const info = this.getScrollInfo()
    this.scale = this.docBody.scrollHeight / info.height
  }
  initScroll () {
    const { scale, docEle, cm } = this
    const top = this.getScrollInfo().top
    docEle.scrollTop = top * scale
    cm.scrollTo(null, docEle.scrollTop / scale)
  }
  setScroll () {
    let { docEle, docWindow, cm, scale } = this
    cm.on('scroll', () => {
      if (this.isEditorScroll) {
        if (!this.isInitScale) {
          this.getScale()
          scale = this.scale
        }
        const top = this.getScrollInfo().top
        docEle.scrollTop = top * scale
      }
    })
    docWindow.onscroll = () => {
      if (this.isPreviewScroll) {
        if (!this.isInitScale) {
          this.getScale()
          scale = this.scale
        }
        cm.scrollTo(null, docEle.scrollTop / scale)
      }
    }
  }
  initScale () {
    this.getScale()
    this.initScale = true
    return this.scale
  }
  getScrollInfo () {
    return this.cm.getScrollInfo()
  }
  clearScroll () {
    if (this.isInit) {
      let { docBody, el, docWindow, cm } = this
      this.isPreviewScroll = false
      this.isEditorScroll = false
      el.onmouseenter = null
      docBody.onmouseenter = null
      cm.off('scroll')
      docWindow.onscroll = null
      this.isInit = false
    }
  }
}