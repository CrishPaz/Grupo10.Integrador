<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <AppHeader />
    
    <div class="flex flex-1 overflow-hidden">
      <AppSidebar />
      
      <main class="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-800">
        <div class="max-w-7xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/Layout/AppHeader.vue'
import AppSidebar from '~/components/Layout/AppSidebar.vue'
</script>