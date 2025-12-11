<template>
  <div class="space-y-6">
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Registro de Resultados</h3>
          <div class="mt-2 text-sm text-gray-600" v-if="sample">
             <span class="font-bold">Muestra:</span> {{ sample.codigo_muestra }}
             <span class="mx-2">•</span> {{ sample.paciente.nombres }} {{ sample.paciente.apellidos }}
          </div>
        </div>
        
        <div class="flex space-x-2">
           <select v-model="selectedTestId" class="border rounded-md px-3 py-2 text-sm">
             <option value="">Seleccionar examen</option>
             <option v-for="test in pendingTests" :key="test.id" :value="test.id">{{ test.examen_nombre }}</option>
           </select>
           <button @click="showEquipmentModal = true" class="border px-3 py-2 rounded text-sm hover:bg-gray-50">Equipo</button>
        </div>
      </div>
    </div>

    <div v-if="selectedTest" class="bg-white shadow rounded-lg p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-4">{{ selectedTest.examen_nombre }}</h4>
      
      <form @submit.prevent="saveResults">
        <div v-for="param in parameters" :key="param.codigo" class="mb-4 border-b pb-4">
          <label class="block text-sm font-medium text-gray-700">{{ param.nombre }} ({{ param.unidad }})</label>
          <div class="flex items-center space-x-2 mt-1">
             <input v-model="results[param.codigo].valor" type="number" class="border rounded px-3 py-2 w-32" placeholder="Valor" />
             <span class="text-xs text-gray-500">Ref: {{ param.valor_referencia_min }} - {{ param.valor_referencia_max }}</span>
          </div>
        </div>

        <div class="flex justify-end pt-4">
           <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Guardar Resultados</button>
        </div>
      </form>
    </div>

    <div v-else class="text-center py-10 bg-gray-50 rounded border-2 border-dashed">
      <p class="text-gray-500">Seleccione un examen para ingresar resultados.</p>
    </div>

    <EquipmentInterfaceModal :show="showEquipmentModal" @close="showEquipmentModal = false" />
    <QualityControlModal :show="showQCModal" @close="showQCModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '~/composables/useToast'
import EquipmentInterfaceModal from './EquipmentInterfaceModal.vue'
import QualityControlModal from './QualityControlModal.vue'

const props = defineProps(['sampleId', 'testId'])
const route = useRoute()

// Estado
const sample = ref<any>(null)
const pendingTests = ref<any[]>([])
const selectedTestId = ref('')
const parameters = ref<any[]>([])
const results = ref<any>({})
const showEquipmentModal = ref(false)
const showQCModal = ref(false)

const selectedTest = computed(() => pendingTests.value.find(t => t.id === selectedTestId.value))

// Carga Inicial
const loadData = async () => {
  if (!props.sampleId) return

  try {
    const data = await $fetch<any>(`/api/laboratory/samples/${props.sampleId}`)
    sample.value = data.sample
    pendingTests.value = data.pendingTests
  } catch (error) {
    console.error('Error loading sample data:', error)
    useToast().error('Error cargando datos de la muestra')
  }
}

// Cargar parámetros al seleccionar examen
watch(selectedTestId, (newId) => {
  if (!newId) return
  // En un sistema real, cargaríamos los parámetros de la BD (ParametrosExamenes)
  // Por ahora simulamos parámetros genéricos para cualquier examen
  parameters.value = [
      { codigo: 'param1', nombre: 'Parámetro 1', unidad: 'U', valor_referencia_min: 0, valor_referencia_max: 100 },
      { codigo: 'param2', nombre: 'Parámetro 2', unidad: 'mg/dL', valor_referencia_min: 10, valor_referencia_max: 50 }
  ]
  
  // Inicializar resultados
  results.value = {}
  parameters.value.forEach(p => results.value[p.codigo] = { valor: '' })
})

const saveResults = async () => {
  // Simulamos guardado en BD
  // await $fetch('/api/laboratory/results/create', { method: 'POST', body: ... })
  useToast().success('Resultados guardados exitosamente')
  setTimeout(() => navigateTo('/laboratory'), 1000)
}

onMounted(() => {
  loadData()
  if (props.testId) selectedTestId.value = props.testId
})
</script>