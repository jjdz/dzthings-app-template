<script setup>
import { ref, onMounted } from 'vue'
import { get, post, del } from '../api.js'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import { Icon } from '@iconify/vue'

const items = ref([])
const newName = ref('')
const addLoading = ref(false)
const error = ref('')

async function load() {
  try { items.value = await get('/api/items') }
  catch (e) { error.value = e.message }
}

async function add() {
  if (!newName.value.trim()) return
  addLoading.value = true
  error.value = ''
  try {
    await post('/api/items', { name: newName.value.trim() })
    newName.value = ''
    await load()
  } catch (e) {
    error.value = e.message
  } finally {
    addLoading.value = false
  }
}

async function remove(id) {
  try { await del(`/api/items/${id}`); await load() }
  catch (e) { error.value = e.message }
}

onMounted(load)
</script>

<template>
  <div class="p-4 max-w-2xl">
    <h1 class="text-xl font-semibold mb-4">Items</h1>

    <form @submit.prevent="add" class="flex gap-2 mb-4">
      <InputText v-model="newName" placeholder="New item" class="flex-1" />
      <Button type="submit" label="Add" :loading="addLoading" />
    </form>

    <p v-if="error" class="text-red-500 text-sm mb-3">{{ error }}</p>

    <p v-if="!items.length" class="text-surface-400 text-sm">No items yet.</p>

    <ul class="space-y-2">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between p-3 rounded-lg border border-surface-200 dark:border-surface-700"
      >
        <span class="text-sm">{{ item.name }}</span>
        <button
          @click="remove(item.id)"
          class="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <Icon icon="mdi:trash-can-outline" class="text-base" />
        </button>
      </li>
    </ul>
  </div>
</template>
