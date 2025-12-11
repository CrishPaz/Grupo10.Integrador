<template>
  <NuxtLink 
    :to="to"
    class="flex items-center px-3 py-2 text-sm rounded-lg transition-colors group"
    :class="[
      isActive 
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
  >
    <component 
      :is="iconComponent" 
      v-if="icon" 
      class="w-5 h-5 mr-3"
      :class="isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'" 
    />
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import * as HeroIcons from '@heroicons/vue/24/outline'

const props = defineProps<{
  to: string
  icon?: string
  disabled?: boolean
}>()

const route = useRoute()
const isActive = computed(() => route.path.startsWith(props.to))

// Mapeo dinámico de nombres de iconos (ej: 'dashboard' -> 'Squares2X2Icon')
const iconComponent = computed(() => {
  if (!props.icon) return null
  
  // Mapa simple de nombres comunes a componentes Heroicons
  const iconMap: Record<string, any> = {
    'dashboard': HeroIcons.Squares2X2Icon,
    'clipboard-document-list': HeroIcons.ClipboardDocumentListIcon,
    'users': HeroIcons.UsersIcon,
    'user-group': HeroIcons.UserGroupIcon,
    'building-office': HeroIcons.BuildingOfficeIcon,
    'clock': HeroIcons.ClockIcon,
    'document-text': HeroIcons.DocumentTextIcon,
    'beaker': HeroIcons.BeakerIcon,
    'document-check': HeroIcons.DocumentCheckIcon,
    'chart-bar': HeroIcons.ChartBarIcon,
    'archive-box': HeroIcons.ArchiveBoxIcon,
    'document-arrow-up': HeroIcons.DocumentArrowUpIcon,
    'cloud-arrow-up': HeroIcons.CloudArrowUpIcon,
    'cpu-chip': HeroIcons.CpuChipIcon,
    'currency-dollar': HeroIcons.CurrencyDollarIcon,
    'fingerprint': HeroIcons.FingerPrintIcon,
    'cog-6-tooth': HeroIcons.Cog6ToothIcon,
    'calendar': HeroIcons.CalendarIcon,
    'folder': HeroIcons.FolderIcon,
    'credit-card': HeroIcons.CreditCardIcon
  }
  
  return iconMap[props.icon] || HeroIcons.QuestionMarkCircleIcon
})
</script>