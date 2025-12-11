<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg w-1/2">
      <h3 class="text-lg font-bold mb-4">Registrar Examen</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Tipo de Examen</label>
          <select v-model="form.tipo_examen" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3">
            <option value="audiometria">Audiometría</option>
            <option value="optometria">Optometría</option>
            <option value="laboratorio">Laboratorio</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Interpretación</label>
          <textarea v-model="form.interpretacion" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Recomendaciones</label>
          <textarea v-model="form.recomendaciones" rows="2" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3"></textarea>
        </div>
      </div>

      <div class="mt-6 flex justify-end space-x-3">
        <button @click="$emit('close')" class="px-4 py-2 border rounded text-gray-700">Cancelar</button>
        <button @click="save" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps(['show', 'exam'])
const emit = defineEmits(['close', 'saved'])

const form = ref({
  tipo_examen: 'audiometria',
  interpretacion: '',
  recomendaciones: ''
})

const save = () => {
  emit('saved') // Simulamos guardado
}
</script>