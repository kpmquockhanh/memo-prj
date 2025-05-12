<script setup lang="ts">
import ChatMessage from '../components/ChatMessage.vue';
import { onMounted, ref, onBeforeUnmount, type Ref, watch, nextTick } from 'vue'
import { Icon } from '@vicons/utils';
import SendOutline from '@vicons/ionicons5/SendOutline';
import { useToast } from 'vue-toastification'
import { useWebsocket } from '@/stores/websocket';
import { useRoute } from 'vue-router';
import { useRequest } from '@/stores/http'
import type { Message } from '@/types/base'
import { useUser } from '@/stores/user'

const type = ref();
const mainScreen = ref();
const typeInput = ref();
const messages: Ref<Array<Message>> = ref([]);
const isTyping = ref(false);

const toast = useToast();
const route = useRoute();
const websocket = useWebsocket();
const request = useRequest();
const user = useUser();

watch(messages, () => {
  nextTick(() => {
    scrollToBottom();
  });
})

const scrollToBottom = () => {
  if (mainScreen.value) {
    mainScreen.value.scrollTo({
      top: mainScreen.value.scrollHeight,
      behavior: 'smooth'
    });
  }
}

const initWs = () => {
  websocket.init(route.params.room_id as string);
}

const fetchMessages = async () => {
  const res = await request.request(`/v1/chat/${route.params.room_id}`, 'GET', {})
  messages.value = res.messages.reverse();
  nextTick(() => {
    scrollToBottom();
  });
}

const onSendMessage = async () => {
  if (!type.value?.trim()) {
    return;
  }
  isTyping.value = true;
  const res = await request.request(
    `/v1/chat/${route.params.room_id}`,
    'POST',
    {
      body: {
        content: type.value.trim(),
      },
    },
    {
      noLoading: true,
    }
  )
  if (res) {
    type.value = '';
    typeInput.value?.focus();
  } else {
    toast.error('Failed to send message');
  }
  isTyping.value = false;
}

onMounted(() => {
  initWs();
  fetchMessages();
  websocket.socket?.on('new_message', (data: Message) => {
    messages.value = [...messages.value, data];
  });
})

onBeforeUnmount(() => {
  websocket.destroy();
})
</script>

<template>
  <div class="flex-grow flex flex-col justify-between items-center h-full bg-gradient-to-br from-base-200 via-base-100 to-base-200 rounded-2xl overflow-hidden">
    <!-- Header -->
    <div class="w-full bg-base-100/80 backdrop-blur-sm shadow-sm px-6 py-4 flex items-center justify-between z-10 border-b border-base-300">
      <div class="flex items-center gap-3">
        <button 
          class="btn btn-ghost btn-circle btn-sm hover:bg-base-200"
          @click="$router.back()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 class="text-xl font-semibold text-base-content">Chat Room</h2>
      </div>
      <div class="flex items-center gap-2">
        <div class="badge badge-primary badge-sm">Online</div>
      </div>
    </div>

    <!-- Messages Area -->
    <div 
      id="chat-messages" 
      class="messages flex-grow w-full overflow-auto basis-0 px-6 py-6 space-y-6 rounded-xl" 
      ref="mainScreen"
    >
      <div v-if="request.loading" class="flex justify-center w-full py-12">
        <div class="flex flex-col items-center gap-4">
          <span class="loading loading-dots loading-lg text-primary"></span>
          <span class="text-base-content/70">Loading messages...</span>
        </div>
      </div>
      <div v-else-if="!messages.length" class="flex flex-col items-center justify-center h-full py-12">
        <div class="text-6xl mb-4 animate-bounce">💬</div>
        <span class="text-base-content/70 text-lg">No messages yet. Start the conversation!</span>
      </div>
      <template v-else>
        <div class="flex flex-col gap-6">
          <ChatMessage
            v-for="message in messages"
            :key="message._id"
            :side="message.user._id === user.user?._id ? 'right' : 'left'"
            :message="message"
          />
        </div>
      </template>
    </div>

    <!-- Input Area -->
    <div class="w-full bg-base-100/80 backdrop-blur-sm border-t border-base-300 p-6">
      <div class="flex gap-4 max-w-4xl mx-auto">
        <div class="flex-grow relative">
          <input
            v-model="type"
            ref="typeInput"
            type="text"
            placeholder="Type your message..."
            class="input input-bordered w-full focus:input-primary transition-all duration-300 pr-12 bg-base-100/50 backdrop-blur-sm rounded-2xl"
            :class="{ 'input-disabled': isTyping }"
            :disabled="isTyping"
            @keyup.enter="onSendMessage"
          >
          <div class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">
            <span v-if="isTyping" class="loading loading-dots loading-xs"></span>
          </div>
        </div>
        <button 
          :disabled="!type?.trim() || isTyping" 
          class="btn btn-primary btn-circle shadow-lg hover:shadow-primary/20 transition-all duration-300"
          :class="{ 'loading': isTyping }"
          @click="onSendMessage" 
          ref="sendButton"
        >
          <Icon v-if="!isTyping" size="20">
            <SendOutline />
          </Icon>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.messages {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--bc) / 0.2) transparent;
  background-image: 
    radial-gradient(circle at 100% 100%, hsl(var(--p) / 0.1) 0%, transparent 50%),
    radial-gradient(circle at 0% 0%, hsl(var(--s) / 0.1) 0%, transparent 50%);
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-track {
  background: transparent;
}

.messages::-webkit-scrollbar-thumb {
  background-color: hsl(var(--bc) / 0.2);
  border-radius: 3px;
}

.messages::-webkit-scrollbar-thumb:hover {
  background-color: hsl(var(--bc) / 0.3);
}

.input {
  @apply transition-all duration-300;
}

.input:focus {
  @apply shadow-lg;
}

.btn-circle {
  @apply transition-all duration-300;
}

.btn-circle:hover {
  @apply scale-105;
}

.btn-circle:active {
  @apply scale-95;
}

/* Add subtle pattern overlay */
.messages::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
}

/* Add rounded corners to the main container */
:deep(.chat-message) {
  @apply rounded-2xl;
}

:deep(.chat-message-left) {
  @apply rounded-tl-none;
}

:deep(.chat-message-right) {
  @apply rounded-tr-none;
}
</style>
