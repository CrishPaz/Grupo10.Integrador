<template>
  <div class="border rounded-md p-3" :class="color">
    <h6 class="text-xs font-bold uppercase mb-2 opacity-75">{{ title }}</h6>
    <div class="flex flex-wrap gap-1">
      <span v-for="risk in risks" :key="risk" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-white bg-opacity-50">
        {{ risk }}
      </span>
    </div>
  </div>
</template>
<script setup>
defineProps(['title', 'risks', 'color'])
</script>