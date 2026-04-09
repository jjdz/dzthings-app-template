import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('../components/AppShell.vue'),
      children: [
        { path: '', redirect: '/items' },
        { path: 'items', component: () => import('../views/ItemsView.vue') },
      ],
    },
  ],
})

let initialized = false
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!initialized) {
    await auth.checkAuth()
    initialized = true
  }
  if (!to.meta.public && !auth.user) return '/login'
  if (to.path === '/login' && auth.user) return '/'
})

export default router
