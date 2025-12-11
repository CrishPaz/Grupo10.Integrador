<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
              Historia Clínica Ocupacional
            </h2>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Repositorio central de información médica
            </p>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Buscar Paciente</h3>
          <PatientSearch @patient-selected="handlePatientSelected" />
        </div>

        <div v-if="selectedPatient">
          <PatientHeader :patient="selectedPatient" @close="selectedPatient = null" />
          
          <div class="mt-4 mb-8 flex space-x-3">
            <button @click="showNewExamModal = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
              <PlusIcon class="h-4 w-4 mr-2" /> Nuevo Examen
            </button>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-1 space-y-6">
              <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Datos Generales</h3>
                <div class="space-y-4 text-sm">
                  <div>
                    <label class="text-gray-500 dark:text-gray-400 block">Edad</label>
                    <p class="font-medium dark:text-gray-100">35 años</p>
                  </div>
                  <div>
                    <label class="text-gray-500 dark:text-gray-400 block">Tipo Sangre</label>
                    <p class="font-medium dark:text-gray-100">O+</p>
                  </div>
                  <div>
                    <label class="text-gray-500 dark:text-gray-400 block">Empresa</label>
                    <p class="font-medium dark:text-gray-100">{{ selectedPatient.empresa?.razon_social || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg p-6">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Alergias</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 italic">Niega alergias medicamentosas.</p>
              </div>
            </div>

            <div class="lg:col-span-2 space-y-6">
              <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Historial de Evaluaciones</h3>
                </div>
                <div class="p-6">
                  <div v-if="examsHistory.length > 0" class="space-y-4">
                    <div 
                      v-for="exam in examsHistory" 
                      :key="exam.id" 
                      class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                    >
                      <div class="flex justify-between items-center">
                        <div>
                          <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ exam.tipo_examen }}</h4>
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                             {{ new Date(exam.created_at).toLocaleDateString() }} 
                             <span class="text-xs text-gray-400 mx-1">•</span> 
                             Resultados Ingresados
                          </p>
                        </div>
                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
                          {{ exam.estado }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
                    No hay evaluaciones registradas.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Sin paciente seleccionado</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Busque un paciente arriba para ver su historia.</p>
        </div>

      </div>
    </div>

    <NewExamModal :show="showNewExamModal" @close="showNewExamModal = false" @exam-selected="handleNewExam" />
    <ProgressNotesModal :show="showAllProgressNotes" @close="showAllProgressNotes = false" />

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DocumentTextIcon, PlusIcon } from '@heroicons/vue/24/outline'
import PatientSearch from '~/components/Admissions/PatientSearch.vue'
import PatientHeader from '~/components/Medical/ClinicalHistory/PatientHeader.vue'
import NewExamModal from '~/components/Medical/NewExamModal.vue'
import ProgressNotesModal from '~/components/Medical/ProgressNotesModal.vue'
import { useToast } from '~/composables/useToast'

// Tipos
interface Patient {
  id: string
  nombres: string
  apellidos: string
  dni: string
  empresa?: { razon_social: string }
}

const selectedPatient = ref<Patient | null>(null)
const showNewExamModal = ref(false)
const showAllProgressNotes = ref(false)

const examsHistory = ref<any[]>([])

const handlePatientSelected = async (patient: any) => {
  selectedPatient.value = patient
  useToast().success('Paciente cargado: ' + patient.nombres)
  
  try {
    const { exams } = await $fetch<{ exams: any[] }>(`/api/patients/${patient.id}/history`)
    examsHistory.value = exams
  } catch (error) {
    console.error('Error loading history:', error)
    examsHistory.value = []
  }
}

const handleNewExam = (type: string) => {
  if (!selectedPatient.value) return
  
  const examType = type.toLowerCase()
  if (examType === 'audiometría' || examType === 'audiometria') {
    navigateTo({
      path: '/medical/exams/audiometry',
      query: { patientId: selectedPatient.value.id }
    })
  } else if (examType === 'espirometría' || examType === 'espirometria') {
    navigateTo({
      path: '/medical/exams/spirometry',
      query: { patientId: selectedPatient.value.id }
    })
  } else {
    useToast().info(`El examen ${type} estará disponible pronto.`)
  }
  showNewExamModal.value = false
}

definePageMeta({ middleware: ['auth'] })
</script>