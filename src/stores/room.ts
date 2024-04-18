import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Room } from '@/types/base'
import { useRequest } from '@/stores/http'
import { useRouter } from 'vue-router'

export const useRoom = defineStore('room', () => {
  const items = ref<Array<Room>>([])
  const router = useRouter()
  const req = useRequest()
  const creating = ref(false)
  const fetchRooms = async () => {
    const res = await req.request('/v1/chat', 'GET', {})
    items.value = res.rooms
  }

  const createRoom = async (r: {name: string, description: string}) => {
    creating.value = true
    const resp = await req.request('/v1/chat', 'POST', {
      body: {
        name: r.name,
        description: r.description,
      }
    })
    creating.value = false
    if (resp.room) {
      items.value = [...items.value, resp.room]
    }
    return resp
  }

  const joinRoom = async (roomId: string) => {
    router.push({
      name: 'chat',
      params: {
        room_id: roomId
      }
    }).then()
  }

  const deleteRoom = async (roomId: string) => {
    const resp = await req.request(`/v1/chat/${roomId}`, 'DELETE', {})
    if (resp.error) {
      return
    }
    items.value = items.value.filter((room) => room._id !== roomId)
  }
  return { items, creating, fetchRooms, createRoom, joinRoom, deleteRoom }
})
