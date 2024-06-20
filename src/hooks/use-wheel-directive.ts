/** 滑动滚轮进行横向滚动 */
const useWheelDirective = (element: HTMLElement) => {
  element.addEventListener("wheel", (event: WheelEvent) => {
    if (element.clientWidth >= element.scrollWidth) { return }
    event.preventDefault()
    element.scrollLeft += event.deltaY
      ? event.deltaY
      : (event.detail && event.detail !== 0)
        ? event.detail
        : event.deltaY
  })
}

export default useWheelDirective