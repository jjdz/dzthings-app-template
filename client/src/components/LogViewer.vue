<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Icon } from '@iconify/vue'

const logs = ref([])
const container = ref(null)
let es = null

const levelClass = {
  info:  'text-blue-400',
  warn:  'text-yellow-400',
  error: 'text-red-400',
}

function connect() {
  es = new EventSource('/api/logs/stream', { withCredentials: true })
  es.onmessage = async (e) => {
    try {
      logs.value.push(JSON.parse(e.data))
      await nextTick()
      if (container.value) container.value.scrollTop = container.value.scrollHeight
    } catch {}
  }
  es.onerror = () => {
    es?.close()
    es = null
  }
}

onMounted(connect)
onUnmounted(() => es?.close())
</script>

<template>
  <div class="flex flex-col bg-surface-900 dark:bg-surface-950 text-surface-100 text-xs font-mono">
    <div class="flex items-center gap-2 px-3 py-1 border-b border-surface-700 shrink-0">
      <Icon icon="mdi:console" class="text-sm" />
      <span class="text-surface-400">server logs</span>
      <span class="ml-auto text-surface-600">{{ logs.length }} lines</span>
    </div>
    <div ref="container" class="flex-1 overflow-y-auto p-2 space-y-0.5">
      <div v-for="(entry, i) in logs" :key="i" class="flex gap-2 leading-5">
        <span class="text-surface-600 shrink-0">{{ entry.timestamp?.slice(11, 19) }}</span>
        <span :class="levelClass[entry.level] || 'text-surface-400'" class="w-10 shrink-0">{{ entry.level }}</span>
        <span class="text-surface-200 break-all">{{ entry.message }}</span>
      </div>
      <div v-if="!logs.length" class="text-surface-600 p-2">Waiting for logs…</div>
    </div>
  </div>
</template>
