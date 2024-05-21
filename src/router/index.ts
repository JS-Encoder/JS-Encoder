import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/home/home.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/code", component: () => import("@/views/instance/instance.vue") },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router