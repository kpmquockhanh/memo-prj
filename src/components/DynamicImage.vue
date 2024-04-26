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
  },
  description: {
    type: String,
    default: '',
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
  imageUrl: path.value?.replace('preview/', ''),
  withDownload: false,
  animation: 'blur',
  description: props.description,
} : {}

</script>

<template>
  <div v-if="path" class="flex justify-center w-full cursor-pointer">
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
    <div class="absolute bottom-0 p-2 text-xs glass bg-gray-500 opacity-80 w-full text-white" v-if="description">
      <div class="overflow-hidden text-ellipsis line-clamp-2">
        {{ description }}
      </div>
    </div>
  </div>
</template>
