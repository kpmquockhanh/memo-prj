<script setup lang="ts">
import { computed, defineEmits, defineProps, onMounted, ref } from 'vue';
import type { FullscreenImageProps } from '../types';
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

const isPreviousDisabled = computed(() => panoramaCurrentIndex.value === 0)

const isNextDisabled = computed(() => panoramaCurrentIndex.value === props.imageUrl.length - 1)

const handlePrevious = () => {
  panoramaCurrentIndex.value--
}

const handleNext = () => {
  panoramaCurrentIndex.value++
}


const closeButtonRef = ref()

onMounted(() => {
  if (props.withFocusOnClose && closeButtonRef.value) {
    closeButtonRef.value.focus()
  }
})
</script>

<template>
  <Transition :name="animation" appear>
    <div class="fullscreen-image" v-if="imageUrl && !disappear" @keydown="onKeydown" tabindex="0" role="dialog"
      aria-modal="true" aria-label="Fullscreen Image">
      <div class="backdrop" @click="onBackdropClick">
        <div class="icons">
          <button tabindex="0" class="icon download-icon" @click="onDownload" v-if="withDownload" title="close">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
          </button>
          <button ref="closeButtonRef" tabindex="0" class="icon close-icon" @click="onClose" v-if="withClose"
            title="download">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <template v-if="Array.isArray(imageUrl)">
        <transition-group name="list" tag="div" class="image-container">
          <button key="previouus" :disabled="isPreviousDisabled" :class="['icon', isPreviousDisabled && 'icon--disabled']"
        @click="handlePrevious">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
          <template v-for="(currImage, index) in imageUrl" :key="currImage + index">
            <img v-if="panoramaCurrentIndex === index" :src="currImage"
              :alt="Array.isArray(imageAlt) ? imageAlt[panoramaCurrentIndex] : imageAlt" />
          </template>
          <button key="neeext" :disabled="isNextDisabled" :class="['icon', isNextDisabled && 'icon--disabled']"
        @click="handleNext">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 6 15 12 9 18"></polyline>
        </svg>
      </button>
        </transition-group>
      </template>
      <template v-else>
        <div class="image-container flex-col text-gray-300 relative">
          <img :src="imageUrl" :alt="Array.isArray(imageAlt) ? imageAlt[panoramaCurrentIndex] : imageAlt" />
          <div class="absolute bottom-0 p-2 text-xs glass bg-gray-500 opacity-95 w-full" v-if="description">{{ description }}</div>
        </div>
      </template>

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
}

.icon {
  border: none;
  background-color: transparent;
}

.icon>svg {
  cursor: pointer;
  transition: transform ease .3s, color ease .3s;
}

.icon>svg {
  color: white;
  height: 36px;
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

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: v-bind(maxHeight);
  max-width: 80vw;
  overflow: hidden;
  gap: 16px;
  flex-wrap: nowrap;
}

img {
  object-fit: contain;
  max-width: inherit;
  max-height: inherit;
}

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
.list-leave-active {
  position: absolute;
  transition: all 0.5s ease;
}
.list-move,
.list-enter-active {
  transition-delay: 0.5s;
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
