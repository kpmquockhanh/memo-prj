import { useAuthStore } from '@/stores/auth'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

export const initApp = async () => {
  const authStore = useAuthStore()

  authStore.initAuth().then()

  dayjs.extend(duration);
  dayjs.extend(relativeTime);
}
