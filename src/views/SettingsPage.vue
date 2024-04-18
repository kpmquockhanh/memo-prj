<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import { usePreviewImage } from '@/stores/previewImage'
import { useUser } from '@/stores/user'
import type { UpdateUser } from '@/types/base'
import { useToast } from 'vue-toastification'

const preview = usePreviewImage()
const user = useUser()
const toast = useToast()


const inputFile = ref<HTMLInputElement | null>(null)
const name = ref('')
const language = ref('')
const isLoading = ref(false)

const isChanged = computed(() => {
  return name.value !== user.user?.name ||
    language.value !== user.user?.language ||
    preview.file
})

const onUpdate = async () => {
  const userReq: UpdateUser = {
    name: name.value,
    language: language.value,
  };
  if (preview.file) {
    userReq.image = preview.file
  }
  isLoading.value = true
  const resp = await user.updateUser(userReq)
  console.log(resp)
  if (resp.resultCode !== '00086') {
    isLoading.value = false
    toast.error(resp.data?.en)
    return
  }
  isLoading.value = false
  preview.file = null
  user.fetchUser().then()
  toast.success('User updated')
}

onMounted(async () => {
  await user.fetchUser()
  name.value = user.user?.name || ''
  language.value = user.user?.language || ''
})
</script>

<template>
  <div class="flex gap-4 w-full">
    <div class="flex gap-2 flex-col basis-2/3">
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <input :value="user.user?.email" type="text" placeholder="Email" class="input input-bordered w-full" disabled />
      </label>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Name</span>
        </div>
        <input v-model="name" type="text" placeholder="Name" class="input input-bordered w-full" />
      </label>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Language</span>
        </div>
        <select v-model="language" class="select select-bordered w-full">
          <option value="en">English</option>
          <option value="tr">France</option>
        </select>
      </label>
      <div class="flex justify-end">
        <button class="btn btn-primary" @click="onUpdate" :disabled="!isChanged || isLoading">
          <span v-if="!isLoading">Update</span>
          <span v-else class="loading loading-spinner"></span>
        </button>
      </div>
    </div>
    <div class="flex gap-4 flex-col items-center">
      <div v-if="!preview.previewImage" class="w-40">
        <DynamicImage
          :dummy="!user.user?.photoUrl"
          :src="user.user?.photoUrl"
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

</template>

<style scoped>

</style>
