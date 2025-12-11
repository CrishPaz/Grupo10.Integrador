<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50" @click.self="closeModal">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h3 class="text-xl font-semibold text-gray-900">Recepción de Muestra</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </div>

      <!-- Body -->
      <div class="px-6 py-4 space-y-6">
        <!-- Patient Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Paciente</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchTerm"
              @input="searchPatients"
              type="text"
              placeholder="Buscar por DNI o nombre..."
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              autocomplete="off"
            />
            <div v-if="searching" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg class="animate-spin h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            
            <!-- Search Results -->
            <div v-if="showResults" class="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
              <ul v-if="searchResults.length > 0">
                <li v-for="patient in searchResults" :key="patient.id" class="border-b last:border-b-0 border-gray-100">
                  <button
                    @click="selectPatient(patient)"
                    class="w-full text-left px-4 py-3 hover:bg-gray-50 flex justify-between items-center transition-colors"
                  >
                    <div>
                      <p class="font-medium text-gray-900">{{ patient.usuarioUsuario.nombres }} {{ patient.usuarioUsuario.apellidos }}</p>
                      <p class="text-sm text-gray-500">DNI: {{ patient.usuarioUsuario.dni }}</p>
                    </div>
                    <div v-if="patient.empresa" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {{ patient.empresa.razon_social }}
                    </div>
                  </button>
                </li>
              </ul>
              <div v-else class="px-4 py-3 text-sm text-gray-500 text-center">
                No se encontraron pacientes con ese criterio.
              </div>
            </div>
          </div>
          <!-- Selected Patient -->
          <div v-if="selectedPatient" class="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex justify-between items-center">
            <div>
              <p class="font-bold text-indigo-900">{{ selectedPatient.usuarioUsuario.nombres }} {{ selectedPatient.usuarioUsuario.apellidos }}</p>
              <div class="text-sm text-indigo-700 mt-1 flex gap-3">
                <span>🆔 {{ selectedPatient.usuarioUsuario.dni }}</span>
                <span v-if="selectedPatient.empresa">🏢 {{ selectedPatient.empresa.razon_social }}</span>
              </div>
            </div>
            <button @click="resetSelection" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Cambiar
            </button>
          </div>
        </div>

        <!-- Admission Selection (if patient has multiple) -->
        <div v-if="admissions.length > 0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Admisión</label>
          <select v-model="form.admision_id" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Seleccione una admisión</option>
            <option v-for="adm in admissions" :key="adm.id" :value="adm.id">
              {{ adm.tipo_examen }} - {{ new Date(adm.fecha_programada).toLocaleDateString() }}
            </option>
          </select>
        </div>

        <!-- Sample Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo de Muestra *</label>
          <select v-model="form.tipo_muestra" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">Seleccione...</option>
            <option value="sangre">Sangre</option>
            <option value="orina">Orina</option>
            <option value="heces">Heces</option>
            <option value="esputo">Esputo</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        <!-- Sample Details Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Recipiente</label>
            <input v-model="form.recipiente" type="text" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ej: Tubo tapa roja">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cantidad (ml)</label>
            <input v-model="form.cantidad" type="number" step="0.1" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <input v-model="form.color" type="text" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Aspecto</label>
            <input v-model="form.aspecto" type="text" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ej: Transparente">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Temperatura (°C)</label>
            <input v-model="form.temperatura_transporte" type="number" step="0.1" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tiempo Transporte (min)</label>
            <input v-model="form.tiempo_transporte" type="number" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
          </div>
        </div>

        <!-- Observations -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
          <textarea v-model="form.observaciones_muestra" rows="3" class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-gray-200 px-6 py-4 flex justify-end space-x-3">
        <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Cancelar
        </button>
        <button @click="submitSample" :disabled="!canSubmit || loading" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="loading">Guardando...</span>
          <span v-else>Registrar Muestra</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close', 'success'])

interface Patient {
  id: string
  usuario_id: string
  usuarioUsuario: {
    id: string
    dni: string
    nombres: string
    apellidos: string
  }
  empresa?: {
    razon_social: string
  }
}

interface Admission {
  id: string
  tipo_examen: string
  fecha_programada: string
}

const searchTerm = ref('')
const searchResults = ref<Patient[]>([])
const showResults = ref(false)
const selectedPatient = ref<Patient | null>(null)
const admissions = ref<Admission[]>([])
const loading = ref(false)
const searching = ref(false)

const form = ref({
  paciente_id: '',
  admision_id: '',
  tipo_muestra: '',
  recipiente: '',
  cantidad: null as number | null,
  color: '',
  aspecto: '',
  temperatura_transporte: null as number | null,
  tiempo_transporte: null as number | null,
  observaciones_muestra: ''
})

const canSubmit = computed(() => {
  return form.value.paciente_id && form.value.admision_id && form.value.tipo_muestra
})

let searchTimeout: any = null

const searchPatients = async () => {
  if (searchTerm.value.length < 2) {
    searchResults.value = []
    showResults.value = false
    return
  }

  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      console.log('Searching for:', searchTerm.value)
      const response = await $fetch<{ patients: Patient[] }>(`/api/patients/search?q=${searchTerm.value}`)
      console.log('Search response:', response)
      searchResults.value = response.patients || []
      // Show results even if empty to display 'No results found' message
      showResults.value = true
    } catch (error) {
      console.error('Error searching patients:', error)
      searchResults.value = []
      showResults.value = true
    } finally {
      searching.value = false
    }
  }, 300)
}

const selectPatient = async (patient: Patient) => {
  selectedPatient.value = patient
  form.value.paciente_id = patient.id
  showResults.value = false
  searchTerm.value = ''

  // Load patient's admissions
  try {
    const { data } = await $fetch<{ data: Admission[] }>(`/api/patients/${patient.id}/admissions`)
    admissions.value = data || []
    if (admissions.value.length === 1) {
      form.value.admision_id = admissions.value[0].id
    }
  } catch (error) {
    console.error('Error loading admissions:', error)
  }
}

const submitSample = async () => {
  if (!canSubmit.value) return

  loading.value = true
  try {
    const response = await $fetch('/api/laboratory/samples/create', {
      method: 'POST',
      body: form.value
    })

    if (response.success) {
      emit('success')
      resetForm()
      closeModal()
      // Show success message (you can use a toast notification)
      alert('Muestra registrada exitosamente')
    }
  } catch (error: any) {
    console.error('Error creating sample:', error)
    alert('Error al registrar la muestra: ' + (error.data?.message || error.message))
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.value = {
    paciente_id: '',
    admision_id: '',
    tipo_muestra: '',
    recipiente: '',
    cantidad: null,
    color: '',
    aspecto: '',
    temperatura_transporte: null,
    tiempo_transporte: null,
    observaciones_muestra: ''
  }
  selectedPatient.value = null
  admissions.value = []
  searchTerm.value = ''
  searchResults.value = []
  showResults.value = false
}

const resetSelection = () => {
  selectedPatient.value = null
  form.value.paciente_id = ''
  form.value.admision_id = ''
  admissions.value = []
  searchTerm.value = ''
  searchResults.value = []
  showResults.value = false
}

const closeModal = () => {
  resetForm()
  emit('close')
}

watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})
</script>