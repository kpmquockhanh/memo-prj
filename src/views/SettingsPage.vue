<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import { usePreviewImage } from '@/stores/previewImage'
import { useUser } from '@/stores/user'
import type { UpdateUser } from '@/types/base'
import { useToast } from 'vue-toastification'
import CountdownComponent from '@/views/CountdownComponent.vue'
import dayjs from 'dayjs'
import RoleSettings from './RoleSettings.vue'
import RemoveDuplicates from '@/views/RemoveDuplicates.vue'
import { useRoute, useRouter } from 'vue-router'

const preview = usePreviewImage()
const user = useUser()
const toast = useToast()
const route = useRoute()
const router = useRouter()


const inputFile = ref<HTMLInputElement | null>(null)
const name = ref('')
const language = ref('')
const date = ref(user.user?.memoryDate ? new Date(user.user?.memoryDate) : new Date())
const isLoading = ref(false)
const isFetching = ref(true)
const activeTab = ref('')


const isChanged = computed(() => {
  return name.value !== user.user?.name ||
    language.value !== user.user?.language ||
    preview.file || dayjs(date.value).format('YYYY-MM-DD') !== dayjs(user.user?.memoryDate).format('YYYY-MM-DD')
})

const onUpdate = async () => {
  const userReq: UpdateUser = {
    name: name.value,
    language: language.value,
    date: dayjs(date.value).format('YYYY-MM-DD')
  }
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
  if (route.query.tab) {
    activeTab.value = route.query.tab as string
  } else {
    activeTab.value = 'general'
  }
})

const changeTab = (tab: string) => {
  activeTab.value = tab
  router.push({ query: { tab } })
}
</script>

<template>
  <div class="w-full min-h-[calc(100vh-4rem)] bg-base-100 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-base-content">Settings</h1>
        <button 
          class="btn btn-primary btn-sm shadow-lg hover:shadow-primary/20" 
          @click="onUpdate" 
          :disabled="!isChanged || isLoading"
        >
          <span v-if="isLoading" class="loading loading-spinner loading-xs"></span>
          <span v-else>Save Changes</span>
        </button>
      </div>

      <!-- Tabs -->
      <div class="card shadow-md">
        <div class="card-body p-0">
          <div role="tablist" class="tabs tabs-lifted">
            <!-- General Tab -->
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="General"
              :checked="activeTab === 'general'"
              @change="changeTab('general')"
            />
            <div role="tabpanel" class="tab-content p-6">
              <div class="flex flex-col md:flex-row gap-8">
                <template v-if="isFetching">
                  <div class="w-full flex gap-4 flex-col grow">
                    <div class="skeleton h-12 w-full"></div>
                    <div class="skeleton h-12 w-full"></div>
                    <div class="skeleton h-12 w-full"></div>
                  </div>
                  <div class="skeleton h-48 basis-1/3"></div>
                </template>
                <template v-else>
                  <div class="flex gap-6 flex-col basis-2/3">
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">Email</span>
                      </label>
                      <input 
                        :value="user.user?.email" 
                        type="text" 
                        placeholder="Email" 
                        class="input input-bordered w-full focus:input-primary" 
                        disabled 
                      />
                    </div>
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">Name</span>
                      </label>
                      <input 
                        v-model="name" 
                        type="text" 
                        placeholder="Name" 
                        class="input input-bordered w-full focus:input-primary" 
                      />
                    </div>
                    <div class="form-control">
                      <label class="label">
                        <span class="label-text font-medium">Language</span>
                      </label>
                      <select 
                        v-model="language" 
                        class="select select-bordered w-full focus:select-primary"
                      >
                        <option value="en">English</option>
                        <option value="tr">France</option>
                      </select>
                    </div>
                  </div>
                  <div class="flex flex-col items-center gap-6">
                    <div class="relative group">
                      <div v-if="!preview.previewImage" class="w-48 h-48 rounded-lg overflow-hidden">
                        <DynamicImage
                          :dummy="!user.user?.photoUrl"
                          :src="user.user?.photoUrl || ''"
                          :loading-height="48"
                          alt="Profile"
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
                        <span class="text-white text-sm">Change Photo</span>
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
                </template>
              </div>
            </div>

            <!-- Timer Tab -->
            <input
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Timer"
              :checked="activeTab === 'timer'"
              @change="changeTab('timer')"
            />
            <div role="tabpanel" class="tab-content p-6">
              <div class="flex flex-col md:flex-row gap-8">
                <div class="basis-1/3">
                  <div class="form-control">
                    <label class="label">
                      <span class="label-text font-medium">Start Date</span>
                      <span class="label-text-alt font-semibold">{{ dayjs(date).format('DD/MM/YYYY') }}</span>
                    </label>
                    <VueDatePicker 
                      v-model="date" 
                      inline 
                      auto-apply 
                      :enable-time-picker="false" 
                      :max-date="new Date()" 
                    />
                  </div>
                </div>
                <div class="flex-grow flex items-center justify-center">
                  <CountdownComponent force-split :date="date" />
                </div>
              </div>
            </div>

            <!-- Permissions Tab -->
            <input
              :disabled="!user.can('permissions')"
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Permissions"
              :checked="activeTab === 'permissions'"
              @change="changeTab('permissions')"
            />
            <div role="tabpanel" class="tab-content p-6">
              <RoleSettings v-if="user.can('permissions') && activeTab === 'permissions'" />
            </div>

            <!-- Remove Duplicates Tab -->
            <input
              :disabled="!user.can('remove-duplicates')"
              type="radio"
              name="my_tabs_2"
              role="tab"
              class="tab"
              aria-label="Duplicates"
              :checked="activeTab === 'remove-duplicates'"
              @change="changeTab('remove-duplicates')"
            />
            <div role="tabpanel" class="tab-content p-6">
              <RemoveDuplicates v-if="user.can('remove-duplicates') && activeTab === 'remove-duplicates'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dp__flex_display {
  justify-content: center;
}

.card {
  @apply transition-all duration-300;
}

.file-input {
  @apply transition-all duration-300;
}

.file-input:hover {
  @apply shadow-lg;
}

.tab {
  @apply transition-all duration-300;
}


.tab[aria-selected="true"] {
  @apply bg-base-200;
}
</style>
