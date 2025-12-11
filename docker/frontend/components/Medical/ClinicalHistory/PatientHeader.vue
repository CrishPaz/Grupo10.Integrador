<template>
  <div class="bg-white shadow rounded-lg p-6 mb-6 relative">
    <button @click="$emit('close')" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
      ✕
    </button>
    <div class="flex items-center">
      <div class="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
        {{ patient.nombres.charAt(0) }}{{ patient.apellidos.charAt(0) }}
      </div>
      <div class="ml-6">
        <h2 class="text-2xl font-bold text-gray-900">{{ patient.nombres }} {{ patient.apellidos }}</h2>
        <p class="text-gray-500">DNI: {{ patient.dni }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps(['patient'])
</script>