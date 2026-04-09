import { defineStore } from 'pinia'
import { ref } from 'vue'
import { get, post } from '../api.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  async function login(username, password) {
    const data = await post('/api/auth/login', { username, password })
    user.value = data.user
  }

  async function logout() {
    try { await post('/api/auth/logout') } catch {}
    user.value = null
  }

  async function checkAuth() {
    try {
      const data = await get('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    }
  }

  return { user, login, logout, checkAuth }
})
