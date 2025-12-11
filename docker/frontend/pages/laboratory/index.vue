<template>
  <LaboratoryLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
              Laboratorio Clínico
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Gestión del flujo de trabajo de análisis</p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button @click="showSampleReception = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <PlusIcon class="h-4 w-4 mr-2" /> Recepción de Muestra
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Muestras Hoy" :value="stats.muestras_hoy" icon="BeakerIcon" color="bg-blue-500" />
          <StatCard title="Pendientes" :value="stats.pendientes" icon="ClockIcon" color="bg-yellow-500" />
          <StatCard title="Completados" :value="stats.completados" icon="CheckCircleIcon" color="bg-green-500" />
          <StatCard title="Tiempo Promedio" :value="stats.tiempo_promedio" unit="min" icon="ClockIcon" color="bg-purple-500" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Flujo de Trabajo</h3>
              </div>
              <LabWorkflow />
            </div>

            <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Muestras Recientes</h3>
              </div>
              <SampleList :samples="recentSamples" @update-status="updateSampleStatus" />
            </div>
          </div>

          <div class="space-y-6">
            <!-- Sección de Estado de Equipos (Deshabilitada temporalmente)
            <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Estado de Equipos</h3>
              <div class="space-y-3">
                <div v-for="eq in equipmentStatus" :key="eq.id" class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                  <div class="flex items-center">
                    <div class="h-3 w-3 rounded-full mr-2" :class="eq.estado === 'activo' ? 'bg-green-500' : 'bg-red-500'"></div>
                    <span class="font-medium dark:text-gray-100">{{ eq.nombre }}</span>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ eq.pruebas_hoy }} pruebas</span>
                </div>
              </div>
            </div>
            -->
          </div>
        </div>
      </div>

      <SampleReceptionModal :show="showSampleReception" @close="showSampleReception = false" />
      <PendingTestsModal :show="showPendingTests" @close="showPendingTests = false" />
    </div>
  </LaboratoryLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, ClockIcon, CheckCircleIcon, BeakerIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import LaboratoryLayout from '~/components/LaboratoryLayout.vue'
import StatCard from '~/components/Laboratory/StatCard.vue'
import LabWorkflow from '~/components/Laboratory/LabWorkflow.vue'
import SampleList from '~/components/Laboratory/SampleList.vue'
import SampleReceptionModal from '~/components/Laboratory/SampleReceptionModal.vue'
import PendingTestsModal from '~/components/Laboratory/PendingTestsModal.vue'
import { useToast } from '~/composables/useToast'

// Tipos (simplificados para que compile)
interface LabStats { muestras_hoy: number; pendientes: number; completados: number; tiempo_promedio: number }

// Definimos interfaces para los tipos
interface Equipment {
  id: string;
  nombre: string;
  estado: string;
  pruebas_hoy: number;
}

const stats = ref<LabStats>({ muestras_hoy: 0, pendientes: 0, completados: 0, tiempo_promedio: 0 })
const recentSamples = ref<any[]>([])
const equipmentStatus = ref<Equipment[]>([])
const showSampleReception = ref(false)
const showPendingTests = ref(false)
const toast = useToast()

const loadDashboardData = async () => {
  try {
    const data = await $fetch<{ stats: LabStats, recentSamples: any[], equipmentStatus: Equipment[] }>('/api/laboratory/dashboard')
    stats.value = data.stats
    recentSamples.value = data.recentSamples
    equipmentStatus.value = data.equipmentStatus
  } catch (error) {
    console.error('Error loading lab dashboard:', error)
  }
}

const updateSampleStatus = async ({ id, status }: { id: string, status: string }) => {
  try {
    await $fetch(`/api/laboratory/samples/${id}/status`, {
      method: 'PATCH',
      body: { estado: status }
    })
    toast.success(`Estado actualizado a ${status}`)
    await loadDashboardData()
  } catch (error: any) {
    console.error('Error update sample status:', error)
    toast.error('Error actualizando estado')
  }
}

onMounted(() => {
  loadDashboardData()
})

definePageMeta({ middleware: ['auth'] })
</script>