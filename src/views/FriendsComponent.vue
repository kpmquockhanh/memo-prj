<script setup lang="ts">
import { useFriendStore } from '@/stores/friend'
import { onMounted } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import UserIcon from '@vicons/ionicons5/PersonSharp'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const friendStore = useFriendStore()
const authStore = useAuthStore()
const router = useRouter()
onMounted(async () => {
  if (authStore.isAuth) {
    friendStore.fetch().then()
  }
})

const routeToFriendSearch = () => {
  router.push({
    name: 'friends',
  })
}
</script>

<template>
 <div v-if="authStore.isAuth">
   <transition-group name="list" tag="div" class="-space-x-3 hover-hover:-space-x-7 hover:-space-x-3 rtl:space-x-reverse my-9">
     <div class="flex items-center justify-center gap-2" v-if="!friendStore.items.length">
       <p class="text-gray-600 font-semibold text-sm">You dont have any friends.</p>
       <button class="btn btn-sm" @click="routeToFriendSearch">Add friend</button>
     </div>
     <div class="tooltip ring rounded-full ring-white cursor-pointer transition-all" :data-tip="friend.email" v-for="friend in friendStore.items" :key="friend.username">
       <div class="w-12 h-12 bg-white rounded-full">
         <DynamicImage v-if="friend.photoUrl" circle :src="friend.photoUrl"/>
         <UserIcon v-else class="rounded-full ring ring-gray-400"/>
       </div>
     </div>
   </transition-group>
 </div>

</template>
