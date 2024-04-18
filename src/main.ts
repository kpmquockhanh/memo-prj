import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initApp } from '@/bootstrap'
import Toast from "vue-toastification";

import '@assets/app.scss'
import "vue-toastification/dist/index.css";
import VueLazyLoad from 'vue3-lazyload'
import { fullscreenImagePlugin } from 'vue-3-fullscreen-image-directive-plugin'
import 'vue-3-fullscreen-image-directive-plugin/style.css'

const app = createApp(App)

app.use(Toast, {
  position: "bottom-right",
});
app.use(createPinia())
app.use(router)
app.use(VueLazyLoad, {
  // options...
})
app.use(fullscreenImagePlugin)

initApp().then(() => {
  app.mount('#app')
})

