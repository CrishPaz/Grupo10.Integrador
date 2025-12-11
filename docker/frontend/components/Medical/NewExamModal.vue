<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-bold mb-4">Registrar Nuevo Examen</h3>
      <p class="text-sm text-gray-500 mb-4">Seleccione el tipo de examen a realizar.</p>
      <div class="grid gap-2">
        <button class="bg-blue-50 text-blue-700 py-2 rounded hover:bg-blue-100" @click="createExam('audiometria')">Audiometría</button>
        <button class="bg-blue-50 text-blue-700 py-2 rounded hover:bg-blue-100" @click="createExam('espirometria')">Espirometría</button>
      </div>
      <button @click="$emit('close')" class="mt-4 w-full border py-2 rounded">Cancelar</button>
    </div>
  </div>
</template>
<script setup>
defineProps(['show'])
const emit = defineEmits(['close', 'exam-selected'])
const createExam = (type) => {
  emit('exam-selected', type)
  emit('close')
}
</script>