<template>
  <div class="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
    <div class="w-64 h-48 bg-black rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
      <div v-if="scanning" class="absolute inset-0 border-4 border-green-500 animate-pulse"></div>
      <span class="text-white">📸 Cámara Web</span>
    </div>
    <button @click="startScan" :disabled="scanning" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
      {{ scanning ? 'Capturando...' : 'Capturar Rostro' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['capture', 'quality'])
const scanning = ref(false)

const startScan = () => {
  scanning.value = true
  setTimeout(() => {
    scanning.value = false
    const mockTemplate = "TEMPLATE_FACIAL_SIMULADO_" + Date.now()
    emit('capture', { template: mockTemplate, quality: 88 })
    emit('quality', 88)
  }, 2500)
}
</script>