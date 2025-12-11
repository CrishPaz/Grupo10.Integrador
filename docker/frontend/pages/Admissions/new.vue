<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Nueva Admisión</h2>
          <p class="mt-1 text-sm text-gray-600">Registre una nueva admisión para evaluación ocupacional</p>
        </div>

        <div class="mb-8">
          <nav class="flex items-center justify-center">
            <ol class="flex items-center space-x-8">
              <li v-for="(step, index) in steps" :key="step.name" class="flex items-center">
                <span class="relative flex h-8 w-8 items-center justify-center rounded-full"
                  :class="step.current ? 'bg-indigo-600 text-white' : step.completed ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'">
                  <CheckIcon v-if="step.completed" class="h-5 w-5" />
                  <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
                </span>
                <span class="ml-3 text-sm font-medium" :class="step.current ? 'text-indigo-600' : 'text-gray-500'">{{ step.name }}</span>
                <div v-if="index < steps.length - 1" class="hidden lg:block ml-4 w-12 h-0.5 bg-gray-300"></div>
              </li>
            </ol>
          </nav>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          
          <div v-if="currentStep === 1">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Seleccionar Paciente</h3>
            <div v-if="!patient">
              <PatientSearch @patient-selected="setPatient" />
              <div class="mt-6 pt-6 border-t border-gray-200 text-center">
                <p class="text-sm text-gray-600 mb-4">¿No encuentra al paciente?</p>
                <button @click="showNewPatientForm = true" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <PlusIcon class="h-4 w-4 mr-2" /> Registrar Nuevo Paciente
                </button>
              </div>
            </div>
            <div v-else class="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 class="font-medium text-gray-900">{{ patient.nombres }} {{ patient.apellidos }}</h4>
                <p class="text-sm text-gray-600">DNI: {{ patient.dni }}</p>
              </div>
                <button @click="openEditPatient" class="text-sm text-indigo-600 hover:text-indigo-800 mr-4">Editar</button>
                <button @click="patient = null" class="text-sm text-red-600 hover:text-red-800">Cambiar</button>
              </div>
            </div>

          <div v-else-if="currentStep === 2">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Detalles de la Cita</h3>
            <div class="grid grid-cols-1 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Examen</label>
                <select v-model="form.tipo_examen" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3">
                  <option value="">Seleccione</option>
                  <option v-for="type in examTypes" :key="type.id" :value="type.codigo">{{ type.nombre }}</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Fecha</label>
                  <input v-model="form.fecha_programada" type="date" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Hora</label>
                  <select v-model="form.hora" class="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3">
                    <option value="08:00">08:00 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="currentStep === 3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Documentos Requeridos</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentUpload label="DNI (Anverso)" :required="true" />
              <DocumentUpload label="DNI (Reverso)" :required="true" />
              <DocumentUpload label="Orden de Examen" :required="false" />
            </div>
          </div>

          <div v-else-if="currentStep === 4">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmación</h3>
            <div class="bg-gray-50 p-4 rounded-md mb-4">
              <p><strong>Paciente:</strong> {{ patient.nombres }} {{ patient.apellidos }}</p>
              <p><strong>Examen:</strong> {{ form.tipo_examen }}</p>
              <p><strong>Fecha:</strong> {{ form.fecha_programada }} - {{ form.hora }}</p>
            </div>
            <div class="flex items-center">
              <input v-model="confirmTerms" type="checkbox" class="h-4 w-4 text-indigo-600 rounded" />
              <label class="ml-2 block text-sm text-gray-900">Confirmo que los datos son correctos.</label>
            </div>
          </div>

          <div class="mt-8 flex justify-between">
            <button v-if="currentStep > 1" @click="currentStep--" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Atrás
            </button>
            <div v-else></div> <button v-if="currentStep < 4" @click="nextStep" :disabled="!canProceed" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
              Continuar
            </button>
            <button v-else @click="submitAdmission" :disabled="!confirmTerms" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
              Finalizar Admisión
            </button>
          </div>

        </div>
      </div>
    </div>

    <PatientRegistrationModal 
      :show="showNewPatientForm" 
      :patient-to-edit="patientToEdit"
      @close="showNewPatientForm = false; patientToEdit = null" 
      @patient-registered="handleNewPatientRegistered" 
      @patient-updated="handlePatientUpdated"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, CheckIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import PatientSearch from '~/components/Admissions/PatientSearch.vue'
import PatientRegistrationModal from '~/components/Admissions/PatientRegistrationModal.vue'
import DocumentUpload from '~/components/Admissions/DocumentUpload.vue'
import { useToast } from '~/composables/useToast' // Importación manual para evitar errores

// Estado
const currentStep = ref(1)
const patient = ref<any>(null)
const showNewPatientForm = ref(false)
const confirmTerms = ref(false)
const form = ref({
  tipo_examen: '',
  fecha_programada: new Date().toISOString().split('T')[0],
  hora: '',
  medico_id: ''
})

const patientToEdit = ref<any>(null)

// Datos simulados (Mock Data)
const examTypes = ref([
  { id: '1', codigo: 'EMO-ING', nombre: 'Examen de Ingreso' },
  { id: '2', codigo: 'EMO-PER', nombre: 'Examen Periódico' },
  { id: '3', codigo: 'EMO-RET', nombre: 'Examen de Retiro' }
])

const steps = computed(() => [
  { name: 'Paciente', current: currentStep.value === 1, completed: currentStep.value > 1 },
  { name: 'Cita', current: currentStep.value === 2, completed: currentStep.value > 2 },
  { name: 'Docs', current: currentStep.value === 3, completed: currentStep.value > 3 },
  { name: 'Fin', current: currentStep.value === 4, completed: currentStep.value > 4 }
])

const canProceed = computed(() => {
  if (currentStep.value === 1) return !!patient.value
  if (currentStep.value === 2) return !!form.value.tipo_examen && !!form.value.hora
  return true
})

const nextStep = () => { if (currentStep.value < 4) currentStep.value++ }
const setPatient = (p: any) => { patient.value = p }

const openEditPatient = () => {
  patientToEdit.value = patient.value
  showNewPatientForm.value = true
}

const handleNewPatientRegistered = (p: any) => { 
  patient.value = p
  patientToEdit.value = null
  showNewPatientForm.value = false 
}

const handlePatientUpdated = (p: any) => {
  patient.value = p
  patientToEdit.value = null
  showNewPatientForm.value = false
}

const submitAdmission = async () => {
  try {
    await $fetch('/api/admissions/create', {
        method: 'POST',
        body: {
            paciente_id: patient.value.id,
            tipo_examen: form.value.tipo_examen,
            fecha_programada: form.value.fecha_programada,
            hora: form.value.hora,
            medico_id: form.value.medico_id,
            empresa_id: patient.value.empresa?.id
        }
    })
    
    useToast().success('Admisión creada con éxito')
    setTimeout(() => navigateTo('/admissions'), 1500)
  } catch (error: any) {
    console.error('Error creating admission:', error)
    useToast().error(error.data?.message || 'Error al crear admisión')
  }
}

definePageMeta({ middleware: ['auth'] })
</script>