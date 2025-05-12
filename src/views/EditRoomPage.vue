<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useRoom } from '@/stores/room'
import DynamicImage from '@components/DynamicImage.vue'
import { usePreviewImage } from '@/stores/previewImage'

const room = useRoom()

const route = useRoute()
const name = ref('')
const description = ref('')
const preview = usePreviewImage()

const currentRoom = computed(() => {
  return room.items.find((item) => item._id === route.params.room_id)
})


onMounted(async () => {
  await room.fetchRooms()
  name.value = currentRoom.value?.name || ''
  description.value = currentRoom.value?.description || ''
})
</script>

<template>
  <div class="w-full min-h-[calc(100vh-4rem)] bg-base-100 p-4">
    <div class="max-w-4xl mx-auto" v-if="currentRoom?._id">
      <div class="flex flex-col gap-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-base-content">Edit Room</h1>
          <button 
            class="btn btn-primary btn-sm shadow-lg hover:shadow-primary/20" 
            :disabled="room.updating" 
            @click="room.updateRoom(currentRoom?._id, { name, description, image: preview.file || undefined })"
          >
            <span v-if="room.updating" class="loading loading-spinner loading-xs"></span>
            <span v-else>Save Changes</span>
          </button>
        </div>

        <!-- Main Content -->
        <div class="card bg-base-200 shadow-xl">
          <div class="card-body">
            <div class="grid md:grid-cols-2 gap-8">
              <!-- Form Section -->
              <div class="space-y-6">
                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Room Name</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter room name" 
                    class="input input-bordered w-full focus:input-primary" 
                    v-model="name" 
                    :disabled="room.updating" 
                  />
                </div>

                <div class="form-control">
                  <label class="label">
                    <span class="label-text font-medium">Description</span>
                  </label>
                  <textarea 
                    placeholder="Enter room description" 
                    class="textarea textarea-bordered h-32 focus:textarea-primary" 
                    v-model="description" 
                    :disabled="room.updating"
                  ></textarea>
                </div>
              </div>

              <!-- Image Section -->
              <div class="flex flex-col items-center gap-6">
                <div class="relative group">
                  <div v-if="!preview.previewImage" class="w-48 h-48 rounded-lg overflow-hidden">
                    <DynamicImage
                      :dummy="!currentRoom.thumbnail"
                      :src="currentRoom.thumbnail || ''"
                      :loading-height="48"
                      alt="Room thumbnail"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <img 
                    v-else 
                    :src="preview.previewImage" 
                    alt="Preview" 
                    class="w-48 h-48 rounded-lg object-cover"
                  >
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <span class="text-white text-sm">Change Image</span>
                  </div>
                </div>

                <label class="form-control w-full max-w-xs">
                  <input
                    type="file"
                    class="file-input file-input-bordered w-full max-w-xs"
                    accept="image/*"
                    ref="inputFile"
                    @change="preview.onChangeFile"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply transition-all duration-300;
}

.card:hover {
  @apply shadow-2xl;
}

.file-input {
  @apply transition-all duration-300;
}

.file-input:hover {
  @apply shadow-lg;
}
</style>
