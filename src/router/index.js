import Vue from 'vue'
import Router from 'vue-router'
import editor from '@/components/editor.vue'
import profile from '@/components/profile.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: 'editor',
      component: editor,
      children: [
        {
          path: 'editor',
          component: editor
        },
        {
          path: 'profile',
          component: profile
        }
      ]
    }
  ],
  mode: 'hash'
})
