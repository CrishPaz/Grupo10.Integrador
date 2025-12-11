<template>
  <div class="bg-white dark:bg-gray-800 overflow-hidden shadow dark:shadow-gray-900/50 rounded-lg">
    <div class="p-5">
      <div class="flex items-center">
        <div class="flex-shrink-0 rounded-md p-3" :class="`bg-${color}-100 dark:bg-${color}-900/30`">
          <span class="text-2xl" :class="`text-${color}-600 dark:text-${color}-400`">{{ iconMap[icon] || '📊' }}</span>
        </div>
        <div class="ml-5 w-0 flex-1">
          <dl>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{{ title }}</dt>
            <dd class="flex items-baseline">
              <div class="text-2xl font-semibold text-gray-900 dark:text-gray-100">{{ value }}</div>
              <div v-if="change" class="ml-2 flex items-baseline text-sm font-semibold" 
                   :class="change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                {{ change }}
              </div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['title', 'value', 'change', 'icon', 'color'])
const iconMap = {
  'users': '👥',
  'user-group': '🧑‍🤝‍🧑',
  'currency-dollar': '💰',
  'clock': '⏱️'
}
</script>