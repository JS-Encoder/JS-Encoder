import { onMounted, onUnmounted, Ref, ref } from "vue"

export interface windowSize {
  clientWidth: Ref<number>
  clientHeight: Ref<number>
}

const useWindowResize = (): windowSize => {
  const clientWidth = ref<number>(0)
  const clientHeight = ref<number>(0)

  function onResize(): void {
    clientWidth.value = window.innerWidth
    clientHeight.value = window.innerHeight
  }

  onMounted(() => {
    window.addEventListener("resize", onResize)
    onResize()
  })

  onUnmounted(() => {
    window.removeEventListener("resize", onResize)
  })

  return { clientWidth, clientHeight }
}

export default useWindowResize