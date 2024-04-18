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

const toast = useToast();
const route = useRoute();
const websocket = useWebsocket();
const request = useRequest();
const user = useUser();
watch(messages, () => {
  nextTick(() => {
    mainScreen.value.scrollBy(0, mainScreen.value.scrollHeight);
    typeInput.value.focus();
  });
})

const initWs = () => {
  websocket.init(route.params.room_id as string);
}

const fetchMessages = async () => {
  const res = await request.request(`/v1/chat/${route.params.room_id}`, 'GET', {})
  messages.value = res.messages.reverse();
}

const onSendMessage = async () => {
  if (!type.value) {
    return;
  }
  const res = await request.request(
    `/v1/chat/${route.params.room_id}`,
    'POST',
    {
      body: {
        content: type.value,
      },
    },
    {
      noLoading: true,
    }
  )
  if (res) {
    // toast('Message sent!');
    type.value = '';
    // fetchMessages().then();
  } else {
    toast.error('Message failed!');
  }
}

onMounted(() => {
  initWs();
  fetchMessages();
  websocket.socket?.on('new_message', (data: Message) => {
    messages.value = [...messages.value, data];
    nextTick(() => {
      // console.log('scrolling');
      // mainScreen.value.scrollBy(0, mainScreen.value.scrollHeight);
    });
  });
})
onBeforeUnmount(() => {
  websocket.destroy();
})

</script>
<template>
  <div class="flex-grow flex flex-col justify-between items-center pb-2">
    <div id="kpm" class="messages flex-grow w-full overflow-auto basis-0 px-4" ref="mainScreen">
      <div v-if="request.loading" class="flex justify-center w-full">
        <span class="loading loading-dots loading-lg"></span>
      </div>
      <div v-else-if="!messages.length">
        <div class="flex justify-center w-full">
          <span class="text-md">No messages</span>
        </div>
      </div>
      <template v-else>
        <ChatMessage
          v-for="message in messages"
          :key="message._id"
          :side="message.user._id === user.user?._id ? 'right' : 'left'"
          :message="message"
        />
      </template>
    </div>
    <div
      class="flex pt-2 gap-4 w-full"
    >
      <input
        v-model="type"
        ref="typeInput"
        type="text"
        placeholder="Message"
        class="input input-bordered input-primary w-full"
        @keyup.enter="onSendMessage"
      >
      <button :disabled="!type || request.loading" class="btn btn-primary basis-1/6 lg:basis-8" @click="onSendMessage" ref="sendButton">
        <Icon size="20">
          <SendOutline />
        </Icon>
      </button>
    </div>
  </div>
</template>
