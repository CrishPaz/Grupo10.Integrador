<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h3>Control de Calidad</h3>
      <p class="text-sm text-gray-500 mb-4">Registrar control para el equipo.</p>
      <button @click="$emit('close')" class="bg-green-500 text-white px-4 py-2 rounded w-full">Guardar</button>
    </div>
  </div>
</template>
<script setup>defineProps(['show', 'equipmentId'])</script>