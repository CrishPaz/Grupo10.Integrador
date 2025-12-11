<template>
  <div>
    <!-- Global Theme Toggle Button -->
    <ThemeToggle />
    
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const { initTheme } = useTheme()

onMounted(() => {
  initTheme()
})
</script>
