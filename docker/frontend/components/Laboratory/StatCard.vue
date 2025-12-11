<template>
  <div class="bg-white rounded-lg shadow p-5 border-l-4" :class="color.replace('bg-', 'border-')">
    <div class="flex justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900">{{ value }} <span v-if="unit" class="text-sm text-gray-500">{{ unit }}</span></p>
      </div>
      <div class="p-3 rounded-md" :class="color.replace('bg-', 'bg-opacity-20 text-').replace('500', '600')">
        <span class="text-xl">📊</span>
      </div>
    </div>
  </div>
</template>
<script setup>defineProps(['title', 'value', 'icon', 'color', 'trend', 'trendLabel', 'unit'])</script>