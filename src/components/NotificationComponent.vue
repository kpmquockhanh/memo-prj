<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useFriendStore } from '@/stores/friend'
import { onMounted } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import AppsAddIn20Regular from '@vicons/fluent/AppsAddIn20Regular'
import { Icon } from '@vicons/utils'

const authStore = useAuthStore()
const friendStore = useFriendStore()
 onMounted(() => {
   if (authStore.isAuth) {
     friendStore.fetchInvitations().then()
   }
 })

const onAccept = (id: string) => {
  friendStore.acceptInvitation(id)
}

const onDecline = (id: string) => {
  friendStore.declineInvitation(id)
}
</script>

<template>
  <div class="p-2">
    <div class="mb-1">
      <h1 class="font-semibold text-gray-800 text-sm flex gap-2 items-center">
        <Icon size="24">
          <AppsAddIn20Regular/>
        </Icon>
        <span>Friend Requests</span>
      </h1>
    </div>
    <div class="flex-col flex gap-2">
      <div class="flex flex-col items-center justify-center py-4" v-if="friendStore.invitations.length === 0">
        <p class="text-gray-600 font-semibold text-sm">Your invitation is empty.</p>
      </div>
      <div v-for="invitation in friendStore.invitations" :key="invitation._id" class="flex justify-center items-center gap-2">
        <div class="w-1/5">
          <DynamicImage class="w-12 h-12" circle :src="invitation.photoUrl" clickable/>
        </div>
        <div class="w-4/5 text-sm">
          <div class="break-all">
            <span class="font-semibold text-gray-800">{{invitation.origin.email }} </span>
            <span class="text-gray-400"> wants to be your friend</span>
          </div>
          <div class="font-semibold flex gap-2 mt-2">
            <button :disabled="friendStore.isProcessingInvitation" class="btn btn-sm btn-primary btn-outline" @click="onAccept(invitation._id)">
              <span class="loading loading-spinner" v-if="friendStore.isProcessingInvitation"></span>
              <span v-else>Accept</span>
            </button>
            <button :disabled="friendStore.isProcessingInvitation" class="btn btn-sm btn-outline" @click="onDecline(invitation._id)">
              <span class="loading loading-spinner" v-if="friendStore.isProcessingInvitation"></span>
              <span v-else>Decline</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
