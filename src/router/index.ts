import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/home/home.vue"
import Instance from "@/views/instance/instance.vue"

const routes = [
  { path: "/", component: Home },
  { path: "/code", component: Instance },
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

export default router