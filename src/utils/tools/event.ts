export const listenMousemove = (options: {
  onMoving?: (event: MouseEvent) => void
  onUp?: (event: MouseEvent) => void
}) => {
  const { onMoving = () => {}, onUp = () => {} } = options

  const handleMousemove = (event: MouseEvent) => {
    onMoving(event)
  }
  window.addEventListener("mousemove", handleMousemove, { passive: true })

  const handleMouseup = (event: MouseEvent) => {
    onUp(event)
    window.removeEventListener("mousemove", handleMousemove)
    window.removeEventListener("mouseup", handleMouseup)
  }
  window.addEventListener("mouseup", handleMouseup, { passive: true, once: true })
}