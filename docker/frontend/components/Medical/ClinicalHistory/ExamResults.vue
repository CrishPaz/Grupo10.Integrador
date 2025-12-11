<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Exámenes Especializados</h3>
      <button v-if="editMode" @click="showAddExamModal = true" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
        <PlusIcon class="h-4 w-4 mr-2" /> Agregar Examen
      </button>
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin h-8 w-8 mx-auto border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      <p class="mt-2 text-gray-600">Cargando exámenes...</p>
    </div>

    <div v-else-if="exams.length === 0" class="text-center py-8 bg-gray-50 rounded-lg">
      <BeakerIcon class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-medium text-gray-900">Sin exámenes registrados</h3>
      <p class="mt-1 text-sm text-gray-500">No hay exámenes especializados para esta evaluación.</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="exam in exams" :key="exam.id" class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
        <div class="px-6 py-4 bg-gray-50 flex justify-between items-center cursor-pointer" @click="toggleExamDetails(exam.id)">
          <div>
            <h4 class="text-lg font-medium text-gray-900">{{ getExamTypeLabel(exam.tipo_examen) }}</h4>
            <div class="mt-1 flex items-center text-sm text-gray-500">
              <CalendarIcon class="h-4 w-4 mr-1" /> {{ formatDate(exam.fecha_realizacion) }}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ exam.estado }}
            </span>
            <ChevronDownIcon v-if="!expandedExams[exam.id]" class="h-5 w-5 text-gray-400" />
            <ChevronUpIcon v-else class="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div v-if="expandedExams[exam.id]" class="px-6 py-4 border-t border-gray-200">
          
          <AudiometryResults v-if="exam.tipo_examen === 'audiometria'" :results="exam.resultados" />
          <OptometryResults v-else-if="exam.tipo_examen === 'optometria'" :results="exam.resultados" />
          <LabResults v-else-if="exam.tipo_examen === 'laboratorio'" :results="exam.resultados" />
          
          <div v-if="exam.interpretacion" class="mt-4">
            <h5 class="font-medium text-gray-900 mb-1">Interpretación</h5>
            <p class="text-sm text-gray-700">{{ exam.interpretacion }}</p>
          </div>
        </div>
      </div>
    </div>

    <ExamModal v-if="showAddExamModal" :show="showAddExamModal" @close="showAddExamModal = false" @saved="handleExamSaved" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PlusIcon, BeakerIcon, CalendarIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import ExamModal from '../ExamModal.vue'
import AudiometryResults from '~/components/Medical/ClinicalHistory/AudiometryResults.vue'
import OptometryResults from '~/components/Medical/ClinicalHistory/OptometryResults.vue'
import LabResults from '~/components/Medical/ClinicalHistory/LabResults.vue'
import { useToast } from '~/composables/useToast'

const props = defineProps(['admissionId', 'patientId', 'editMode', 'initialData'])
const emit = defineEmits(['exam-added'])

const exams = ref<any[]>([])
const loading = ref(false)
const expandedExams = ref<Record<string, boolean>>({})
const showAddExamModal = ref(false)

// Sincronizar con datos del padre
watch(() => props.initialData, (newVal) => {
  if (newVal) exams.value = newVal
}, { immediate: true })

const examTypes = [
  { value: 'audiometria', label: 'Audiometría' },
  { value: 'optometria', label: 'Optometría' },
  { value: 'laboratorio', label: 'Laboratorio' }
]

// Ya no necesitamos loadExams porque viene del padre
const loadExams = () => {
    // Placeholder por si se llama desde algún lugar, pero idealmente se elimina
}

const getExamTypeLabel = (type: string) => {
  const t = examTypes.find(x => x.value === type)
  return t ? t.label : type
}

const formatDate = (date: string) => new Date(date).toLocaleDateString('es-PE')

const toggleExamDetails = (id: string) => {
  expandedExams.value[id] = !expandedExams.value[id]
}

const handleExamSaved = () => {
  showAddExamModal.value = false
  useToast().success('Examen registrado')
  // loadExams() // Eliminado, el padre recargará
  emit('exam-added')
}

// onMounted(() => loadExams()) // Eliminado, usamos props
</script>