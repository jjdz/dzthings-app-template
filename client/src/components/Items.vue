<script setup>
import { ref, onMounted } from 'vue'

const items = ref([])
const newName = ref('')
const error = ref('')

async function load() {
  const res = await fetch('/api/items')
  items.value = await res.json()
}

async function add() {
  if (!newName.value.trim()) return
  const res = await fetch('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName.value.trim() })
  })
  if (!res.ok) { error.value = (await res.json()).error; return }
  newName.value = ''
  error.value = ''
  await load()
}

async function remove(id) {
  await fetch(`/api/items/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(load)
</script>

<template>
  <div>
    <form @submit.prevent="add" style="display: flex; gap: 0.5rem; margin-bottom: 1rem">
      <input v-model="newName" placeholder="New item" style="flex: 1; padding: 0.4rem" />
      <button type="submit">Add</button>
    </form>
    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="!items.length" style="color: #888">No items yet.</p>
    <ul style="list-style: none; padding: 0">
      <li
        v-for="item in items"
        :key="item.id"
        style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid #eee"
      >
        <span>{{ item.name }}</span>
        <button @click="remove(item.id)" style="color: red">Delete</button>
      </li>
    </ul>
  </div>
</template>
