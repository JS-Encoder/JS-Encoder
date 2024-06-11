import { onMounted, onUnmounted, Ref } from "vue"

/** 按下ESC关闭弹窗 */
const useEscClose = (canClose: Ref<boolean>, handler: () => void): void => {
  const onPressEsc = (e: KeyboardEvent): void => {
    if (!canClose.value || !(e.key === "Escape")) { return }
    handler()
  }

  onMounted(() => {
    window.addEventListener("keydown", onPressEsc)
  })

  onUnmounted(() => {
    document.removeEventListener("keydown", onPressEsc)
  })
}

export default useEscClose