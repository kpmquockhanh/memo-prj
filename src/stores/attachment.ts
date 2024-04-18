import { computed, ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { Attachment } from '@/types/base'
import { useRequest } from '@/stores/http'
import { useToast } from 'vue-toastification'

export const useAttachment = defineStore('attachment', () => {
  const items: Ref<Array<Attachment>> = ref([])
  const request = useRequest()
  const toast = useToast()
  const page = ref(1)
  const limit = ref(10)
  const doFetch = async (options?: {
    page?: number,
    limit?: number,
  }) => {
    const resp = await request.request('/v1/attachments', 'GET', {
      params: { limit: limit.value, ...options }
    })
    if (!options?.page || options?.page === 1) {
      items.value = resp.attachments || []
    } else {
      items.value = [...items.value, ...(resp.attachments || [])]
    }
  }

  const isLastPage = computed(() => {
    return items.value.length < page.value * limit.value
  })

  const nextPage = async () => {
    page.value += 1
    await doFetch({ page: page.value })
  }

  const doUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('name', file.name)
    const resp = await request.request('/v1/attachments', 'POST', {
      body: formData
    })
    console.log('done upload', file.name)
    if (resp.error) {
      toast.error('Upload failed')
      return
    }
    if (resp.attachment) {
      items.value = [...[resp.attachment], ...items.value]
    }
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
  return { items, page, doFetch, getSrc, doUpload, doRemove, nextPage, isLastPage }
})
