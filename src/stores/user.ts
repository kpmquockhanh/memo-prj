import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { ResponseUpdateUser, UpdateUser, User } from '@/types/base'
import { useRequest } from '@/stores/http'

export const useUser = defineStore('user', () => {
  const user = ref<User>()

  const images = ref<{[key: string]: string}>()

  const http = useRequest()

  const fetchImages = async () => {
    const resp = await http.request('/user/image', 'GET', {})
    console.log(resp)
  }

  const fetchUser = async () => {
   const resp = await http.request('/user', 'GET', {})
    user.value = resp.user
  }

  const updateUser = async (data: UpdateUser): Promise<ResponseUpdateUser> => {
    const formData = new FormData()
    if (data.image) {
      formData.append('image', data.image)
    }
    if (data.name) {
      formData.append('name', data.name)
    }
    if (data.language) {
      formData.append('language', data.language)
    }
    const resp = await http.request('/user', 'PUT', {
      body: formData
    })
    return resp
  }

  const resetUser = () => {
    user.value = undefined
  }
  return {
    user,
    images,
    fetchUser,
    updateUser,
    resetUser,
    fetchImages,
  }
})
