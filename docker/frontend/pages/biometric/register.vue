<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Registro Biométrico</h1>
      <p class="text-gray-600">Enrolamiento de pacientes</p>
    </div>

    <div class="mb-8 bg-gray-200 h-2 rounded-full overflow-hidden">
      <div class="bg-blue-600 h-full transition-all duration-500" :style="`width: ${(currentStep/4)*100}%`"></div>
    </div>

    <div v-if="currentStep === 1" class="bg-white p-6 rounded shadow">
      <h3 class="text-lg font-bold mb-4">1. Buscar Paciente</h3>
      <div class="flex gap-2">
        <input v-model="searchDni" type="text" placeholder="DNI del paciente" class="flex-1 border p-2 rounded" />
        <button @click="searchPatient" class="bg-blue-600 text-white px-4 py-2 rounded">Buscar</button>
      </div>
      
      <div v-if="patient" class="mt-4 p-4 border rounded bg-blue-50 cursor-pointer" @click="nextStep">
        <p class="font-bold">{{ patient.nombres }} {{ patient.apellidos }}</p>
        <p class="text-sm text-gray-600">DNI: {{ patient.dni }}</p>
        <p class="text-xs text-blue-600 mt-2">Clic para seleccionar</p>
      </div>
    </div>

    <div v-else-if="currentStep === 2" class="bg-white p-6 rounded shadow">
      <h3 class="text-lg font-bold mb-4">2. Tipo de Biometría</h3>
      <div class="grid grid-cols-2 gap-4">
        <button @click="selectType('huella_dactilar')" class="p-4 border rounded hover:bg-blue-50 text-center">
          <span class="text-2xl">👆</span>
          <p class="font-bold mt-2">Huella Dactilar</p>
        </button>
        <button @click="selectType('reconocimiento_facial')" class="p-4 border rounded hover:bg-blue-50 text-center">
          <span class="text-2xl">👤</span>
          <p class="font-bold mt-2">Facial</p>
        </button>
      </div>
    </div>

    <div v-else-if="currentStep === 3" class="bg-white p-6 rounded shadow">
      <h3 class="text-lg font-bold mb-4">3. Captura</h3>
      
      <FingerprintCapture v-if="selectedType === 'huella_dactilar'" @capture="onCapture" />
      <FacialCapture v-else @capture="onCapture" />
      
      <div v-if="capturedData" class="mt-4 text-center">
        <p class="text-green-600 font-bold">¡Captura Exitosa!</p>
        <button @click="nextStep" class="mt-4 bg-blue-600 text-white px-6 py-2 rounded">Continuar</button>
      </div>
    </div>

    <div v-else-if="currentStep === 4" class="bg-white p-6 rounded shadow">
      <h3 class="text-lg font-bold mb-4">4. Confirmar</h3>
      <div class="space-y-2 mb-6">
        <p><strong>Paciente:</strong> {{ patient.nombres }}</p>
        <p><strong>Tipo:</strong> {{ selectedType }}</p>
        <p><strong>Calidad:</strong> {{ quality }}%</p>
      </div>
      <button @click="save" :disabled="saving" class="w-full bg-green-600 text-white py-3 rounded">
        {{ saving ? 'Guardando...' : 'Guardar Registro' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FingerprintCapture from '~/components/Biometric/FingerprintCapture.vue'
import FacialCapture from '~/components/Biometric/FacialCapture.vue'
import { useToast } from '~/composables/useToast'

const currentStep = ref(1)
const searchDni = ref('')
const patient = ref(null)
const selectedType = ref('')
const capturedData = ref(null)
const quality = ref(0)
const saving = ref(false)

const searchPatient = () => {
  // Simulación
  if (searchDni.value === '12345678') {
    patient.value = { id: 'p-123', nombres: 'Juan', apellidos: 'Pérez', dni: '12345678' }
  } else {
    alert('Paciente no encontrado (Prueba con 12345678)')
  }
}

const nextStep = () => currentStep.value++
const selectType = (type) => {
  selectedType.value = type
  nextStep()
}

const onCapture = (data) => {
  capturedData.value = data.template
  quality.value = data.quality
}

const save = async () => {
  saving.value = true
  try {
    await $fetch('/api/biometric/register', {
        method: 'POST',
        body: {
            usuario_id: 'user-id-simulado', // En producción usar patient.id real
            tipo_biometrico: selectedType.value,
            template_data: capturedData.value,
            quality_score: quality.value
        }
    })
    useToast().success('Registro Biométrico Guardado')
    currentStep.value = 1
    patient.value = null
    capturedData.value = null
  } catch (e) {
    useToast().error('Error al guardar: ' + e.message)
  } finally {
    saving.value = false
  }
}
</script>