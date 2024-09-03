import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { Permissison, ResponseUpdateUser, Role, UpdateUser, User } from '@/types/base'
import { useRequest } from '@/stores/http'
import get from 'lodash/get'

export const useUser = defineStore('user', () => {
  const user = ref<User>()

  const images = ref<{[key: string]: string}>()

  const http = useRequest()

  const fetchImages = async () => {
    const resp = await http.request('/user/image', 'GET', {})
    console.log(resp)
  }

  const fetchUser = async (opts?: {
    ignoreAuth?: boolean,
  }) => {
   const resp = await http.request('/user', 'GET', {}, opts)
    if (resp.error) {
      return
    }
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
    if (data.date) {
      formData.append('date', data.date)
    }
    return await http.request('/user', 'PUT', {
      body: formData
    })
  }

  const resetUser = () => {
    user.value = undefined
  }

  const permissions = computed(() => {
    const rolePermissions = (get(user.value, 'roles', []) || []).map((r: Role) => r.permissions).flat().map((p: Permissison) => p.name)
    const permissions = (get(user.value, 'permissions', []) || []).map((p: Permissison) => p.name)
    return [...rolePermissions, ...permissions]
  })

  const roles = computed(() => {
    return (get(user.value, 'roles', []) || []).map((r: Role) => r.name)
  })

  const can = computed(() => {
    return (name: string) => {
      if (roles.value.includes('SAdmin')) {
        return true
      }
      return permissions.value.includes(name)
    }
  })

  return {
    user,
    images,
    fetchUser,
    updateUser,
    resetUser,
    fetchImages,
    can,

    permissions,
    roles,
  }
})
