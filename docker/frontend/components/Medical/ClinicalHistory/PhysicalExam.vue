<template>
  <div class="space-y-6">
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Examen Físico General</h3>
          <p class="mt-1 text-sm text-gray-500">
            Registro de signos vitales básicos y observaciones generales.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2">
          <div class="grid grid-cols-6 gap-6">
            <div class="col-span-6 sm:col-span-3">
              <label for="peso" class="block text-sm font-medium text-gray-700">Peso (kg)</label>
              <input type="number" step="0.1" v-model="form.peso" :disabled="!editMode" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>

            <div class="col-span-6 sm:col-span-3">
              <label for="talla" class="block text-sm font-medium text-gray-700">Talla (cm)</label>
              <input type="number" step="1" v-model="form.talla" :disabled="!editMode" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
            </div>

            <!-- Calculated IMC -->
            <div class="col-span-6 sm:col-span-3">
              <label class="block text-sm font-medium text-gray-700">IMC</label>
              <div class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-gray-100 rounded-md shadow-sm sm:text-sm text-gray-600">
                {{ calculateIMC }}
              </div>
            </div>

            <div class="col-span-6">
              <label for="observaciones" class="block text-sm font-medium text-gray-700">Observaciones Generales</label>
              <textarea v-model="form.observaciones" rows="3" :disabled="!editMode" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Systems Review -->
    <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-900">Evaluación por Sistemas</h3>
          <p class="mt-1 text-sm text-gray-500">
            Hallazgos específicos por sistema.
          </p>
        </div>
        <div class="mt-5 md:mt-0 md:col-span-2 space-y-4">
            <div v-for="system in systems" :key="system.key" class="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div class="flex items-start">
                    <div class="flex items-center h-5">
                        <input :id="system.key" type="checkbox" v-model="form.sistemas[system.key].normal" :disabled="!editMode" class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
                    </div>
                    <div class="ml-3 text-sm flex-grow">
                        <label :for="system.key" class="font-medium text-gray-700">{{ system.label }}</label>
                        <p class="text-gray-500">{{ form.sistemas[system.key].normal ? 'Normal / Sin Hallazgos' : 'Marcar si es normal. Desmarcar para agregar hallazgos.' }}</p>
                    </div>
                </div>
                <div v-if="!form.sistemas[system.key].normal" class="mt-2 ml-7">
                    <textarea v-model="form.sistemas[system.key].hallazgos" :disabled="!editMode" placeholder="Describa los hallazgos patológicos..." rows="2" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"></textarea>
                </div>
            </div>
        </div>
      </div>
    </div>

    <div v-if="editMode" class="flex justify-end">
      <button @click="save" :disabled="saving" class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span v-if="saving">Guardando...</span>
        <span v-else>Guardar Examen Físico</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from '~/composables/useToast'

const props = defineProps(['initialData', 'editMode', 'clinicalHistoryId'])
const emit = defineEmits(['updated'])

const saving = ref(false)

interface SystemFinding {
    normal: boolean;
    hallazgos: string;
}

interface PhysicalExamForm {
    peso: number;
    talla: number;
    observaciones: string;
    sistemas: Record<string, SystemFinding>;
}

const form = ref<PhysicalExamForm>({
  peso: 0,
  talla: 0,
  observaciones: '',
  sistemas: {
    cabeza: { normal: true, hallazgos: '' },
    ojos: { normal: true, hallazgos: '' },
    orl: { normal: true, hallazgos: '' },
    cuello: { normal: true, hallazgos: '' },
    torax: { normal: true, hallazgos: '' },
    cardiovascular: { normal: true, hallazgos: '' },
    abdomen: { normal: true, hallazgos: '' },
    locomotor: { normal: true, hallazgos: '' },
    neurologico: { normal: true, hallazgos: '' },
    piel: { normal: true, hallazgos: '' }
  }
})

const systems = [
    { key: 'cabeza', label: 'Cabeza' },
    { key: 'ojos', label: 'Ojos' },
    { key: 'orl', label: 'Oídos, Nariz y Garganta (ORL)' },
    { key: 'cuello', label: 'Cuello' },
    { key: 'torax', label: 'Tórax y Pulmones' },
    { key: 'cardiovascular', label: 'Cardiovascular' },
    { key: 'abdomen', label: 'Abdomen' },
    { key: 'locomotor', label: 'Sistema Locomotor' },
    { key: 'neurologico', label: 'Neurológico' },
    { key: 'piel', label: 'Piel y Faneras' }
]

// Inicializar con datos
watch(() => props.initialData, (newVal) => {
  if (newVal) {
    if (newVal.examen_fisico) {
        // Fusionar con defaults para evitar errores si faltan campos
        form.value = { ...form.value, ...newVal.examen_fisico }
        
        // Asegurar que sistemas existe (si viene un JSON parcial)
        if (newVal.examen_fisico.sistemas) {
            Object.keys(form.value.sistemas).forEach(key => {
                if (newVal.examen_fisico.sistemas[key]) {
                    form.value.sistemas[key] = newVal.examen_fisico.sistemas[key]
                }
            })
        }
    }
  }
}, { immediate: true, deep: true })

const calculateIMC = computed(() => {
  if (form.value.peso > 0 && form.value.talla > 0) {
    const tallaMetros = form.value.talla / 100
    return (form.value.peso / (tallaMetros * tallaMetros)).toFixed(2)
  }
  return '0.00'
})

const save = async () => {
    saving.value = true
    try {
        await $fetch(`/api/medical/clinical-history/${props.clinicalHistoryId}/physical-exam`, {
            method: 'PUT',
            body: {
                examen_fisico: form.value
            }
        })
        useToast().success('Examen físico guardado')
        emit('updated')
    } catch (error) {
        console.error(error)
        useToast().error('Error al guardar')
    } finally {
        saving.value = false
    }
}
</script>