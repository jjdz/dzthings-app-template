import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import router from './router/index.js'
import App from './App.vue'
import { setUnauthorizedHandler } from './api.js'
import { useThemeStore } from './stores/theme.js'
import { useAuthStore } from './stores/auth.js'
import 'primeicons/primeicons.css'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: { darkModeSelector: '.dark' },
  },
})

// Apply persisted theme before first render to avoid flash
useThemeStore().apply()

// Wire 401 → logout + redirect
const auth = useAuthStore()
setUnauthorizedHandler(() => {
  auth.user = null
  router.push('/login')
})

app.mount('#app')
