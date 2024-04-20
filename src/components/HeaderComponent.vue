<script setup lang="ts">
import { computed, onMounted, type Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'
import UserIcon from '@vicons/ionicons5/PersonSharp'
import { useUser } from '@/stores/user'
import DynamicImage from '@components/DynamicImage.vue'

const menu = ref([
  {
    name: 'home',
    label: 'Home'
  },
  {
    name: 'chat-list',
    label: 'Chat'
  },
  {
    name: 'tools',
    label: 'Tools',
    children: [
      {
        name: 'randomPage',
        label: 'Random'
      },
      {
        name: 'questionPage',
        label: 'Questions'
      }
    ]
  },
]);

const accountMenu = computed(() => [
  {
    name: 'login',
    label: 'Login',
    show: !authState.isAuth
  },
  {
    name: 'register',
    label: 'Register',
    show: !authState.isAuth
  },
  {
    name: 'settings',
    label: 'Settings',
    show: authState.isAuth
  },
  {
    name: 'logout',
    label: 'Logout',
    show: authState.isAuth,
    action: onLogout,
  },
]);

const route = useRoute();
const router = useRouter();
const authState = useAuthStore();
const user = useUser();

const isOpen: Ref<Map<string, boolean>> = ref(new Map());

onMounted(() => {
  // user.fetchUser().then();
})

watch(route, () => {
  isOpen.value = new Map();
})

const onMyToggle = (e: ToggleEvent, name: string) => {
  isOpen.value.set(name, e.newState === 'open');
}

const onLogout = () => {
  authState.logout();
  router.push({
    name: 'home',
  })
}

</script>

<template>
  <div class="navbar bg-base-100 z-10">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li
            v-for="item in menu"
            :key="item.name"
            class="mb-1 last:mb-0"
          >
            <router-link
              v-if="!item.children"
              :to="{name: item.name}"
              :class="[{'active': $route.name === item.name}, 'mr-1']"
            >
              {{ item.label }}
            </router-link>
            <details
              v-else
              :open="isOpen.get(item.name)"
              @toggle="onMyToggle($event, item.name)"
            >
              <summary>
                {{ item.label }}
              </summary>
              <ul class="p-2 bg-base-100 rounded-t-none">
                <li
                  v-for="childItem in item.children"
                  :key="childItem.name"
                >
                  <router-link
                    :to="{name: childItem.name}"
                    :class="[{'active': $route.name === childItem.name}, 'mt-1']"
                  >
                    {{ childItem.label }}
                  </router-link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <router-link
        :to="{name: 'home'}"
        class="btn btn-ghost text-xl px-0"
      >
        kpmquockhanh
      </router-link>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li
          v-for="item in menu"
          :key="item.name"
        >
          <router-link
            v-if="!item.children"
            :to="{name: item.name}"
            :class="[{'active': $route.name === item.name}, 'mr-1']"
          >
            {{ item.label }}
          </router-link>
          <details
            v-else
            :open="isOpen.get(item.name)"
            @toggle="onMyToggle($event, item.name)"
          >
            <summary>
              {{ item.label }}
            </summary>
            <ul class="p-2 bg-base-100 rounded-t-none">
              <li
                v-for="childItem in item.children"
                :key="childItem.name"
              >
                <router-link
                  :to="{name: childItem.name}"
                  :class="[{'active': $route.name === childItem.name}, 'mt-1']"
                >
                  {{ childItem.label }}
                </router-link>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <div :class="['dropdown dropdown-end dropdown-hover']">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 flex items-center justify-center">
            <UserIcon v-if="!user.user?.photoUrl"/>
            <DynamicImage
              v-else
              :src="user.user?.photoUrl"
              alt="profile"
            />
          </div>
        </div>
        <ul tabindex="0" class="z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
          <li v-for="menu in accountMenu.filter((m) => m.show)" :key="menu.name" class="mb-1 last:mb-0">
            <router-link
              v-if="!menu.action"
              :to="{name: menu.name}"
              :class="[{'active': $route.name === menu.name}]"
            >
              {{ menu.label }}
            </router-link>
            <a v-else @click="menu.action">{{ menu.label }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
