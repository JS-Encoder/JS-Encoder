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
  {
    path: "/",
    component: Home,
  },
  {
    path: "/code",
    component: lazyLoad("instance/instance"),
    meta: { fullscreen: true },
  },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

router.beforeEach((to) => {
  // 设备问题（如分屏导致dpr不同）导致浏览器高度会出现小数点，但无法获取带有小数点的高度，因此只能强制为外部dom设置高度百分百
  if (to.meta.fullscreen) {
    document.querySelector("#app")?.classList.add("fill")
  } else {
    document.querySelector("#app")?.classList.remove("fill")
  }
})

export default router