<script setup lang="ts">
import { useFriendStore } from '@/stores/friend'
import { onMounted, ref } from 'vue'
import DynamicImage from '@components/DynamicImage.vue'
import UserIcon from '@vicons/ionicons5/PersonSharp'
import { useAuthStore } from '@/stores/auth'

const friendStore = useFriendStore()
const authStore = useAuthStore()
onMounted(async () => {
  if (authStore.isAuth) {
    friendStore.fetch().then()
  }
})
</script>

<template>
 <div>
   <transition-group name="list" tag="div" class="-space-x-3 rtl:space-x-reverse my-9">
     <div class="tooltip ring rounded-full ring-white cursor-pointer" :data-tip="friend.username" v-for="friend in friendStore.items" :key="friend.username">
       <div class="w-12 h-12 bg-white rounded-full">
         <DynamicImage v-if="friend.photoUrl" circle :src="friend.photoUrl"/>
         <UserIcon v-else class="rounded-full ring ring-gray-400"/>
       </div>
     </div>
   </transition-group>
 </div>

</template>
