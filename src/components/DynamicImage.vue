<script setup lang="ts">
import { computed, ref } from 'vue'
import noImage from '@/assets/images/no-image.svg'

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
  loadingWidth: {
    type: Number,
    default: 72
  },
  description: {
    type: String,
    default: ''
  },
  circle: {
    type: Boolean,
    default: false
  }
})
const loading = ref(true)
const error = ref(false)

const path = computed(() => {
  return props.dummy ? noImage : props.src
})

const lazyOptions = {
  src: path.value,
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
}

const previewOptions = props.clickable ? {
  imageUrl: path.value?.replace('preview/', ''),
  withDownload: false,
  animation: 'blur',
  description: props.description
} : {}

const roundedClass = computed(() => {
  return props.circle ? 'rounded-full aspect-square w-full' : 'rounded-md w-full'
})

</script>

<template>
  <div v-if="path" class="flex flex-col justify-center w-full dynamic-image" :class="{'h-full': props.circle}">
    <div class="w-full overflow-hidden flex justify-center" v-if="loading">
      <div class="skeleton rounded-md" :style="{
      height: `${loadingHeight}px`,
      width: `${loadingWidth}px`
    }"></div>
    </div>
    <img
      v-if="!error && props.clickable"
      v-lazy="{src: lazyOptions.src, lifecycle: lazyOptions.lifecycle, error: noImage}"
      :class="roundedClass"
      v-fullscreen-image="previewOptions"
      :alt="description"
      src="#">
    <img
      v-else
      src="#"
      v-lazy="{src: lazyOptions.src, lifecycle: lazyOptions.lifecycle, error: noImage}"
      :class="roundedClass"
      :alt="description"
    >
    <div class="absolute bottom-0 p-2 text-xs w-full text-white rounded-b-md crd-heading hover-hover:blur"
         v-if="description">
      <span class="overflow-hidden text-ellipsis line-clamp-2 ct">{{ description }}</span>
    </div>
  </div>

</template>
