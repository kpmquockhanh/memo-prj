<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SettingIcon from '@vicons/fluent/Settings32Regular'
import { Icon } from '@vicons/utils'
import { useRoom } from '@/stores/room'

const room = useRoom()
const loading = ref(true)
const createRoomModal = ref<any>(null)
const name = ref('')
const description = ref('')

const onJoinRoom = (roomId: string) => {
  room.joinRoom(roomId)
}

const onEditRoom = (roomId: string) => {
  room.editRoom(roomId)
}

const onShowModal = () => {
  if (!createRoomModal.value) {
    return
  }

  createRoomModal.value.showModal()
}

const onCloseModal = () => {
  if (!createRoomModal.value) {
    return
  }

  createRoomModal.value.close()
}

const onCreate = async () => {
  if (!isValid.value) {
    return
  }
  await room.createRoom({
    name: name.value,
    description: description.value
  })
  onCloseModal()
  name.value = ''
  description.value = ''
}

const onRemove = (roomId: string) => {
  room.deleteRoom(roomId)
}
const rooms = computed(() => room.items)

const isValid = computed(() => {
  return name.value.trim() !== '' && description.value.trim() !== ''
})

onMounted(async () => {
  await room.fetchRooms()
  loading.value = false
})
</script>

<template>
  <div class="w-full mt-1">
    <div v-if="!rooms.length && !loading" class="flex justify-center my-3">
      <div class="flex flex-col items-center justify-center">
        <h1 class="text-2xl font-bold">No room available</h1>
      </div>
    </div>
    <div v-else class="grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4 w-full mb-4">
      <template v-if="loading">
        <div class="flex flex-col gap-4" v-for="i in 5" :key="i">
          <div class="skeleton h-32 w-full"></div>
          <div class="skeleton h-4 w-28"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
        </div>
      </template>
      <div v-else v-for="r in rooms" :key="r._id">
        <div class="card glass">
          <figure class="relative">
            <img v-if="r.thumbnail" :src="r.thumbnail" alt="" class="aspect-square object-cover">
            <img v-else src="https://dummyimage.com/400x300" alt="" class="w-full" />
            <button class="btn btn-circle btn-xs absolute right-1 top-1" @click="onRemove(r._id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </figure>
          <div class="card-body">
            <h2 class="card-title whitespace-nowrap overflow-hidden text-ellipsis">{{ r.name }}</h2>
            <p class="whitespace-nowrap overflow-hidden text-ellipsis">{{ r.description }}</p>
            <div class="card-actions justify-end">
              <button class="btn btn-ghost" @click="onEditRoom(r._id)">
                <Icon>
                  <SettingIcon />
                </Icon>
              </button>
              <button class="btn btn-primary" @click="onJoinRoom(r._id)">Join!</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mb-3">
      <button class="btn btn-info" @click="onShowModal">Create new room</button>
    </div>

    <dialog
      id="create_room"
      ref="createRoomModal"
      class="modal"
    >
      <div class="modal-box">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 class="font-bold text-lg">
          Create new room
        </h3>

        <div class="py-3 flex flex-col gap-2">
          <label class="input input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="Name" v-model="name" @keyup.enter="onCreate" />
          </label>

          <label class="input input-bordered flex items-center gap-2">
            <input type="text" class="grow" placeholder="Description" v-model="description" @keyup.enter="onCreate" />
          </label>
        </div>
        <div class="pt-2 flex justify-end gap-4">
          <button
            class="btn btn-outline-secondary"
            @click="onCloseModal"
          >
            Cancel
          </button>
          <button
            class="btn btn-primary"
            ref="createBtn"
            :disabled="!isValid"
          >
            <span v-if="room.creating" class="loading loading-spinner"></span>
            <span v-else @click="onCreate">Create!</span>
          </button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>

</style>
