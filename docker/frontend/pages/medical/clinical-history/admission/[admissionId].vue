<template>
  <AdminLayout>
    <div v-if="loading" class="py-12 text-center">
      <svg class="animate-spin h-8 w-8 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="mt-2 text-gray-600">Cargando historia clínica...</p>
    </div>

    <div v-else class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li><NuxtLink to="/medical/clinical-history" class="text-gray-400 hover:text-gray-500"><HomeIcon class="h-5 w-5" /></NuxtLink></li>
              <li><ChevronRightIcon class="h-5 w-5 text-gray-400" /></li>
              <li class="text-sm font-medium text-gray-900">Historia Clínica #{{ admissionId }}</li>
            </ol>
          </nav>

          <div class="mt-4 md:flex md:items-center md:justify-between">
            <div class="flex-1 min-w-0">
              <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Historia Clínica Ocupacional
              </h2>
              <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <UserIcon class="mr-1.5 h-5 w-5 text-gray-400" />
                  {{ patient?.nombres }} {{ patient?.apellidos }} • DNI: {{ patient?.dni }}
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500">
                  <BuildingOfficeIcon class="mr-1.5 h-5 w-5 text-gray-400" />
                  {{ patient?.empresa?.razon_social || 'Sin empresa' }}
                </div>
              </div>
            </div>
            <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
              <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <PrinterIcon class="h-4 w-4 mr-2" /> Imprimir
              </button>
              <button class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <ArrowDownTrayIcon class="h-4 w-4 mr-2" /> PDF
              </button>
            </div>
          </div>
        </div>

        <div class="mb-8 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button v-for="tab in tabs" :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
              ]">
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <div class="mt-6">
          <MedicalHistory v-if="activeTab === 'antecedentes'" />
          <OccupationalHistory v-if="activeTab === 'ocupacional'" :initial-data="occupationalHistory" />
          <PhysicalExam v-if="activeTab === 'examen-fisico'" :initial-data="clinicalHistory" :clinical-history-id="clinicalHistory?.id" :edit-mode="true" @updated="loadClinicalHistory" />
          <ExamResults v-if="activeTab === 'examenes'" :initial-data="exams" :admission-id="admissionId" @exam-added="loadClinicalHistory" />
          <VitalSigns v-if="activeTab === 'signos-vitales'" />
          <ProgressNotes v-if="activeTab === 'evolucion'" />
          <Attachments v-if="activeTab === 'archivos'" />
          <ClinicalSummary v-if="activeTab === 'resumen'" />
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { HomeIcon, ChevronRightIcon, UserIcon, BuildingOfficeIcon, PrinterIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

// Importamos los componentes locales
import MedicalHistory from '~/components/Medical/ClinicalHistory/MedicalHistory.vue'
import OccupationalHistory from '~/components/Medical/ClinicalHistory/OccupationalHistory.vue'
import PhysicalExam from '~/components/Medical/ClinicalHistory/PhysicalExam.vue'
import ExamResults from '~/components/Medical/ClinicalHistory/ExamResults.vue'
import VitalSigns from '~/components/Medical/ClinicalHistory/VitalSigns.vue'
import ProgressNotes from '~/components/Medical/ClinicalHistory/ProgressNotes.vue'
import Attachments from '~/components/Medical/ClinicalHistory/Attachments.vue'
import ClinicalSummary from '~/components/Medical/ClinicalHistory/ClinicalSummary.vue'

const route = useRoute()
const admissionId = route.params.admissionId as string

const loading = ref(true)
const activeTab = ref('antecedentes')
const patient = ref<any>(null)
const clinicalHistory = ref<any>(null)
const exams = ref<any[]>([])
const occupationalHistory = ref<any[]>([])

const tabs = [
  { id: 'antecedentes', name: 'Antecedentes' },
  { id: 'ocupacional', name: 'Historia Ocupacional' },
  { id: 'examen-fisico', name: 'Examen Físico' },
  { id: 'examenes', name: 'Exámenes' },
  { id: 'signos-vitales', name: 'Signos Vitales' },
  { id: 'evolucion', name: 'Evolución' },
  { id: 'archivos', name: 'Archivos' },
  { id: 'resumen', name: 'Resumen Clínico' }
]

const loadClinicalHistory = async () => {
  loading.value = true
  try {
    // Llamamos a la API real que creamos
    const response: any = await $fetch(`/api/medical/clinical-history/admission/${admissionId}`)
    
    // Guardamos los datos
    patient.value = response.patient
    exams.value = response.examenes || []
    occupationalHistory.value = response.antecedentesLaborales || []
    clinicalHistory.value = response.clinicalHistory
    
    // Si tuvieras una variable para la historia clínica completa:
    // clinicalHistory.value = response.clinicalHistory

  } catch (error) {
    console.error('Error cargando historia:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Ya no usamos setTimeout falso
  loadClinicalHistory()
})

definePageMeta({ middleware: ['auth'] })
</script>