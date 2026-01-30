import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/Auth.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/create-workflow',
      name: 'create-workflow',
      component: () => import('@/views/CreateFlow.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/workflow/:workflowId',
      name: 'workflow-detail',
      component: () => import('@/views/WorkflowDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/workflow/:workflowId/executions',
      name: 'workflow-executions',
      component: () => import('@/views/WorkflowExecutions.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'auth', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
