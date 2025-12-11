<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
              Admisiones y Turnos
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Punto de entrada para pacientes y gestión de citas
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <NuxtLink to="/admissions/calendar" class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <CalendarIcon class="h-4 w-4 mr-2" /> Calendario
            </NuxtLink>
            <NuxtLink to="/admissions/new" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <PlusIcon class="h-4 w-4 mr-2" /> Nueva Admisión
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 flex items-center">
            <div class="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"><UserIcon class="h-6 w-6" /></div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Hoy</h3>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.hoy }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 flex items-center">
            <div class="p-3 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"><ClockIcon class="h-6 w-6" /></div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Programadas</h3>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.programadas }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 flex items-center">
            <div class="p-3 rounded-md bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"><CheckCircleIcon class="h-6 w-6" /></div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Completadas</h3>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.completadas }}</p>
            </div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 flex items-center">
            <div class="p-3 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"><XCircleIcon class="h-6 w-6" /></div>
            <div class="ml-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Canceladas</h3>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.canceladas }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 mb-8">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Búsqueda Rápida</h3>
            <PatientSearch @patient-selected="handlePatientSelected" />
          </div>
          
          <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
             <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Admisiones Recientes</h3>
             <input v-model="searchQuery" type="text" placeholder="Filtrar lista..." class="border dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
          </div>

          <ul class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="admission in filteredAdmissions" :key="admission.id">
              <AdmissionCard :admission="admission" @click="viewAdmission(admission.id)" />
            </li>
            <li v-if="filteredAdmissions.length === 0" class="p-8 text-center text-gray-500 dark:text-gray-400">
              No hay admisiones para mostrar.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { PlusIcon, CalendarIcon, UserIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import PatientSearch from '~/components/Admissions/PatientSearch.vue'
import AdmissionCard from '~/components/Admissions/AdmissionCard.vue'

// Definir tipos para evitar errores rojos
interface Admission {
  id: string
  paciente: { nombres: string, apellidos: string, dni: string }
  empresa?: { razon_social: string }
  tipo_examen: string
  estado: string
  fecha_programada: string
}

// Estado
const stats = ref({ hoy: 0, programadas: 0, completadas: 0, canceladas: 0 })
const admissions = ref<Admission[]>([])
const searchQuery = ref('')

// Carga de datos simulada (mientras conectamos la API real)
onMounted(async () => {
  try {
    const data = await $fetch<{ admissions: Admission[], stats: any }>('/api/admissions')
    admissions.value = data.admissions
    stats.value = data.stats
  } catch (error) {
    console.error('Error loading admissions:', error)
  }
})

const filteredAdmissions = computed(() => {
  if (!searchQuery.value) return admissions.value
  const q = searchQuery.value.toLowerCase()
  return admissions.value.filter(a => 
    a.paciente.nombres.toLowerCase().includes(q) || 
    a.paciente.apellidos.toLowerCase().includes(q)
  )
})

const viewAdmission = (id: string) => {
  console.log('Ver admisión:', id)
  // navigateTo(`/admissions/${id}`)
}

const handlePatientSelected = (patient: any) => {
  console.log('Paciente seleccionado:', patient)
  // navigateTo(`/admissions/new?patientId=${patient.id}`)
}

definePageMeta({
  middleware: ['auth']
})
</script>