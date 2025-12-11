<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Examen Físico</h3>
      <button
        v-if="editMode && !isEditing"
        @click="startEditing"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PencilSquareIcon class="h-4 w-4 mr-2" />
        {{ hasData ? 'Editar' : 'Registrar' }}
      </button>
    </div>

    <div v-if="!isEditing" class="bg-white shadow rounded-lg p-6">
      <div v-if="!hasData" class="text-center py-8">
        <DocumentMagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">Examen físico no registrado</h3>
        <p class="mt-1 text-sm text-gray-500">No se ha registrado el examen físico para esta evaluación.</p>
      </div>

      <div v-else class="space-y-6">
        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-4">Signos Vitales</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <VitalSignCard label="Presión Arterial" :value="examenFisico.signos_vitales?.presion_arterial" unit="mmHg" icon="HeartIcon" />
            <VitalSignCard label="Frecuencia Cardíaca" :value="examenFisico.signos_vitales?.frecuencia_cardiaca" unit="lpm" icon="HeartIcon" />
            <VitalSignCard label="Temperatura" :value="examenFisico.signos_vitales?.temperatura" unit="°C" icon="FireIcon" />
            <VitalSignCard label="Saturación O₂" :value="examenFisico.signos_vitales?.saturacion_oxigeno" unit="%" icon="ArrowTrendingUpIcon" />
          </div>
        </div>

        <div>
          <h4 class="text-lg font-medium text-gray-900 mb-4">Antropometría</h4>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <VitalSignCard label="Peso" :value="examenFisico.antropometria?.peso" unit="kg" icon="ScaleIcon" />
            <VitalSignCard label="Talla" :value="examenFisico.antropometria?.talla" unit="m" icon="UserIcon" />
            <VitalSignCard label="IMC" :value="calculateBMI()" unit="kg/m²" icon="ChartBarIcon" :interpretation="getBMIInterpretation(calculateBMI())" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="savePhysicalExam">
        <div class="mb-8">
          <h4 class="text-lg font-medium text-gray-900 mb-4">Signos Vitales</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Presión Arterial (mmHg)</label>
              <div class="flex space-x-2">
                <input v-model="form.signos_vitales.presion_arterial_sistolica" type="number" placeholder="120" class="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
                <span class="self-center">/</span>
                <input v-model="form.signos_vitales.presion_arterial_diastolica" type="number" placeholder="80" class="flex-1 px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Frecuencia Cardíaca (lpm)</label>
              <input v-model="form.signos_vitales.frecuencia_cardiaca" type="number" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        <div class="mb-8">
          <h4 class="text-lg font-medium text-gray-900 mb-4">Antropometría</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
              <input v-model="form.antropometria.peso" type="number" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Talla (m)</label>
              <input v-model="form.antropometria.talla" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="cancelEditing" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" :disabled="saving" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar Examen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { PencilSquareIcon, DocumentMagnifyingGlassIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import VitalSignCard from '~/components/Medical/ClinicalHistory/VitalSignCard.vue'
import { useToast } from '~/composables/useToast'

const props = defineProps(['clinicalHistory', 'editMode'])
const emit = defineEmits(['updated'])

const isEditing = ref(false)
const saving = ref(false)

const form = ref({
  signos_vitales: {
    presion_arterial_sistolica: '',
    presion_arterial_diastolica: '',
    frecuencia_cardiaca: '',
    frecuencia_respiratoria: '',
    temperatura: '',
    saturacion_oxigeno: ''
  },
  antropometria: { peso: '', talla: '' },
  sistemas: {},
  osteomuscular: {},
  observaciones_generales: ''
})

const examenFisico = computed(() => props.clinicalHistory?.examen_fisico || {})
const hasData = computed(() => Object.keys(examenFisico.value).length > 0)

const startEditing = () => {
  if (hasData.value) form.value = { ...examenFisico.value } // Cargar datos si existen
  isEditing.value = true
}

const cancelEditing = () => isEditing.value = false

const calculateBMI = () => {
  const peso = examenFisico.value.antropometria?.peso
  const talla = examenFisico.value.antropometria?.talla
  if (!peso || !talla) return null
  return (peso / (talla * talla)).toFixed(1)
}

const getBMIInterpretation = (bmi: any) => {
  if (!bmi) return 'N/A'
  const val = parseFloat(bmi)
  if (val < 18.5) return 'Bajo peso'
  if (val < 25) return 'Normal'
  if (val < 30) return 'Sobrepeso'
  return 'Obesidad'
}

const savePhysicalExam = async () => {
  saving.value = true
  try {
    // Simulamos guardado
    setTimeout(() => {
        useToast().success('Examen físico guardado')
        isEditing.value = false
        emit('updated') // Avisamos al padre para recargar
        saving.value = false
    }, 1000)
  } catch (error) {
    console.error(error)
    saving.value = false
  }
}
</script>