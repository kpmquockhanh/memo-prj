import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

const initApp = async () => {
  const authStore = useAuthStore()
  
  try {
    await authStore.initAuth()
    console.log('Auth initialized successfully')
  } catch (error) {
    console.error('Failed to initialize auth:', error)
  }

  dayjs.extend(duration)
  dayjs.extend(relativeTime)
  
  return authStore.isAuth
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: defineAsyncComponent(() => import('../views/HomePage.vue'))
    },
    {
      path: '/chat',
      name: 'chat-list',
      component: defineAsyncComponent(() => import('../views/RoomList.vue')),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat/:room_id',
      name: 'chat',
      component: defineAsyncComponent(() => import('../views/ChatBoard.vue')),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/chat/edit/:room_id',
      name: 'chat:edit',
      component: defineAsyncComponent(() => import('../views/EditRoomPage.vue')),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/random',
      name: 'randomPage',
      component: defineAsyncComponent(() => import('../views/RandomPage.vue'))
    },
    {
      path: '/questions',
      name: 'questionPage',
      component: defineAsyncComponent(() => import('../views/QuestionPage.vue'))
    },
    {
      path: '/login',
      name: 'login',
      component: defineAsyncComponent(() => import('../views/LoginPage.vue'))
    },
    {
      path: '/register',
      name: 'register',
      component: defineAsyncComponent(() => import('../views/RegisterPage.vue'))
    },
    {
      path: '/settings',
      name: 'settings',
      component: defineAsyncComponent(() => import('../views/SettingsPage.vue')),
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/friends',
      name: 'friends',
      component: defineAsyncComponent(() => import('../views/FindFriendPage.vue'))
    },
    {
      path: '/ai-number',
      name: 'ai_number',
      component: defineAsyncComponent(() => import('../views/NumberPredictionPage.vue'))
    },
    {
      path: '/test',
      name: 'test',
      component: defineAsyncComponent(() => import('../views/TestPage.vue'))  
    },
    {
      path: '/error',
      component: defineAsyncComponent(() => import('../views/SomethingWrongPage.vue'))
    },
    {
      path: '/:pathMatch(.*)*',
      component: defineAsyncComponent(() => import('../views/NotFoundPage.vue'))
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
