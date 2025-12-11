<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold">Historial de Seguimiento</h3>
      <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-700">✕</button>
    </div>
    
    <div class="relative pl-4 border-l-2 border-gray-200 space-y-8">
      <div v-for="(evento, index) in eventos" :key="index" class="relative">
        <div class="absolute -left-6 bg-blue-500 h-4 w-4 rounded-full border-2 border-white"></div>
        <div>
          <p class="text-sm font-bold text-gray-900">{{ evento.estado }}</p>
          <p class="text-xs text-gray-500">{{ evento.fecha }}</p>
          <p class="text-sm text-gray-700 mt-1">{{ evento.observaciones }}</p>
          <p class="text-xs text-gray-400 mt-1">Por: {{ evento.responsable }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['seguimientoId'])
// Simulación de datos
const eventos = ref([
  { estado: 'PROGRAMADO', fecha: '2023-10-25 08:00', observaciones: 'Cita creada', responsable: 'Admin' },
  { estado: 'MUESTRA_TOMADA', fecha: '2023-10-25 08:30', observaciones: 'Toma de sangre exitosa', responsable: 'Enfermera' }
])
</script>