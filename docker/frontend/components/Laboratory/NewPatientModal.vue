<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg">
      <h3>Registro Rápido de Paciente</h3>
      <p class="text-sm text-gray-500 mb-4">Formulario simplificado para laboratorio.</p>
      <button @click="$emit('close')" class="bg-red-500 text-white px-4 py-2 rounded">Cerrar</button>
    </div>
  </div>
</template>
<script setup>defineProps(['show'])</script>