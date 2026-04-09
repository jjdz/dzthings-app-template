<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppBar from './AppBar.vue'
import NavDrawer from './NavDrawer.vue'
import LogViewer from './LogViewer.vue'

const drawerOpen = ref(false)
const logsOpen = ref(false)
</script>

<template>
  <div class="flex flex-col" style="height: 100dvh; overflow: hidden">
    <AppBar
      @toggle-drawer="drawerOpen = !drawerOpen"
      @toggle-logs="logsOpen = !logsOpen"
    />
    <div class="flex flex-1 overflow-hidden">
      <NavDrawer :open="drawerOpen" @close="drawerOpen = false" />
      <div class="flex flex-col flex-1 overflow-hidden">
        <main class="flex-1 overflow-y-auto">
          <RouterView />
        </main>
        <LogViewer
          v-if="logsOpen"
          class="h-48 shrink-0"
        />
      </div>
    </div>
  </div>
</template>
