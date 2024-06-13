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
    <div class="flex gap-2 flex-col w-full" v-if="currentRoom?._id">
     <div class="flex-col flex gap-4">
       <div class="grid grid-cols-2 gap-4 alert">
         <div class="w-full h-full">
           <h1>Room: <strong>{{ currentRoom.name }}</strong></h1>
           <label class="form-control">
             <div class="label">
               <span class="label-text">Name</span>
             </div>
             <input type="text" placeholder="Type here" class="input input-bordered w-full input-sm" v-model="name" :disabled="room.updating" />
           </label>
           <label class="form-control">
             <div class="label">
               <span class="label-text">Description</span>
             </div>
             <input type="text" placeholder="Type here" class="input input-bordered w-full input-sm" v-model="description" :disabled="room.updating" />
           </label>
         </div>

         <div class="flex gap-4 flex-col items-center w-full justify-center">
           <div v-if="!preview.previewImage" class="w-40">
             <DynamicImage
               :dummy="!currentRoom.thumbnail"
               :src="currentRoom.thumbnail || ''"
               :loading-height="40"
               alt="profile"
             />
           </div>
           <img v-else :src="preview.previewImage" alt="" class="rounded w-40 h-40">
           <label class="form-control w-full max-w-xs">
             <input
               type="file"
               class="file-input file-input-sm file-input-bordered w-full max-w-xs"
               accept="image/*"
               ref="inputFile"
               @change="preview.onChangeFile" />
           </label>
         </div>
       </div>

       <div v-if="currentRoom?._id" class="text-right">
         <button class="btn btn-primary btn-sm" :disabled="room.updating" @click="room.updateRoom(currentRoom?._id, { name, description, image: preview.file || undefined })">Save</button>
       </div>
     </div>
    </div>
</template>

<style scoped>

</style>
