<script setup lang="ts">
import { onMounted, ref, type Ref, computed } from 'vue'
import Add from '@vicons/fluent/Add16Filled'
import Camera from '@vicons/fluent/Camera20Filled'
import { Icon } from '@vicons/utils'
import { useAttachment } from '@/stores/attachment'
import DynamicImage from '@components/DynamicImage.vue'
import type { Attachment } from '@/types/base'
import { useAuthStore } from '@/stores/auth'
import CountdownComponent from '@/views/CountdownComponent.vue'
import DropzoneComponent from '@components/DropzoneComponent.vue'
import WelcomeApp from '@/views/WelcomeApp.vue'
import { storeToRefs } from 'pinia'
import BaseModal from '@/views/BaseModal.vue'
import CameraComponent from '@/views/CameraComponent.vue'
import FriendsComponent from '@/views/FriendsComponent.vue'
import UserIcon from '@vicons/ionicons5/PersonSharp'
import { useRouter } from 'vue-router'

const attachmentStore = useAttachment()
const { items, isLastPage, isLoading } = storeToRefs(attachmentStore);
const { doFetch, doRemove, nextPage } = attachmentStore
const deleting = ref(false)
const deletingItem: Ref<Attachment | null> = ref(null)
const isLoadingMore = ref(false)
const auth = useAuthStore()
const isShowModal = ref(false)
const isShowDeleteModal = ref(false)
const isShowCamera = ref(false)
const dropzoneRef = ref<HTMLElement | null>(null)
const masonryRef = ref<HTMLElement | null>(null)
const router = useRouter()

onMounted(async () => {
  await doFetch()
})

const onShow = () => {
  if (auth.isAuth) {
    isShowModal.value = true
    return
  }
  router.push({name: 'register'})
}


const onRemove = async () => {
  if (!deletingItem.value) {
    return
  }
  deleting.value = true
  await doRemove(deletingItem.value._id)
  deleting.value = false
}

const onClickRemove = (item: Attachment) => {
  deletingItem.value = item
  isShowDeleteModal.value = true
}

const loadMoreRef = ref<HTMLElement | null>(null)

const onLoadMore = async () => {
  if (isLoadingMore.value) {
    return
  }
  isLoadingMore.value = true
  await nextPage()
  isLoadingMore.value = false
}

const columnWidths = computed(() => {
  const container = masonryRef.value
  if (!container) {
    return 0;
  }
  const computedStyle = window.getComputedStyle(container);
  const columnGap = parseInt(computedStyle.columnGap) || 0;
  const containerWidth = container.offsetWidth;
  const columnCount = parseInt(computedStyle.columnCount);

  // Calculate the width of a single column
  return (containerWidth - (columnGap * (columnCount - 1))) / columnCount;
})

const ratio = computed(() => {
  if (!columnWidths.value) {
    return 0
  }
  return columnWidths.value / 300
})

// Usage

</script>
<template>
  <div class="w-full">
    <div v-if="false" class="flex justify-center mb-2">
      <CountdownComponent/>
    </div>

    <div v-if="true" class="flex justify-center mb-2">
      <FriendsComponent/>
    </div>
    <WelcomeApp v-if="!items.length && !isLoading" @start="onShow"/>
   <template v-if="items.length">
     <div class="masonry sm:masonry-sm md:masonry-md lg:masonry-lg" ref="masonryRef">

       <transition-group name="list">
         <div v-for="item in items" :key="item._id" class="break-inside-avoid mb-2 relative hover:drop-shadow hover:shadow-base-300 transition-shadow">
           <DynamicImage
             class="crd"
             :src="item.fullPath"
             :description="item.description || ''"
             alt="egjs"
             :clickable="true"
             :loading-height="item.height * ratio"
             :loading-width="item.width * ratio"
           />

           <div class="absolute top-1 left-1 w-5 h-5 avatar-image">
             <DynamicImage circle :src="item.createdBy?.photoUrl" v-if="item.createdBy?.photoUrl" />
             <Icon v-else size="20">
               <UserIcon/>
             </Icon>
           </div>
           <button v-if="auth.isAdmin" class="btn btn-sm btn-circle btn-ghost absolute top-1 right-1" @click="onClickRemove(item)">
             ✕
           </button>
         </div>
       </transition-group>
     </div>
     <div v-if="!isLastPage" class="flex justify-center mb-2 mt-2">
       <button class="btn btn-sm btn-outline" ref="loadMoreRef" @click="onLoadMore">
         <span v-if="isLoadingMore" class="loading loading-dots loading-xs"></span>
         <span v-else>Load more</span>
       </button>
     </div>
   </template>

    <ul class="menu bg-base-200 rounded-box fixed right-1.5 bottom-1.5">
      <li>
        <a class="tooltip tooltip-left" data-tip="Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
      </li>
      <template v-if="auth.isAuth">
        <li>
          <a class="tooltip tooltip-left flex" data-tip="Upload" @click.prevent="onShow">
            <Icon size="20">
              <Add />
            </Icon>
          </a>
        </li>
        <li v-if="auth.isAdmin">
          <a class="tooltip tooltip-left flex" data-tip="Camera" @click.prevent="isShowCamera = true">
            <Icon size="20">
              <Camera />
            </Icon>
          </a>
        </li>
      </template>

    </ul>
  </div>
  <BaseModal :show="isShowModal" @close="isShowModal = false" title="Upload">
    <DropzoneComponent ref="dropzoneRef"/>
    <template v-slot:action></template>
  </BaseModal>

  <BaseModal :show="isShowCamera" @close="isShowCamera = false" title="Camera">
    <CameraComponent @uploaded="isShowCamera = false"/>
    <template v-slot:action></template>
  </BaseModal>

  <BaseModal :loading="deleting" :show="isShowDeleteModal" @close="isShowDeleteModal = false" :ok="onRemove" title="Are you sure to delete this image?">
    <DynamicImage
      v-if="deletingItem"
      class="flex justify-center py-4 w-full"
      :src="deletingItem.fullPath"
      :dummy="false"
      :loading-height="deletingItem.height"
      :loading-width="deletingItem.width"
      alt="egjs" />
  </BaseModal>
</template>
