<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from 'vue';
import type { FullscreenImageProps } from '../types';
import 'zoomist/css'
import Zoomist from 'zoomist'

const props = withDefaults(defineProps<FullscreenImageProps>(), {
  animation: 'fade',
  imageAlt: '',
  withDownload: true,
  withClose: true,
  withFocusOnClose: true,
  withCloseOnEscape: true,
  closeOnClikOutside: true,
  maxHeight: '80vh',
  maxWidth: '80vw',
  backdropColor: 'rgba(0, 0, 0, 0.7)',
  description: '',
});

// Add loading state
const isLoading = ref(true);

const onImageLoad = () => {
  isLoading.value = false;
};

const emits = defineEmits(['close']);

const panoramaCurrentIndex = ref(0)

const disappear = ref(false);

const onClose = () => {
  disappear.value = true;

  setTimeout(() => {
    emits('close');
  }, 500);
};

const onDownload = async (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  try {
    const imageToDownload = Array.isArray(props.imageUrl) ? props.imageUrl[panoramaCurrentIndex.value] : props.imageUrl
    const response = await fetch(imageToDownload);
    const blob = await response.blob();

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'image';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href); // Clean up
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (props.withCloseOnEscape && event.key === 'Escape') {
    onClose();
  }
};

const onBackdropClick = () => {
  if (props.closeOnClikOutside) {
    onClose()
  }
};

const closeButtonRef = ref()

onMounted(() => {
  if (props.withFocusOnClose && closeButtonRef.value) {
    closeButtonRef.value.focus()
  }

  new Zoomist('.zoomist-container',{
    // Optional parameters
    maxScale: 4,
    bounds: true,
    // if you need slider
    // slider: true,
    // if you need zoomer
    // zoomer: true
  });
})
</script>

<template>
  <Transition :name="animation" appear>
    <div class="fullscreen-image" v-if="imageUrl && !disappear" @keydown="onKeydown" tabindex="0" role="dialog"
      aria-modal="true" aria-label="Fullscreen Image">
      <div class="backdrop" @click="onBackdropClick">
        <div class="icons">
          <button tabindex="0" class="icon download-icon" @click="onDownload" v-if="withDownload" title="Download">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </button>
          <button ref="closeButtonRef" tabindex="0" class="icon close-icon" @click="onClose" v-if="withClose"
            title="Close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 w-full h-full p-2 sm:p-4">
        <!-- Image Section -->
        <div class="zoomist-container mx-0 sm:mx-2 rounded-lg w-full lg:w-2/3 bg-base-100 shadow-xl flex items-center justify-center relative">
          <!-- Loading Spinner -->
          <Transition name="fade">
            <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-base-100/80 backdrop-blur-sm z-10">
              <div class="loading-container">
                <div class="loading-spinner"></div>
                <div class="loading-spinner-inner"></div>
                <div class="loading-pulse"></div>
              </div>
            </div>
          </Transition>
          
          <div class="zoomist-wrapper rounded-lg w-full h-full">
            <div class="zoomist-image flex items-center justify-center">
              <img 
                :src="imageUrl" 
                :alt="imageAlt" 
                class="max-h-full max-w-full"
                @load="onImageLoad"
              />
            </div>
          </div>
        </div>

        <!-- Details Section -->
        <div class="w-full lg:w-1/3 bg-base-100 rounded-lg p-3 sm:p-6 flex flex-col shadow-xl">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4 sm:mb-6">
            <div class="flex items-center gap-2 sm:gap-3">
              <button 
                class="btn btn-ghost btn-circle btn-sm sm:btn-md" 
                @click="onClose"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 class="text-lg sm:text-xl font-semibold">Image Details</h3>
            </div>
            <div class="badge badge-primary text-xs sm:text-sm">Public</div>
          </div>

          <!-- Description -->
          <div class="mb-4 sm:mb-6">
            <h4 class="text-xs sm:text-sm font-medium text-base-content/70 mb-1 sm:mb-2">Description</h4>
            <p class="text-sm sm:text-base text-base-content/80">{{ description || 'No description provided' }}</p>
          </div>

          <!-- Metadata -->
          <div class="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div>
              <h4 class="text-xs sm:text-sm font-medium text-base-content/70 mb-1 sm:mb-2">Uploaded by</h4>
              <div class="flex items-center gap-2 sm:gap-3">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-base-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-6 sm:w-6 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm sm:text-base font-medium">User Name</p>
                  <p class="text-xs sm:text-sm text-base-content/50">2 days ago</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="flex-grow flex flex-col">
            <h4 class="text-xs sm:text-sm font-medium text-base-content/70 mb-3 sm:mb-4">Comments</h4>
            
            <!-- Comments List -->
            <div class="flex-grow overflow-y-auto mb-3 sm:mb-4 space-y-3 sm:space-y-4">
              <div class="text-center text-base-content/70 py-6 sm:py-8">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p class="text-sm sm:text-base">No comments yet</p>
                <p class="text-xs sm:text-sm">Be the first to comment!</p>
              </div>
            </div>

            <!-- Comment Input -->
            <div class="flex gap-2">
              <input 
                type="text" 
                placeholder="Add a comment..."
                class="input input-bordered input-sm sm:input-md flex-grow"
              />
              <button class="btn btn-primary btn-sm sm:btn-md">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.icons {
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.icon {
  border: none;
  background-color: transparent;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.icon>svg {
  cursor: pointer;
  transition: transform ease .3s, color ease .3s;
  color: white;
  height: 24px;
  width: 24px;
}

.icon:hover:not(.icon--disabled)>svg {
  transform: translateY(2px);
  color: #BABFB7;
}

.icon--disabled>svg {
  cursor: not-allowed;
  color: #A3A8A2;
}

.fullscreen-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: v-bind(backdropColor);
  z-index: -1;
}

.zoomist-container {
  height: calc(100vh - 1rem);
  overflow: hidden;
}

@media (min-width: 640px) {
  .zoomist-container {
    height: calc(100vh - 2rem);
  }
}

@media (min-width: 1024px) {
  .zoomist-container {
    height: calc(100vh - 2rem);
  }
}

.zoomist-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoomist-image {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoomist-image img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* Custom scrollbar for comments */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--bc) / 0.2) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: hsl(var(--bc) / 0.2);
  border-radius: 3px;
}

/* Transitions */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter {
  opacity: 1;
}

.blur-enter-from,
.blur-leave-to {
  filter: blur(5px);
  opacity: 0;
}

.blur-enter-active,
.blur-leave-active {
  transition: filter .5s, opacity .5s;
}

.blur-enter {
  filter: blur(0px);
  opacity: 1;
}

.btn-circle {
  @apply transition-all duration-300;
}

.btn-circle:hover {
  @apply bg-base-200;
}

/* Loading Animation */
.loading-container {
  position: relative;
  width: 60px;
  height: 60px;
}

.loading-spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid hsl(var(--bc) / 0.1);
  border-radius: 50%;
  border-top-color: hsl(var(--p));
  animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
}

.loading-spinner-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border: 3px solid hsl(var(--bc) / 0.1);
  border-radius: 50%;
  border-top-color: hsl(var(--s));
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite reverse;
}

.loading-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, hsl(var(--p) / 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.2;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
