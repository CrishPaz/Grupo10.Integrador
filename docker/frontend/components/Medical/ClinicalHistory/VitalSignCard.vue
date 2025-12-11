<template>
  <div class="border rounded-md p-3 text-center bg-gray-50">
    <div class="text-xs text-gray-500 uppercase font-bold mb-1">{{ label }}</div>
    <div class="flex items-center justify-center space-x-1">
      <component :is="iconComponent" class="h-4 w-4 text-gray-400" />
      <span class="text-xl font-bold text-gray-900">{{ value || '-' }}</span>
      <span class="text-xs text-gray-500">{{ unit }}</span>
    </div>
    <div v-if="interpretation" class="text-xs mt-1 font-medium" :class="interpretationColor">
      {{ interpretation }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { HeartIcon, FireIcon, ArrowTrendingUpIcon, ScaleIcon, UserIcon, ChartBarIcon } from '@heroicons/vue/24/outline'

const props = defineProps(['label', 'value', 'unit', 'icon', 'interpretation'])

const icons = {
  HeartIcon, FireIcon, ArrowTrendingUpIcon, ScaleIcon, UserIcon, ChartBarIcon
}

const iconComponent = computed(() => icons[props.icon] || HeartIcon)

const interpretationColor = computed(() => {
  if (!props.interpretation) return ''
  if (props.interpretation.includes('Obesidad') || props.interpretation.includes('Hiper')) return 'text-red-600'
  if (props.interpretation.includes('Sobrepeso')) return 'text-yellow-600'
  return 'text-green-600'
})
</script>