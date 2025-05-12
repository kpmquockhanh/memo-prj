import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { initApp } from '@/bootstrap'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomePage.vue')
    },
    {
      path: '/chat',
      name: 'chat-list',
      component: () => import('../views/RoomList.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat/:room_id',
      name: 'chat',
      component: () => import('../views/ChatBoard.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat/edit/:room_id',
      name: 'chat:edit',
      component: () => import('../views/EditRoomPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/random',
      name: 'randomPage',
      component: () => import('../views/RandomPage.vue')
    },
    {
      path: '/questions',
      name: 'questionPage',
      component: () => import('../views/QuestionPage.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterPage.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingsPage.vue'),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('../views/FindFriendPage.vue')
    },
    {
      path: '/ai-number',
      name: 'ai_number',
      component: () => import('../views/NumberPredictionPage.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestPage.vue')
    },
    {
      path: '/error',
      component: () => import('../views/SomethingWrongPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('../views/NotFoundPage.vue')
    }
  ]
})

let isInitialized = false

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Ensure auth is initialized before proceeding
  if (!isInitialized) {
    try {
      await initApp()
      isInitialized = true
    } catch (error) {
      console.error('Failed to initialize app:', error)
      next({ name: 'error' })
      return
    }
  }

  let isBlock = false
  if (to.meta.requiresAuth) {
    if (!authStore.isAuth) {
      authStore.setLastPath(to.fullPath)
      next({ name: 'login' })
      isBlock = true
    }
  }

  if (to.name === 'login' && authStore.isAuth) {
    next({ name: 'home' })
    isBlock = true
  }

  if (!isBlock) {
    next()
  }
})

export default router
