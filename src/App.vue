<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Footer from '@/components/FooterComponent.vue';
import HeaderComponent from '@/components/HeaderComponent.vue';
import { computed } from 'vue'

const route = useRoute();
const classes = computed(() => {
  return {
    'h-screen': route.name === 'chat',
    'min-h-screen': route.name !== 'chat',
  }
});

const isHideFooter = computed(() => {
  return route.name === 'chat';
});
</script>


<template>
  <div class="flex flex-col justify-between container mx-auto" :class="classes">
    <HeaderComponent />
    <router-view v-slot="{ Component, route }">
      <div
        :key="route.name"
        class="wrapper flex-grow flex px-2"
      >
        <Component :is="Component"/>
      </div>
    </router-view>
  </div>
  <Footer v-if="!isHideFooter" />
</template>
