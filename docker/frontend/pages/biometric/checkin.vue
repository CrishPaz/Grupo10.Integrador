<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
      
      <div v-if="!result">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Bienvenido</h1>
        <p class="text-gray-500 dark:text-gray-400 mb-8">Por favor, identifíquese para su cita</p>
        
        <div class="space-y-4">
          <button @click="startScan" :disabled="scanning" class="w-full py-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl flex items-center justify-center gap-4 transition-all">
            <span class="text-4xl">👆</span>
            <span class="font-bold text-blue-700 text-lg">{{ scanning ? 'Escaneando...' : 'Usar Huella Digital' }}</span>
          </button>
          
          <button class="w-full py-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 rounded-xl flex items-center justify-center gap-4 transition-all">
            <span class="text-4xl">⌨️</span>
            <span class="font-bold text-gray-700 text-lg">Ingresar DNI Manual</span>
          </button>
        </div>
      </div>

      <div v-else class="animate-fade-in">
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-4xl">✅</span>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">¡Hola, {{ result.usuario.nombres }}!</h2>
        <p class="text-green-600 dark:text-green-400 font-medium mb-6">Identificación Exitosa</p>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-left mb-6">
          <p class="text-sm text-gray-500 dark:text-gray-400">Próxima Cita:</p>
          <p class="font-bold text-lg dark:text-gray-100">Examen Médico Ocupacional</p>
          <p class="text-gray-700 dark:text-gray-300">Hoy, 10:00 AM - Consultorio 3</p>
        </div>
        
        <button @click="result = null" class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Finalizar</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const scanning = ref(false)
const result = ref(null)

const startScan = async () => {
  scanning.value = true
  
  // Simulamos el proceso de hardware
  setTimeout(async () => {
    try {
        // En producción llamaríamos a la API verify
        // const res = await $fetch('/api/biometric/verify', ...)
        
        // Simulación de éxito
        result.value = {
            usuario: { nombres: 'Juan Pérez' }
        }
    } catch (e) {
        alert('Error al identificar')
    } finally {
        scanning.value = false
    }
  }, 2000)
}

definePageMeta({ layout: false }) // Sin layout admin, pantalla completa
</script>