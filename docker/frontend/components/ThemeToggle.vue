<template>
  <button
    @click="toggleTheme"
    class="theme-toggle-btn"
    :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
  >
    <!-- Sun Icon (Light Mode) -->
    <svg
      v-if="isDark"
      class="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>

    <!-- Moon Icon (Dark Mode) -->
    <svg
      v-else
      class="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle-btn {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  z-index: 9999;
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.dark .theme-toggle-btn {
  background: rgba(31, 41, 55, 0.9);
  border-color: rgba(255, 255, 255, 0.1);
}

.theme-toggle-btn:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.theme-toggle-btn:active {
  transform: scale(0.95);
}

.icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #667eea;
  transition: all 0.3s ease;
}

.dark .icon {
  color: #fbbf24;
}

/* Responsive */
@media (max-width: 640px) {
  .theme-toggle-btn {
    width: 3rem;
    height: 3rem;
    bottom: 1rem;
    left: 1rem;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
