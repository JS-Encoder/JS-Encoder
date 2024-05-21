import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/home/home.vue"
import { useCommonStore } from "@store/common"

const modules = import.meta.glob("@/views/**/*.vue")
const lazyLoad = (componentPath: string) => {
  const DELAY = 300
  return () => new Promise((resolve, reject) => {
    const { updatePageLoading } = useCommonStore()
    const timer = setTimeout(() => {
      updatePageLoading(true)
    }, DELAY)
    modules[`/src/views/${componentPath}.vue`]().then((component) => {
      clearTimeout(timer)
      updatePageLoading(false)
      resolve(component)
    })
  })
}

const routes = [
  { path: "/", component: Home },
  { path: "/code", component: lazyLoad("instance/instance") },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router