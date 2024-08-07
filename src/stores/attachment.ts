import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Attachment } from '@/types/base'
import { useRequest } from '@/stores/http'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'

export const useAttachment = defineStore('attachment', () => {
  const items: Ref<Array<Attachment>> = ref([])
  const request = useRequest()
  const toast = useToast()
  const page = ref(1)
  const limit = ref(10)
  const authStore = useAuthStore()

  const isLoading = ref(false)

  const total = ref(0)
  const doFetch = async (options?: {
    page?: number,
    limit?: number,
    ignoreLoad?: boolean
  }) => {
    if (!authStore.isAuth) {
      return
    }
    if (!options?.ignoreLoad) {
      isLoading.value = true
    }
    const resp = await request.request('/v1/attachments', 'GET', {
      params: { limit: limit.value, page: options?.page || page.value }
    })
    if (!options?.page || options?.page === 1) {
      items.value = resp.attachments || []
    } else {
      items.value = [...items.value, ...(resp.attachments || [])]
    }
    isLoading.value = false
    total.value = resp.total
  }

  const isLastPage = computed(() => {
    return items.value.length === total.value
  })

  const nextPage = async () => {
    page.value += 1
    await doFetch({ page: page.value, ignoreLoad: true })
  }

  const doUpload = async (file: File, description?: string) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('name', file.name)
    if (description) {
      formData.append('description', description)
    }
    const resp = await request.request('/v1/attachments', 'POST', {
      body: formData
    })
    if (resp.error) {
      toast.error(resp.message || 'Upload failed')
      return false
    }
    if (resp.attachment) {
      items.value = [...[resp.attachment], ...items.value]
    }
    return true
  }

  const doRemove = async (id: string) => {
    const resp = await request.request(`/v1/attachments/${id}`, 'DELETE', {})
    if (resp.error) {
      toast.error('Delete failed')
      return
    }
    items.value = items.value.filter((item) => item._id !== id)
  }

  const getSrc = (attachment: Attachment) => {
    return `${import.meta.env.VITE_API_DOMAIN}${attachment.src}`
  }

  const reset = () => {
    items.value = []
    page.value = 1
  }

  return { items, page, doFetch, getSrc, doUpload, doRemove, nextPage, isLastPage, isLoading, reset }
})
