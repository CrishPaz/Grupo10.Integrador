<template>
  <div class="space-y-6">
    <div v-if="currentStep === 1" class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Paciente</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar Paciente</label>
          <div class="flex space-x-2">
            <input v-model="patientSearch" type="text" placeholder="DNI o nombre..." class="flex-1 px-3 py-2 border border-gray-300 rounded-md" @input="searchPatient" />
            <button @click="showNewPatient = true" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50">Nuevo</button>
          </div>

          <div v-if="patientResults.length > 0" class="mt-2 border border-gray-200 rounded-md max-h-48 overflow-y-auto">
            <div v-for="patient in patientResults" :key="patient.id" class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100" @click="selectPatient(patient)">
              <div class="flex justify-between items-center">
                <div>
                  <p class="font-medium text-gray-900">{{ patient.nombres }} {{ patient.apellidos }}</p>
                  <p class="text-sm text-gray-600">DNI: {{ patient.dni }}</p>
                </div>
                <ChevronRightIcon class="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="selectedPatient" class="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
          <div>
            <h4 class="font-medium text-gray-900">{{ selectedPatient.nombres }} {{ selectedPatient.apellidos }}</h4>
            <p class="text-sm text-gray-600">DNI: {{ selectedPatient.dni }}</p>
            <p class="text-sm text-gray-600" v-if="selectedPatient.empresa">Empresa: {{ selectedPatient.empresa.razon_social }}</p>
          </div>
          <button @click="selectedPatient = null" class="text-sm text-red-600 hover:text-red-800">Cambiar</button>
        </div>

        <div v-if="selectedPatient">
          <label class="block text-sm font-medium text-gray-700 mb-1">Orden de Examen</label>
          <select v-model="selectedAdmission" class="w-full px-3 py-2 border border-gray-300 rounded-md" @change="loadAdmissionTests">
            <option value="">Seleccione admisión</option>
            <option v-for="admission in patientAdmissions" :key="admission.id" :value="admission.id">
              {{ admission.tipo_examen }} - {{ formatDate(admission.fecha_programada) }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button @click="nextStep" :disabled="!selectedPatient || !selectedAdmission" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Continuar</button>
      </div>
    </div>

    <div v-else-if="currentStep === 2" class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Información de la Muestra</h3>
      
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Muestra *</label>
          <select v-model="sample.tipo_muestra" class="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Seleccionar</option>
            <option value="sangre">Sangre</option>
            <option value="orina">Orina</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input v-model="sample.cantidad" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Recipiente</label>
            <select v-model="sample.recipiente" class="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Seleccionar</option>
              <option value="tubo_lila">Tubo Lila (EDTA)</option>
              <option value="tubo_rojo">Tubo Rojo (Suero)</option>
              <option value="frasco_orina">Frasco Orina</option>
            </select>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-between">
        <button @click="prevStep" class="px-4 py-2 border border-gray-300 rounded-md">Atrás</button>
        <button @click="nextStep" :disabled="!sample.tipo_muestra" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">Continuar</button>
      </div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmación y Etiquetado</h3>
      
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="font-bold">Paciente:</span> {{ selectedPatient?.nombres }}</div>
          <div><span class="font-bold">Muestra:</span> {{ sample.tipo_muestra }}</div>
        </div>
      </div>

      <div class="border-t pt-6 text-center">
        <button v-if="!sample.codigo_muestra" @click="generateSampleCode" class="px-4 py-2 border border-gray-300 rounded-md">Generar Código</button>
        <div v-else>
            <svg ref="barcodeContainer" class="mx-auto"></svg>
            <p class="mt-2 font-mono font-bold text-lg">{{ sample.codigo_muestra }}</p>
        </div>
      </div>

      <div class="mt-6 flex justify-between">
        <button @click="prevStep" class="px-4 py-2 border border-gray-300 rounded-md">Atrás</button>
        <button @click="registerSample" :disabled="!sample.codigo_muestra" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">Registrar Muestra</button>
      </div>
    </div>

    <NewPatientModal :show="showNewPatient" @close="showNewPatient = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import JsBarcode from 'jsbarcode'
import { useToast } from '~/composables/useToast'
import NewPatientModal from './NewPatientModal.vue'

const emit = defineEmits(['sample-registered', 'close'])

// Estado
const currentStep = ref(1)
const patientSearch = ref('')
const patientResults = ref<any[]>([])
const selectedPatient = ref<any>(null)
const patientAdmissions = ref<any[]>([])
const selectedAdmission = ref('')
const showNewPatient = ref(false)
const barcodeContainer = ref(null)

const sample = ref({
  tipo_muestra: '',
  cantidad: null,
  recipiente: '',
  codigo_muestra: ''
})

// Funciones
const searchPatient = async () => {
  if (patientSearch.value.length < 2) return
  // Simulamos búsqueda
  patientResults.value = [
    { id: '1', nombres: 'Juan', apellidos: 'Perez', dni: '12345678', empresa: { razon_social: 'Mina S.A.' } }
  ].filter(p => p.dni.includes(patientSearch.value) || p.nombres.toLowerCase().includes(patientSearch.value.toLowerCase()))
}

const selectPatient = (patient: any) => {
  selectedPatient.value = patient
  patientResults.value = []
  patientSearch.value = ''
  // Simulamos admisiones
  patientAdmissions.value = [
    { id: 'adm-1', tipo_examen: 'Examen de Ingreso', fecha_programada: new Date().toISOString() }
  ]
}


const loadAdmissionTests = () => {
  // Lógica para cargar exámenes de la admisión seleccionada
  console.log('Admisión seleccionada:', selectedAdmission.value)
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()

const nextStep = () => { if (currentStep.value < 3) currentStep.value++ }
const prevStep = () => { if (currentStep.value > 1) currentStep.value-- }

const generateSampleCode = () => {
  const random = Math.floor(Math.random() * 10000)
  sample.value.codigo_muestra = `LAB-${random}`
  
  nextTick(() => {
    if (barcodeContainer.value) {
      JsBarcode(barcodeContainer.value, sample.value.codigo_muestra, {
        format: 'CODE128',
        height: 40,
        displayValue: false
      })
    }
  })
}

const registerSample = () => {
  useToast().success('Muestra registrada correctamente')
  emit('sample-registered')
  emit('close') // Cerrar el modal
}
</script>