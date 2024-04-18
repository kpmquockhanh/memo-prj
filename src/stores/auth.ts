import { computed, type Ref, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthRequest, AuthResponse, User } from '@/types/base'
import dayjs from 'dayjs'
import { useUser } from '@/stores/user'

export const useAuthStore = defineStore('auth', () => {
  const isAuth = ref(false)
  const token = ref('')
  const lastPath = ref('')

  const userStore = useUser()

  const processToken = (resJson: AuthResponse) => {
    isAuth.value = true
    const resToken = resJson.accessToken
    token.value = resToken

    localStorage.setItem('token', resToken)
    userStore.fetchUser()
    return true
  }

  async function login(r: AuthRequest) {
    const domain = import.meta.env.VITE_API_DOMAIN
    const response = await fetch(`${domain}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: r.email,
        password: r.password
      })
    })

    const resJson: AuthResponse = await response.json()

    if (resJson.accessToken) {
      processToken(resJson)
      return true
    }
    return false
  }

  const register = async (r: AuthRequest) => {
    const domain = import.meta.env.VITE_API_DOMAIN
    const response = await fetch(`${domain}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: r.name,
        email: r.email,
        password: r.password,
        language: "en",
        platform: "IOS",
        timezone: dayjs().utcOffset()/60,
        deviceId: "1234"
      })
    })

    const resJson: AuthResponse = await response.json()
    if (resJson.accessToken) {
      processToken(resJson)
      return true
    }
    return false
  }

  const localToken = computed(() => localStorage.getItem('token'))

  const setLastPath = (path: string) => {
    lastPath.value = path
  }

  const initAuth = async () => {
    isAuth.value = false
    lastPath.value = ''
    token.value = ''
    userStore.resetUser()
    // Get auth token from local storage

    // else set isAuth to false
    if (localToken.value) {
      // if token is valid, set isAuth to true
      isAuth.value = true
      token.value = localToken.value
      await userStore.fetchUser({
        ignoreAuth: true,
      })
    }
  }

  const logout = () => {
    isAuth.value = false
    token.value = ''
    userStore.resetUser()
    localStorage.removeItem('token')
  }

  const isAdmin = computed(() => userStore.user?.type === 'admin')

  return {
    //Properties
    isAuth,
    lastPath,
    token,
    isAdmin,
    //Methods
    setLastPath,
    initAuth,
    logout,
    login,
    register
  }
})
