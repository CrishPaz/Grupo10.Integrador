<template>
  <div v-if="show" class="fixed inset-0 z-50 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg w-1/2">
      <h3 class="text-lg font-bold mb-4">Agregar Experiencia Laboral</h3>
      <div class="grid gap-4">
        <input v-model="form.puesto_trabajo" type="text" placeholder="Puesto de Trabajo" class="border p-2 rounded" />
        <input v-model="form.empresa" type="text" placeholder="Empresa" class="border p-2 rounded" />
        <div class="grid grid-cols-2 gap-4">
          <input v-model="form.fecha_inicio" type="date" class="border p-2 rounded" />
          <input v-model="form.fecha_fin" type="date" class="border p-2 rounded" />
        </div>
      </div>
      <div class="mt-6 flex justify-end gap-2">
        <button @click="$emit('close')" class="border px-4 py-2 rounded">Cancelar</button>
        <button @click="save" class="bg-indigo-600 text-white px-4 py-2 rounded">Guardar</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const props = defineProps(['show', 'workHistory'])
const emit = defineEmits(['close', 'saved'])

const form = ref({
  puesto_trabajo: '',
  empresa: '',
  fecha_inicio: '',
  fecha_fin: ''
})

const save = () => {
  // Simulamos guardado
  emit('saved')
}
</script>