
<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
             <div class="flex items-center">
               <button @click="goBack" class="mr-4 text-gray-500 hover:text-gray-700">
                 <ArrowLeftIcon class="h-6 w-6" />
               </button>
               <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
                 Examen de Espirometría
               </h2>
             </div>
             <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 ml-10">
               Evaluación de la función pulmonar
             </p>
          </div>
        </div>

        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p class="mt-4 text-gray-500">Cargando datos del paciente...</p>
        </div>

        <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
           <div class="flex">
             <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
             <div class="ml-3">
               <h3 class="text-sm font-medium text-red-800">Error</h3>
               <div class="mt-2 text-sm text-red-700">{{ error }}</div>
               <button @click="goBack" class="mt-4 text-sm font-medium text-red-800 hover:text-red-900">Volver</button>
             </div>
           </div>
        </div>

        <div v-else class="space-y-6">
          <!-- Patient Info -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Datos del Paciente</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div>
                 <label class="block text-sm font-medium text-gray-500">Nombre Completo</label>
                 <p class="mt-1 text-base text-gray-900 dark:text-gray-200">{{ patient?.nombres }} {{ patient?.apellidos }}</p>
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-500">DNI</label>
                 <p class="mt-1 text-base text-gray-900 dark:text-gray-200">{{ patient?.dni }}</p>
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-500">Empresa</label>
                 <p class="mt-1 text-base text-gray-900 dark:text-gray-200">{{ patient?.empresa?.razon_social || 'N/A' }}</p>
               </div>
            </div>
          </div>

          <!-- Spirometry Form -->
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">Resultados Espirométricos</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">FVC (Capacidad Vital Forzada)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input type="number" v-model.number="form.results.fvc" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Litros">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">FEV1 (Volumen Espiratorio Forzado)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input type="number" v-model.number="form.results.fev1" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Litros">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Índice Tiffeneau (FEV1/FVC)</label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <input type="number" v-model.number="form.results.ratio" class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="%">
                </div>
              </div>
            </div>

            <!-- Conclusion -->
             <div class="grid grid-cols-1 gap-6">
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Interpretación</label>
                 <textarea 
                   v-model="form.interpretation" 
                   rows="3" 
                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder="Ej: Espirometría Normal..."
                 ></textarea>
               </div>
               <div>
                 <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recomendaciones</label>
                 <textarea 
                   v-model="form.recommendations" 
                   rows="3" 
                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   placeholder="Ej: Control anual..."
                 ></textarea>
               </div>
             </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3">
            <button @click="goBack" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Cancelar
            </button>
            <button 
              @click="saveExam" 
              :disabled="saving"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              <span v-if="saving" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ saving ? 'Guardando...' : 'Guardar y Finalizar' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import AdminLayout from '~/components/AdminLayout.vue'
import { useToast } from '~/composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const patientId = computed(() => route.query.patientId as string)
const patient = ref<any>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)

const form = ref({
  results: {
    fvc: null as number | null,
    fev1: null as number | null,
    ratio: null as number | null
  },
  interpretation: '',
  recommendations: ''
})

// Auto-calculate ratio
watch(() => [form.value.results.fvc, form.value.results.fev1], ([fvc, fev1]) => {
  if (fvc && fev1) {
    form.value.results.ratio = parseFloat(((fev1 / fvc) * 100).toFixed(1))
  }
})

const goBack = () => {
  router.push('/medical')
}

const loadPatient = async () => {
  if (!patientId.value) {
    error.value = 'No se especificó un paciente.'
    loading.value = false
    return
  }

  try {
    const data = await $fetch<any>(`/api/patients/${patientId.value}`)
    patient.value = data.patient ? {
        ...data.patient,
        ...data.user,
        empresa: data.patient.empresa
    } : null
    
    if (!patient.value) throw new Error('Paciente no encontrado')

  } catch (err: any) {
    console.error('Error loading patient:', err)
    error.value = 'Error al cargar datos del paciente: ' + err.message
  } finally {
    loading.value = false
  }
}

const saveExam = async () => {
  if (saving.value) return
  saving.value = true

  try {
    await $fetch('/api/medical/exams/create', {
      method: 'POST',
      body: {
        patientId: patientId.value,
        tipo_examen: 'Espirometría',
        resultados: form.value.results,
        interpretacion: form.value.interpretation,
        recomendaciones: form.value.recommendations
      }
    })
    
    toast.success('Examen de Espirometría guardado exitosamente')
    setTimeout(() => {
      router.push('/medical')
    }, 1500)

  } catch (err: any) {
    console.error('Error saving exam:', err)
    toast.error('Error al guardar examen: ' + (err.data?.message || err.message))
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadPatient()
})

definePageMeta({ middleware: ['auth'] })
</script>
