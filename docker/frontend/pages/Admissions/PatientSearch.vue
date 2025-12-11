<template>
  <div class="relative">
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
      </div>
      <input
        v-model="searchTerm"
        @input="debouncedSearch"
        type="text"
        placeholder="Buscar por DNI o nombre del paciente..."
        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>

    <div v-if="showResults && results.length > 0" class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-96 overflow-auto">
      <ul class="py-1">
        <li v-for="patient in results" :key="patient.id">
          <button
            @click="selectPatient(patient)"
            class="w-full text-left px-4 py-3 hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ patient.nombres }} {{ patient.apellidos }}</p>
                <div class="flex items-center mt-1 text-sm text-gray-500">
                  <span class="mr-4">DNI: {{ patient.dni }}</span>
                  <span v-if="patient.empresa">Empresa: {{ patient.empresa.razon_social }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getPatientStatusClass(patient.ultimo_estado)">
                  {{ getPatientStatusLabel(patient.ultimo_estado) }}
                </span>
                <ChevronRightIcon class="ml-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <div v-if="showResults && results.length === 0 && searchTerm.length >= 3" class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 p-4">
      <p class="text-sm text-gray-500 text-center">No se encontraron pacientes</p>
      <button
        @click="registerNewPatient"
        class="mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Registrar Nuevo Paciente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { MagnifyingGlassIcon, ChevronRightIcon, PlusIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['patient-selected'])

interface Patient {
  id: string
  dni: string
  nombres: string
  apellidos: string
  empresa?: { razon_social: string }
  ultimo_estado?: string
}

const searchTerm = ref('')
const results = ref<Patient[]>([])
const loading = ref(false)
const showResults = ref(false)
let searchTimeout: any = null // Usamos 'any' para evitar líos con tipos de Node vs Window

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (searchTerm.value.length < 2) {
    results.value = []
    showResults.value = false
    return
  }

  loading.value = true
  
  // Búsqueda real conectada al backend
  searchTimeout = setTimeout(async () => {
    try {
        const response = await $fetch<Patient[]>('/api/patients/search', {
          params: { q: searchTerm.value }
        })
        
        results.value = response
        showResults.value = true
    } catch (error) {
      console.error('Error buscando:', error)
      results.value = []
    } finally {
      loading.value = false
    }
  }, 300)
}

const selectPatient = (patient: Patient) => {
  emit('patient-selected', patient)
  searchTerm.value = ''
  results.value = []
  showResults.value = false
}

const registerNewPatient = () => {
  // Navegación simple
  // navigateTo('/admissions/new?newPatient=true')
  console.log('Registrar nuevo')
}

const getPatientStatusClass = (status?: string) => {
  switch (status) {
    case 'completado': return 'bg-green-100 text-green-800'
    case 'programado': return 'bg-blue-100 text-blue-800'
    case 'en_proceso': return 'bg-yellow-100 text-yellow-800'
    case 'cancelado': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const getPatientStatusLabel = (status?: string) => {
  switch (status) {
    case 'completado': return 'Completado'
    case 'programado': return 'Programado'
    case 'en_proceso': return 'En Proceso'
    case 'cancelado': return 'Cancelado'
    default: return 'Sin historial'
  }
}

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>