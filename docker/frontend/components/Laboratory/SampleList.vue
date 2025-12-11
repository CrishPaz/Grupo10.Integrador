<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Paciente</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
        <tr v-for="sample in samples" :key="sample.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{{ sample.codigo_muestra }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{{ sample.paciente }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{{ sample.tipo_muestra }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" 
              :class="{
                'bg-green-100 text-green-800': sample.estado === 'completado',
                'bg-yellow-100 text-yellow-800': sample.estado === 'pendiente',
                'bg-blue-100 text-blue-800': sample.estado === 'procesando',
                'bg-red-100 text-red-800': sample.estado === 'rechazado'
              }">
              {{ sample.estado }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
            {{ new Date(sample.fecha).toLocaleDateString() }} {{ new Date(sample.fecha).toLocaleTimeString() }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex items-center justify-end space-x-2">
              <select 
                @change="(e) => updateStatus(sample.id, (e.target as HTMLSelectElement).value)"
                :value="sample.estado"
                @click.stop
                class="block w-32 pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-xs rounded-md"
              >
                <option value="pendiente">Pendiente</option>
                <option value="procesando">Procesando</option>
                <option value="completado">Completado</option>
                <option value="rechazado">Rechazado</option>
              </select>
              <button 
                @click="processSample(sample.id)"
                title="Ver detalles"
                class="text-gray-400 hover:text-gray-500"
              >
                <MagnifyingGlassIcon class="h-5 w-5" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="!samples || samples.length === 0">
          <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            No hay muestras recientes.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  samples: {
    type: Array as () => any[],
    default: () => []
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-status'])

const processSample = (id: string) => {
  navigateTo(`/laboratory/process/${id}`)
}

const updateStatus = (id: string, status: string) => {
  emit('update-status', { id, status })
}
</script>