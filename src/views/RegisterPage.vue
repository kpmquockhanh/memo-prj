<script setup lang="ts">
import EmailIcon from '@vicons/ionicons5/Mail'
import Tag from '@vicons/fluent/ContactCard24Filled'
import KeyIcon from '@vicons/ionicons5/Key'
import { Icon } from '@vicons/utils'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

const password = ref('')
const email = ref('')
const name = ref('')

const auth = useAuthStore()
const toast = useToast()
const router = useRouter()
const onSubmit = async () => {
  const result = await auth.register({
    name: name.value,
    email: email.value,
    password: password.value,
  })

  if (result) {
    toast('Login success!');
    router.push('/').then()
    return
  }
  toast.error('Register failed!');
}

const isValid = computed(() => {
  return email.value && password.value && name.value
})
</script>

<template>
  <div class="flex flex-col gap-2 items-center w-full justify-center">
    <div class="card lg:card-side bg-base-100 shadow-xl">
      <figure>
        <img src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg" alt="Album"/>
      </figure>
      <div class="card-body">
        <h2 class="card-title">Welcome to my page!</h2>
        <label class="input input-bordered flex items-center gap-2">
          <Icon>
            <Tag />
          </Icon>
          <input type="text" class="grow" placeholder="Name" v-model="name" autocomplete="off" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <Icon>
            <EmailIcon />
          </Icon>
          <input type="text" class="grow" placeholder="Email" v-model="email" autocomplete="off" />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <Icon>
            <KeyIcon />
          </Icon>
          <input type="password" class="grow" value="password" placeholder="password" v-model="password" autocomplete="off" />
        </label>
        <div class="card-actions justify-end mt-4">
          <button :disabled="!isValid" class="btn btn-primary" @click="onSubmit">Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
