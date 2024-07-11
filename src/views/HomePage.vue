<script setup lang="ts">
import { nextTick, onMounted, ref, type Ref } from 'vue'
import Add from '@vicons/fluent/Add16Filled'
import { Icon } from '@vicons/utils'
import { useAttachment } from '@/stores/attachment'
import DynamicImage from '@components/DynamicImage.vue'
import type { Attachment } from '@/types/base'
import { useAuthStore } from '@/stores/auth'
import CountdownComponent from '@/views/CountdownComponent.vue'
import { usePreviewImage } from '@/stores/previewImage'
import DropzoneComponent from '@components/DropzoneComponent.vue'

const attachment = useAttachment()
const myModal: Ref<any> = ref(null)
const removeImageModal: Ref<any> = ref(null)
const createBtn: Ref<HTMLButtonElement | null> = ref(null)
const uploading = ref(false)
const deleting = ref(false)
const deletingItem: Ref<Attachment | null> = ref(null)
const inputFile = ref<HTMLInputElement | null>(null)
const isLoadingMore = ref(false)
const description = ref('')
const auth = useAuthStore()
const preview = usePreviewImage()

onMounted(async () => {
  await attachment.doFetch()

  // Using infinity scroll
  // initObserver()
})
const onSubmit = async () => {
  if (!preview.file) {
    return
  }
  uploading.value = true
  await attachment.doUpload(preview.file, description.value)
  uploading.value = false
  onCloseModal()
  resetInput()
}

const resetInput = () => {
  if (!inputFile.value) {
    return
  }
  preview.reset()
  inputFile.value.value = ''
}

const onShow = () => {
  if (!myModal.value) {
    return
  }

  nextTick(() => {
    createBtn.value?.focus()
  })
  myModal.value?.showModal()
}

const onCloseModal = () => {
  if (!myModal.value) {
    return
  }
  myModal.value?.close()
  resetInput()
}

const onCloseRemoveModal = () => {
  removeImageModal.value?.close()
}

const onRemove = async () => {
  if (!deletingItem.value) {
    return
  }
  deleting.value = true
  await attachment.doRemove(deletingItem.value._id)
  deleting.value = false
  onCloseRemoveModal()
}

const onClickRemove = (item: Attachment) => {
  deletingItem.value = item
  removeImageModal.value?.showModal()
}

const loadMoreRef = ref<HTMLElement | null>(null)

const onLoadMore = async () => {
  console.log('on load more')
  if (isLoadingMore.value) {
    return
  }
  isLoadingMore.value = true
  await attachment.nextPage()
  isLoadingMore.value = false

  // Using infinity scroll
  // initObserver()
}

const initObserver = () => {
  if (!loadMoreRef.value) {
    return
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(async (entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement
        observer.unobserve(target)
        await onLoadMore()
        // observer.observe(target)
      }
    })
  }, {
    threshold: 1,
  })

  observer.observe(loadMoreRef.value)
}
</script>
<template>
  <div class="w-full">

    <div class="flex justify-center mb-2">
      <countdown-component/>
    </div>
    <div class="flex justify-center mb-2 flex-col items-center" v-if="auth.isAdmin">
      <DropzoneComponent/>
    </div>
    <div class="masonry sm:masonry-sm md:masonry-md lg:masonry-lg">
      <div v-for="item in attachment.items" :key="item._id" class="break-inside-avoid mb-2 relative hover:drop-shadow hover:shadow-base-300 transition-shadow">
        <DynamicImage
          :src="item.fullPath"
          :description="item.description || ''"
          alt="egjs"
          :clickable="true"
        />
        <button v-if="auth.isAdmin" class="btn btn-sm btn-circle btn-ghost absolute top-1 right-1" @click="onClickRemove(item)">
          ✕
        </button>
      </div>

    </div>
    <div class="flex justify-center mb-2 mt-2">
      <button v-if="!attachment.isLastPage" class="btn btn-sm btn-outline" ref="loadMoreRef" @click="onLoadMore">
        <span v-if="isLoadingMore" class="loading loading-dots loading-xs"></span>
        <span v-else>Load more</span>
      </button>
    </div>
    <button v-if="auth.isAdmin" class="btn btn-circle btn-outline fixed right-1.5 bottom-1.5" @click="onShow">
      <Icon size="20">
        <Add />
      </Icon>
    </button>
  </div>
  <dialog
    id="my_modal_3"
    ref="myModal"
    class="modal"
  >
    <div class="modal-box">
      <form method="dialog">
        <button :disabled="uploading" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="font-bold text-lg">
        Upload new image
      </h3>
      <div class="flex gap-4 flex-col pt-4 pb-2">
        <img v-if="preview.previewImage" :src="preview.previewImage" alt="sample" class="max-h-72 rounded object-contain">
        <input type="file" class="file-input file-input-bordered file-input-sm w-full max-w-xs" @input="preview.onChangeFile"
               accept="image/*" ref="inputFile" />
        <input type="text" placeholder="Description (optional)" class="input input-bordered input-sm w-full max-w-xs" v-model="description" />
      </div>
      <div class="divider" />
      <div class="pt-2 pb-4 flex justify-end gap-4">
        <button
          class="btn btn-outline-secondary"
          @click="onCloseModal"
          :disabled="uploading"
        >
          Cancel
        </button>
        <button
          class="btn btn-primary"
          ref="createBtn"
          @click="onSubmit()"
          :disabled="!preview.previewImage || uploading"
        >
          <span v-if="uploading" class="loading loading-spinner"></span>
          <span v-else>Upload</span>
        </button>
      </div>
    </div>
  </dialog>

  <dialog
    id="remove_image"
    ref="removeImageModal"
    class="modal"
  >
    <div class="modal-box">
      <form method="dialog">
        <button :disabled="deleting" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <h3 class="font-bold text-lg">
        Are you sure to delete this image?
      </h3>
      <DynamicImage
        v-if="deletingItem"
        class="flex justify-center py-4 h-72"
        :src="deletingItem.fullPath"
        :dummy="false"
        alt="egjs" />
      <div class="pt-2 flex justify-end gap-4">
        <button
          class="btn btn-outline-secondary"
          @click="onCloseRemoveModal"
          :disabled="deleting"
        >
          Cancel
        </button>
        <button
          class="btn btn-primary"
          ref="createBtn"
          @click="onRemove"
          :disabled="deleting"
        >
          <span v-if="deleting" class="loading loading-spinner"></span>
          <span v-else>Remove</span>
        </button>
      </div>
    </div>
  </dialog>
</template>
