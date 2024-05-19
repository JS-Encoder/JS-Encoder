import { onMounted, onUnmounted, ref, Ref } from "vue"

/** 点击元素区域外部的时候隐藏元素 */
const useClickOutside = (eleRef: Ref<HTMLElement | null>): Ref<boolean> => {
  const isClickOutside = ref<boolean>(false)

  const handler = (e: MouseEvent): void => {
    if (!eleRef.value) { return }
    isClickOutside.value = !eleRef.value.contains(e.target as HTMLElement)
  }

  onMounted(() => {
    document.addEventListener("click", handler)
  })

  onUnmounted(() => {
    document.removeEventListener("click", handler)
  })

  return isClickOutside
}

export default useClickOutside