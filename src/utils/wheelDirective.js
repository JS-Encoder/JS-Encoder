/**
 * 滑动滚轮进行横向滚动
 */
class WheelDirective {
  constructor(el) {
    this.el = el
    this.handleWheelEvent()
  }
  handleWheelEvent () {
    const event = window.addEventListener ? 'addEventListener' : 'attachEvent'
    let wheel = ''
    if ('onmousewheel' in this.el) {
      wheel = 'mousewheel'
    } else if ('onwheel' in this.el) {
      wheel = 'wheel'
    } else if ('attachEvent' in window) {
      wheel = 'onmousewheel'
    } else {
      wheel = 'DOMMouseScroll'
    }
    this.el[event](wheel, this.scroll)
  }
  scroll = (event) => {
    if (this.el.clientWidth >= this.el.scrollWidth) { return void 0 }
    event.preventDefault()
    this.el.scrollLeft += event.deltaY
      ? event.deltaY
      : (event.detail && event.detail !== 0)
        ? event.detail
        : -event.wheelDelta
  }
}
export default WheelDirective