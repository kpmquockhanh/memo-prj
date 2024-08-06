<script setup lang="ts">
import EmailIcon from '@vicons/ionicons5/Mail'
import KeyIcon from '@vicons/ionicons5/Key'
import { Icon } from '@vicons/utils'
import { useAuthStore } from '@/stores/auth'
import type { AuthRequest } from '@/types/base'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const store = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const toast = useToast()

const loading = ref(false)
// Use it!
const onLogin = async () => {
  loading.value = true
  try {
    const result = await store.login({
      email: email.value,
      password: password.value
    } as AuthRequest)

    loading.value = false
    if (result) {
      toast('Login success!');
      if (store.lastPath) {
        router.push(store.lastPath).then(() => {
          store.setLastPath('')
        })
      } else {
        router.push('/').then()
      }
      return
    }
    toast.error('Login failed!');
  } catch (e) {
    loading.value = false
    toast.error('Login failed!');
  }
}

onMounted(() => {
  if (store.isAuth) {
    router.push('/').then()
  }
});
</script>

<template>
  <div class="flex flex-col gap-2 items-center w-full justify-center">
    <div class="card lg:card-side bg-base-100 shadow-xl">
<!--      <figure>-->
<!--        <img src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg" alt="Album" />-->
<!--      </figure>-->
      <div class="card-body">
        <h2 class="card-title">Login page!</h2>
        <label class="input input-bordered flex items-center gap-2">
          <Icon>
            <EmailIcon />
          </Icon>
          <input type="text" class="grow" placeholder="Email" v-model="email" @keyup.enter="onLogin" :disabled="loading" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <Icon>
            <KeyIcon />
          </Icon>
          <input type="password" class="grow" value="password" v-model="password" @keyup.enter="onLogin" :disabled="loading" />
        </label>
        <div class="card-actions justify-end mt-4">
          <button class="btn btn-primary" @click="onLogin" :disabled="loading">
            <span v-if="!loading">Login</span>
            <span v-else class="loading loading-white"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
