<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLazyload } from 'vue3-lazyload'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'image'
  },
  dummy: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  loadingHeight: {
    type: Number,
    default: 72
  }
})
const loading = ref(true)
const error = ref(false)

const path = computed(() => {
  return props.dummy ? 'https://picsum.photos/400/300' : props.src
})

const lazyRef = useLazyload(path, {
  lifecycle: {
    loading: () => {
      loading.value = true
    },
    loaded: () => {
      loading.value = false
    },
    error: () => {
      loading.value = false
      error.value = true
    }
  }
})

const previewOptions = props.clickable ? {
  imageUrl: path.value,
  withDownload: false,
  animation: 'blur'
} : {}

</script>

<template>
  <div v-if="path" class="flex justify-center w-full">
    <div v-show="loading" class="skeleton w-full rounded" :class="[`h-${loadingHeight}`]"></div>
    <img
      v-if="!error"
      ref="lazyRef"
      class="rounded"
      v-fullscreen-image="previewOptions">
    <img v-else
         class="rounded"
         src="https://picsum.photos/400/300"
         :alt="alt"/>
  </div>
</template>
