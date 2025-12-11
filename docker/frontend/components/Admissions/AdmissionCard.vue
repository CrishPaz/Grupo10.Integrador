<template>
  <div 
    class="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    :class="{'border-l-4': true, [statusBorderColor]: true}"
  >
    <div class="p-4">
      <div class="flex justify-between items-start">
        <div class="flex-1 min-w-0">
          <div class="flex items-center mb-1">
             <h4 class="text-base font-semibold text-gray-900 truncate">
              {{ admission.paciente.nombres }} {{ admission.paciente.apellidos }}
            </h4>
          </div>
          <p class="text-sm text-gray-500 mb-2">
            Generic DNI: {{ admission.paciente.dni }}
          </p>
          
          <div v-if="admission.empresa" class="flex items-center text-sm text-gray-600 mb-2">
            <BuildingOfficeIcon class="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" />
            <span class="truncate">{{ admission.empresa.razon_social }}</span>
          </div>

          <div class="flex items-center text-sm text-gray-600">
            <ClipboardDocumentListIcon class="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" />
            <span class="truncate">{{ admission.tipo_examen }}</span>
          </div>
        </div>

        <div class="ml-4 flex-shrink-0 flex flex-col items-end">
          <span 
            class="px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mb-2"
            :class="statusBadgeClass"
          >
            {{ admission.estado }}
          </span>
          <span class="text-xs text-gray-400 flex items-center">
            <CalendarIcon class="h-3 w-3 mr-1" />
            {{ formatDate(admission.fecha_programada) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BuildingOfficeIcon, ClipboardDocumentListIcon, CalendarIcon } from '@heroicons/vue/24/outline'

interface Admission {
  id: string
  paciente: { nombres: string, apellidos: string, dni: string }
  empresa?: { razon_social: string }
  tipo_examen: string
  estado: string
  fecha_programada: string
}

const props = defineProps<{
  admission: Admission
}>()

const statusColors = {
  programado: 'blue',
  completado: 'green',
  cancelado: 'red',
  pendiente: 'yellow'
}

const statusBorderColor = computed(() => {
  const color = statusColors[props.admission.estado as keyof typeof statusColors] || 'gray'
  return `border-l-${color}-500`
})

const statusBadgeClass = computed(() => {
  const color = statusColors[props.admission.estado as keyof typeof statusColors] || 'gray'
  return `bg-${color}-100 text-${color}-800`
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
