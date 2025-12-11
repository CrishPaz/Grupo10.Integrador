<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h3 class="font-bold text-lg mb-4">Actualizar Estado</h3>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Nuevo Estado</label>
        <select v-model="form.nuevo_estado" class="w-full border rounded p-2">
          <option value="MUESTRA_ENVIADA">Muestra Enviada</option>
          <option value="MUESTRA_RECIBIDA">Muestra Recibida</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="COMPLETADO">Completado</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">Observaciones</label>
        <textarea v-model="form.observaciones" class="w-full border rounded p-2" rows="3"></textarea>
      </div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('cancelar')" class="px-4 py-2 border rounded">Cancelar</button>
        <button @click="guardar" class="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['seguimiento'])
const emit = defineEmits(['guardar', 'cancelar'])
const form = ref({ nuevo_estado: '', observaciones: '' })

const guardar = () => {
  emit('guardar', { ...form.value, seguimiento_id: props.seguimiento.id })
}
</script>