<script setup>
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../stores/auth.js'
import { useThemeStore } from '../stores/theme.js'
import { useRouter } from 'vue-router'

/* global __APP_VERSION__ */
const version = __APP_VERSION__
const auth = useAuthStore()
const theme = useThemeStore()
const router = useRouter()
const emit = defineEmits(['toggle-drawer', 'toggle-logs'])

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>

<template>
  <header class="flex items-center h-14 px-3 gap-2 shrink-0 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 z-20">
    <button @click="emit('toggle-drawer')" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
      <Icon icon="mdi:menu" class="text-xl" />
    </button>

    <span class="font-semibold flex-1 truncate">dzthings app</span>

    <span class="text-xs text-surface-400 font-mono hidden sm:inline">v{{ version }}</span>

    <button @click="emit('toggle-logs')" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800" title="Logs">
      <Icon icon="mdi:console" class="text-xl" />
    </button>

    <button @click="theme.toggle()" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800" title="Toggle theme">
      <Icon :icon="theme.isDark ? 'mdi:weather-sunny' : 'mdi:weather-night'" class="text-xl" />
    </button>

    <span v-if="auth.user" class="text-sm text-surface-500 hidden sm:inline">{{ auth.user.username }}</span>

    <button @click="handleLogout" class="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800" title="Logout">
      <Icon icon="mdi:logout" class="text-xl" />
    </button>
  </header>
</template>
