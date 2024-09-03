<script setup lang="ts">
import { useFriendStore } from '@/stores/friend'
import { computed, onMounted, ref } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import SendIcon from '@vicons/fluent/Send24Regular'
import Checkmark24Filled from '@vicons/fluent/Checkmark24Filled'
import { Icon } from '@vicons/utils'
import type { User } from '@/types/base'
import Search24Regular from '@vicons/fluent/Search24Regular'
import { useUser } from '@/stores/user'

const friendStore = useFriendStore()
const userStore = useUser()
const q = ref('')
const items = ref<User[]>([])
const isSent = ref<Map<string, boolean>>(new Map())
const onSubmit = () => {
  if (!q.value || q.value.length < 5) return
  friendStore.findFriends(q.value).then(r => {
    items.value = r.filter((user) => userStore.user?._id !== user._id)
  })
}

onMounted(() => {
  friendStore.fetch().then()
})

const isValid = computed(() => {
  return q.value.length >= 5
})

const checkIsFriend = (userId: string) => {
  return friendStore.items.some((user) => user._id === userId)
}

const onInvite = (userId: string) => {
  friendStore.sendInvitation(userId).then(() => {
    isSent.value.set(userId, true)
  })
}

</script>

<template>
  <div class="flex justify-center w-full">
    <div class="w-2/3">
      <div class="card bg-base-100 w-full shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Find your friends!</h2>
          <div class="flex gap-2 mt-2">

            <label class="form-control flex-grow">
              <input type="text" placeholder="Search" class="input input-bordered"
                     @keyup.enter="onSubmit" v-model="q" />
              <div class="label">
                <span class="label-text-alt">Enter at least 5 characters</span>
              </div>
            </label>

            <button class="btn btn-primary" @click="onSubmit" :disabled="!isValid">
              <span v-if="friendStore.isFinding" class="loading loading-spinner"></span>
              <span v-else>
                <Icon size="24">
                  <Search24Regular />
                </Icon>
              </span>
            </button>
          </div>

          <div class="result">
            <div class="flex flex-col items-center justify-center pt-6 pb-3" v-if="!items.length">
              <p class="text-gray-600 font-semibold text-sm">Your result is empty.</p>
            </div>

            <div v-else class="flex flex-col gap-4">
              <div v-for="user in items" :key="user.username" class="flex gap-2 items-center">
                <div class="flex gap-2 items-center flex-grow">
                  <div class="w-12 h-12">
                    <DynamicImage circle :src="user.photoUrl"/>
                  </div>
                  <div>
                    <p class="text-gray-600 font-semibold text-sm">{{ user.email }}</p>
                    <p class="text-sm text-gray-500">{{user.username }}</p>
                  </div>
                </div>
                <button class="btn" @click="onInvite(user._id)" :disabled="isSent.get(user._id) || checkIsFriend(user._id)">
                  <Icon size="24">
                    <SendIcon v-if="!isSent.get(user._id) && !checkIsFriend(user._id)"/>
                    <Checkmark24Filled v-else/>
                  </Icon>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
