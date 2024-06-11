import { onMounted, onUnmounted } from "vue"

const useBeforeUnload = (): void => {
  const handler = (event: BeforeUnloadEvent) => {
    event.preventDefault()
  }

  onMounted(() => {
    window.addEventListener("beforeunload", handler)
  })

  onUnmounted(() => {
    window.removeEventListener("beforeunload", handler)
  })
}

export default useBeforeUnload