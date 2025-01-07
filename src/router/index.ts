import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
      component: () => import('../views/SettingsPage.vue')
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

router.beforeEach((to, from, next) => {
  const { isAuth, setLastPath } = useAuthStore()
  let isBlock = false
  if (to.meta.requiresAuth) {
    if (!isAuth) {
      setLastPath(to.fullPath)
      next({ name: 'login' })
      isBlock = true
    }
  }

  if (to.name === 'login' && isAuth) {
    next({ name: 'home' })
    isBlock = true
  }

  if (!isBlock) {
    next()
  }
})

export default router
