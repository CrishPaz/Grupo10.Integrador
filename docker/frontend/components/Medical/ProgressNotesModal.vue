<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg w-1/2 h-2/3 overflow-auto">
      <h3 class="text-lg font-bold mb-4">Historial de Notas</h3>
      <p class="text-center text-gray-500 py-10">Aquí se mostrarán todas las notas de evolución.</p>
      <button @click="$emit('close')" class="mt-4 w-full bg-indigo-600 text-white py-2 rounded">Cerrar</button>
    </div>
  </div>
</template>
<script setup>
defineProps(['show'])
</script>