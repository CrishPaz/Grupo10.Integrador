<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Historia Ocupacional</h3>
      <button
        v-if="editMode"
        @click="showAddWorkHistoryModal = true"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon class="h-4 w-4 mr-2" />
        Agregar Puesto
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 mx-auto border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      <p class="mt-2 text-gray-600">Cargando historia ocupacional...</p>
    </div>

    <div v-else-if="workHistory.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <BriefcaseIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Sin historial laboral</h3>
      <p class="mt-1 text-sm text-gray-500">No hay información de puestos de trabajo registrados.</p>
    </div>

    <div v-else class="space-y-4">
      <div class="flow-root">
        <ul class="-mb-8">
          <li v-for="(job, jobIndex) in workHistory" :key="job.id" class="relative pb-8">
            <div v-if="jobIndex !== workHistory.length - 1" class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></div>
            <div class="relative flex items-start space-x-3">
              <div>
                <div class="relative px-1">
                  <div class="h-8 w-8 bg-indigo-500 rounded-full ring-8 ring-white flex items-center justify-center">
                    <BriefcaseIcon class="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div class="min-w-0 flex-1 bg-white p-4 rounded-lg border border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <h4 class="text-lg font-medium text-gray-900">{{ job.puesto_trabajo }}</h4>
                    <div class="mt-1 flex items-center text-sm text-gray-500">
                      <BuildingOfficeIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {{ job.empresa?.razon_social || 'Empresa no especificada' }}
                    </div>
                    <div class="mt-1 flex items-center text-sm text-gray-500">
                      <CalendarIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {{ formatDate(job.fecha_inicio) }} - {{ job.fecha_fin ? formatDate(job.fecha_fin) : 'Actual' }}
                    </div>
                  </div>
                  
                  <div class="flex items-center space-x-2">
                    <button v-if="editMode" @click="editWorkHistory(job)" class="text-indigo-600 hover:text-indigo-900">
                      <PencilSquareIcon class="h-5 w-5" />
                    </button>
                    <button v-if="editMode" @click="deleteWorkHistory(job.id)" class="text-red-600 hover:text-red-900">
                      <TrashIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div class="mt-4">
                  <h5 class="text-sm font-medium text-gray-700 mb-2">Factores de Riesgo</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                    <RiskFactorCard v-if="job.riesgos_fisicos?.length" title="Físicos" :risks="job.riesgos_fisicos" color="bg-blue-50 text-blue-700 border-blue-200" />
                    <RiskFactorCard v-if="job.riesgos_quimicos?.length" title="Químicos" :risks="job.riesgos_quimicos" color="bg-green-50 text-green-700 border-green-200" />
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <WorkHistoryModal
      v-if="showAddWorkHistoryModal"
      :show="showAddWorkHistoryModal"
      @close="closeWorkHistoryModal"
      @saved="handleWorkHistorySaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, BriefcaseIcon, BuildingOfficeIcon, CalendarIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/outline'
import RiskFactorCard from '~/components/Medical/ClinicalHistory/RiskFactorCard.vue'
import WorkHistoryModal from '~/components/Medical/ClinicalHistory/WorkHistoryModal.vue'
import { useToast } from '~/composables/useToast'

const props = defineProps(['patientId', 'editMode', 'initialData'])
const emit = defineEmits(['updated'])

const workHistory = ref<any[]>([])
const loading = ref(false)
const showAddWorkHistoryModal = ref(false)
const editingWorkHistory = ref(null)

// Sincronizar con datos del padre
watch(() => props.initialData, (newVal) => {
  if (newVal) workHistory.value = newVal
}, { immediate: true })

const loadWorkHistory = async () => {
    // Placeholder - eliminado mock
}

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' })

const editWorkHistory = (job: any) => {
  console.log('Edit', job)
}

const deleteWorkHistory = (id: string) => {
  if (confirm('¿Eliminar registro?')) {
    useToast().success('Registro eliminado')
  }
}

const closeWorkHistoryModal = () => showAddWorkHistoryModal.value = false
const handleWorkHistorySaved = () => {
  closeWorkHistoryModal()
  // loadWorkHistory() // El padre recargará
  emit('updated')
}

// onMounted(() => loadWorkHistory())
</script>