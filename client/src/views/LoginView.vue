<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-dvh flex items-center justify-center bg-surface-50 dark:bg-surface-950 p-4">
    <div class="w-full max-w-sm">
      <h1 class="text-2xl font-bold text-center mb-8">Sign in</h1>
      <form @submit.prevent="submit" class="flex flex-col gap-4">
        <InputText
          v-model="username"
          placeholder="Username"
          class="w-full"
          autofocus
          autocomplete="username"
        />
        <InputText
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full"
          autocomplete="current-password"
        />
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        <Button
          type="submit"
          label="Sign in"
          :loading="loading"
          class="w-full"
        />
      </form>
    </div>
  </div>
</template>
