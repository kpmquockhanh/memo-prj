<script setup lang="ts">
import { computed } from 'vue'
import dayjs from 'dayjs'
import UserIcon from '@vicons/ionicons5/PersonSharp'
import DynamicImage from '@components/DynamicImage.vue'
import { getSrc } from '@/utils'

const props = defineProps({
  side: {
    type: String,
    required: true,
    validator(value: string) {
      return ['left', 'right'].includes(value)
    }
  },
  message: {
    type: Object,
    required: true
  }
})

const sideClass = computed(() => {
  return props.side === 'left' ? 'chat-start' : 'chat-end'
})

const isPrimary = computed(() => {
  return props.side === 'left' ? '' : 'chat-bubble-primary'
})

const timeData = computed(() => {
  return dayjs(props.message.createdAt).fromNow()
})
</script>

<template>
  <div :class="['chat', sideClass]">
    <div class="chat-image avatar">
      <div class="w-10 rounded-full ring ring-info ring-offset-base-100 ring-offset-1">
        <DynamicImage :lazy="false" v-if="props.message.user.photo?.photoUrl" :src="getSrc(props.message.user.photo?.photoUrl, true)" alt="User avatar"/>
        <UserIcon v-else/>
      </div>
    </div>
    <div class="chat-header">
      {{ props.message.user.name }}
      <time class="text-xs opacity-50">{{ timeData }}</time>
    </div>
    <div
      class="chat-bubble"
      :class="[isPrimary]"
    >
      {{ props.message.content }}
    </div>
    <!--    <div class="chat-footer opacity-50">-->
    <!--      Delivered-->
    <!--    </div>-->
  </div>
</template>
