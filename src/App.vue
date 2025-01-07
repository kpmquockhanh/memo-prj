<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Footer from '@/components/FooterComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { computed, onMounted } from 'vue'
import { useFriendStore } from '@/stores/friend'
import { useAuthStore } from '@/stores/auth'

const route = useRoute();
const authStore = useAuthStore();
const friendStore = useFriendStore();

const classes = computed(() => {
  return {
    'h-screen': route.name === 'chat',
    'min-h-screen': route.name !== 'chat',
  }
});

const isHideFooter = computed(() => {
  return route.name === 'chat';
});

onMounted(() => {
  setInterval(() => {
    if (authStore.isAuth) {
      friendStore.fetchInvitations()
    }
  }, 5000);
})
</script>

<template>
  <div class="flex flex-col justify-between container mx-auto" :class="classes">
    <HeaderComponent />
    <router-view v-slot="{ Component }">
      <div
        class="wrapper flex-grow flex px-2 pb-2"
      >
        <transition name="fade" mode="out-in">
          <Component :is="Component"/>
        </transition>
      </div>
    </router-view>
  </div>
  <Footer v-if="!isHideFooter" />
</template>
