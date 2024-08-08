<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import { usePreviewImage } from '@/stores/previewImage'
import { useUser } from '@/stores/user'
import type { UpdateUser } from '@/types/base'
import { useToast } from 'vue-toastification'
import CountdownComponent from '@/views/CountdownComponent.vue'
import dayjs from 'dayjs'

const preview = usePreviewImage()
const user = useUser()
const toast = useToast()


const inputFile = ref<HTMLInputElement | null>(null)
const name = ref('')
const language = ref('')
const date = ref(user.user?.memoryDate ? new Date(user.user?.memoryDate) : new Date())
const isLoading = ref(false)
const isFetching = ref(true)

const isChanged = computed(() => {
  return name.value !== user.user?.name ||
    language.value !== user.user?.language ||
    preview.file || dayjs(date.value).format('YYYY-MM-DD') !== dayjs(user.user?.memoryDate).format('YYYY-MM-DD')
})

const onUpdate = async () => {
  const userReq: UpdateUser = {
    name: name.value,
    language: language.value,
    date: dayjs(date.value).format('YYYY-MM-DD'),
  };
  if (preview.file) {
    userReq.image = preview.file
  }
  isLoading.value = true
  const resp = await user.updateUser(userReq)
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
  isFetching.value = false
})
</script>

<template>
  <div class="w-full">
    <div role="tablist" class="tabs tabs-lifted">
      <input type="radio" name="my_tabs_2" role="tab" class="tab" aria-label="General" checked />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div class="flex flex-col-reverse md:flex-row gap-4 w-full">
          <template v-if="isFetching">
            <div class="w-full flex gap-2 flex-col grow">
              <div class="skeleton h-12 w-full"></div>
              <div class="skeleton h-12 w-full"></div>
              <div class="skeleton h-12 w-full"></div>
              <div class="skeleton h-12 w-full"></div>
            </div>
            <div class="skeleton h-40 basis-1/3"></div>
          </template>
          <template v-else>
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
            </div>
            <div class="flex gap-4 flex-col items-center">
              <div v-if="!preview.previewImage" class="w-40">
                <DynamicImage
                  :dummy="!user.user?.photoUrl"
                  :src="user.user?.photoUrl || ''"
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
          </template>
        </div>
      </div>

      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        class="tab"
        aria-label="Advanced"
      />
      <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div class="flex flex-col-reverse md:flex-row gap-4 w-full">
          <template v-if="true">
            <div class="basis-1/3">
              <label class="form-control w-full flex flex-col items-center">
                <div class="label">
                  <span class="label-text">Start date: <span class="font-semibold">{{ dayjs(date).format('DD/MM/YYYY') }}</span></span>
                </div>
                <VueDatePicker v-model="date" inline auto-apply :enable-time-picker="false" :max-date="new Date()" />
              </label>
            </div>
            <div class="flex gap-4 flex-col items-center flex-grow justify-center">
              <CountdownComponent force-split :date="date"/>
            </div>
          </template>
        </div>

      </div>
    </div>
    <div class="flex justify-end mt-2">
      <button class="btn btn-primary" @click="onUpdate" :disabled="!isChanged || isLoading">
        <span v-if="!isLoading">Update</span>
        <span v-else class="loading loading-spinner"></span>
      </button>
    </div>
  </div>


</template>

<style scoped>
.dp__flex_display {
  justify-content: center;
}
</style>
