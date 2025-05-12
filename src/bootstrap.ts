import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

export const initApp = async () => {
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
