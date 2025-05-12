<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import SettingIcon from '@vicons/fluent/Settings32Regular'
import { Icon } from '@vicons/utils'
import { useRoom } from '@/stores/room'
import { useToast } from 'vue-toastification'

const room = useRoom()
const toast = useToast()
const loading = ref(true)
const createRoomModal = ref<any>(null)
const deleteRoomModal = ref<any>(null)
const roomToDelete = ref<string | null>(null)
const isDeleting = ref(false)
const name = ref('')
const description = ref('')
const isCreating = ref(false)

const onJoinRoom = (roomId: string) => {
  room.joinRoom(roomId)
}

const onEditRoom = (roomId: string) => {
  room.editRoom(roomId)
}

const onShowModal = () => {
  if (!createRoomModal.value) return
  createRoomModal.value.showModal()
}

const onCloseModal = () => {
  if (!createRoomModal.value) return
  createRoomModal.value.close()
  name.value = ''
  description.value = ''
}

const onCreate = async () => {
  if (!isValid.value) return
  try {
    isCreating.value = true
    await room.createRoom({
      name: name.value.trim(),
      description: description.value.trim()
    })
    toast.success('Room created successfully!')
    onCloseModal()
  } catch (error) {
    toast.error('Failed to create room')
  } finally {
    isCreating.value = false
  }
}

const onRemove = (roomId: string) => {
  roomToDelete.value = roomId
  if (!deleteRoomModal.value) return
  deleteRoomModal.value.showModal()
}

const confirmDelete = async () => {
  if (!roomToDelete.value) return
  try {
    isDeleting.value = true
    await room.deleteRoom(roomToDelete.value)
    toast.success('Room deleted successfully!')
    closeDeleteModal()
  } catch (error) {
    toast.error('Failed to delete room')
  } finally {
    isDeleting.value = false
  }
}

const closeDeleteModal = () => {
  if (!deleteRoomModal.value) return
  deleteRoomModal.value.close()
  roomToDelete.value = null
}

const rooms = computed(() => room.items)

const isValid = computed(() => {
  return name.value.trim() !== '' && description.value.trim() !== ''
})

onMounted(async () => {
  try {
    await room.fetchRooms()
  } catch (error) {
    toast.error('Failed to load rooms')
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="w-full min-h-[calc(100vh-4rem)] bg-base-100 p-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto mb-8">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-base-content">Chat Rooms</h1>
        <button 
          class="btn btn-primary gap-2 shadow-lg hover:shadow-primary/20" 
          @click="onShowModal"
        >
          <span class="text-xl">+</span>
          Create Room
        </button>
      </div>
    </div>

    <!-- Room List -->
    <div class="max-w-7xl mx-auto">
      <div v-if="!rooms.length && !loading" class="flex justify-center items-center min-h-[400px]">
        <div class="text-center p-8 rounded-2xl bg-base-200 shadow-xl">
          <div class="text-6xl mb-4">🏠</div>
          <h2 class="text-2xl font-semibold mb-2">No Rooms Available</h2>
          <p class="text-base-content/70 mb-4">Be the first to create a room!</p>
          <button class="btn btn-primary shadow-lg hover:shadow-primary/20" @click="onShowModal">Create Room</button>
        </div>
      </div>

      <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Loading Skeleton -->
        <template v-if="loading">
          <div v-for="i in 8" :key="i" class="card bg-base-200 shadow-xl animate-pulse">
            <div class="skeleton h-48 w-full"></div>
            <div class="card-body">
              <div class="skeleton h-6 w-3/4 mb-2"></div>
              <div class="skeleton h-4 w-full mb-2"></div>
              <div class="skeleton h-4 w-2/3"></div>
            </div>
          </div>
        </template>

        <!-- Room Cards -->
        <div v-else v-for="r in rooms" :key="r._id" class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <figure class="relative group">
            <img 
              v-if="r.thumbnail" 
              :src="r.thumbnail" 
              :alt="r.name"
              class="w-full h-48 object-cover"
            >
            <img 
              v-else 
              src="https://dummyimage.com/400x300/374151/ffffff&text=Chat+Room" 
              :alt="r.name"
              class="w-full h-48 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            <button 
              class="btn btn-circle btn-sm btn-error absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              @click="onRemove(r._id)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </figure>
          <div class="card-body">
            <h2 class="card-title text-lg font-semibold">{{ r.name }}</h2>
            <p class="text-base-content/70 line-clamp-2">{{ r.description }}</p>
            <div class="card-actions justify-end mt-4">
              <button 
                class="btn btn-ghost btn-sm" 
                @click="onEditRoom(r._id)"
              >
                <Icon size="20">
                  <SettingIcon />
                </Icon>
              </button>
              <button 
                class="btn btn-primary btn-sm shadow-lg hover:shadow-primary/20" 
                @click="onJoinRoom(r._id)"
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Room Modal -->
    <dialog
      id="create_room"
      ref="createRoomModal"
      class="modal"
    >
      <div class="modal-box bg-base-200 relative">
        <!-- Close Button -->
        <button 
          class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4 z-10 hover:bg-base-300 transition-all duration-300"
          @click="onCloseModal"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        <h3 class="font-bold text-lg mb-4 text-base-content">Create New Room</h3>

        <div class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Room Name</span>
            </label>
            <input 
              type="text" 
              class="input input-bordered w-full focus:input-primary" 
              placeholder="Enter room name"
              v-model="name"
              @keyup.enter="onCreate"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Description</span>
            </label>
            <textarea 
              class="textarea textarea-bordered h-24 focus:textarea-primary" 
              placeholder="Enter room description"
              v-model="description"
            ></textarea>
          </div>
        </div>

        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="onCloseModal"
          >
            Cancel
          </button>
          <button
            class="btn btn-primary shadow-lg hover:shadow-primary/20"
            :disabled="!isValid || isCreating"
            @click="onCreate"
          >
            <span v-if="isCreating" class="loading loading-spinner loading-sm"></span>
            <span v-else>Create Room</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-black/50">
        <button>close</button>
      </form>
    </dialog>

    <!-- Delete Room Modal -->
    <dialog
      id="delete_room"
      ref="deleteRoomModal"
      class="modal"
    >
      <div class="modal-box bg-base-200 relative">
        <!-- Close Button -->
        <button 
          class="btn btn-circle btn-ghost btn-sm absolute right-4 top-4 z-10 hover:bg-base-300 transition-all duration-300"
          @click="closeDeleteModal"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        <div class="text-center py-4">
          <div class="text-5xl mb-4">⚠️</div>
          <h3 class="font-bold text-lg mb-2">Delete Room</h3>
          <p class="text-base-content/70 mb-6">
            Are you sure you want to delete this room? This action cannot be undone.
          </p>
        </div>

        <div class="modal-action">
          <button
            class="btn btn-ghost"
            @click="closeDeleteModal"
            :disabled="isDeleting"
          >
            Cancel
          </button>
          <button
            class="btn btn-error shadow-lg hover:shadow-error/20"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
            <span v-else>Delete Room</span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop bg-black/50">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped>
.modal-box {
  @apply transition-all duration-300;
}

.btn-circle {
  @apply hover:scale-110 active:scale-95;
}

.modal-backdrop {
  @apply transition-opacity duration-300;
}

.modal-backdrop:hover {
  @apply bg-black/60;
}

/* Add animation for the warning emoji */
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

.text-5xl {
  animation: shake 0.5s ease-in-out;
}
</style>