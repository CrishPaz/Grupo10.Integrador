<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h3>Interfaz de Equipo</h3>
      <p class="text-sm text-gray-500 mb-4">Simulación de conexión con equipo {{ equipmentId }}</p>
      <button @click="$emit('close')" class="bg-blue-500 text-white px-4 py-2 rounded w-full">Cerrar</button>
    </div>
  </div>
</template>
<script setup>defineProps(['show', 'equipmentId', 'testId'])</script>