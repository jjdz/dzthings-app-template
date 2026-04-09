<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Drawer from 'primevue/drawer'
import { Icon } from '@iconify/vue'

const props = defineProps({ open: Boolean })
const emit = defineEmits(['close'])

const isDesktop = ref(false)

function checkWidth() { isDesktop.value = window.innerWidth >= 768 }
onMounted(() => { checkWidth(); window.addEventListener('resize', checkWidth) })
onUnmounted(() => window.removeEventListener('resize', checkWidth))

// Two-way binding for PrimeVue Drawer
const visible = computed({
  get: () => props.open,
  set: (v) => { if (!v) emit('close') },
})

const navItems = [
  { label: 'Items', to: '/items', icon: 'mdi:list-box-outline' },
]
</script>

<template>
  <!-- Mobile slide-over -->
  <Drawer v-if="!isDesktop" v-model:visible="visible" style="width: 16rem">
    <template #header>
      <span class="font-semibold">Navigation</span>
    </template>
    <nav class="flex flex-col gap-1 pt-2">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        @click="emit('close')"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
        active-class="bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
      >
        <Icon :icon="item.icon" class="text-lg shrink-0" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </Drawer>

  <!-- Desktop persistent sidebar -->
  <aside v-else class="w-52 shrink-0 border-r border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 overflow-y-auto">
    <nav class="flex flex-col gap-1 p-3">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium transition-colors"
        active-class="bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400"
      >
        <Icon :icon="item.icon" class="text-lg shrink-0" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
