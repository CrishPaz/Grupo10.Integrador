<template>
  <div class="concepto-form-container bg-white p-6 rounded shadow">
    <h3 class="text-xl font-bold mb-6 text-gray-800">Emisión de Certificado</h3>

    <form @submit.prevent="submitForm" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Plantilla Estándar</label>
        <select v-model="selectedTemplate" @change="loadTemplate" class="w-full p-2 border border-gray-300 rounded-md">
          <option value="">Seleccionar plantilla...</option>
          <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.nombre }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Resultado *</label>
        <div class="flex space-x-4">
          <label class="inline-flex items-center"><input type="radio" v-model="formData.resultado" value="apto" class="h-4 w-4 text-blue-600"> <span class="ml-2">Apto</span></label>
          <label class="inline-flex items-center"><input type="radio" v-model="formData.resultado" value="no_apto" class="h-4 w-4 text-red-600"> <span class="ml-2">No Apto</span></label>
          <label class="inline-flex items-center"><input type="radio" v-model="formData.resultado" value="apto_con_restricciones" class="h-4 w-4 text-yellow-600"> <span class="ml-2">Con Restricciones</span></label>
        </div>
      </div>

      <div v-if="formData.resultado === 'apto_con_restricciones'">
        <label class="block text-sm font-medium text-gray-700 mb-2">Restricciones</label>
        <textarea v-model="formData.restricciones" rows="3" class="w-full p-2 border border-gray-300 rounded-md"></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Recomendaciones</label>
        <textarea v-model="formData.recomendaciones" rows="3" class="w-full p-2 border border-gray-300 rounded-md"></textarea>
      </div>

      <div class="flex justify-end space-x-4 pt-4 border-t">
        <button type="button" @click="generatePDF" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Vista Previa PDF</button>
        <button type="submit" :disabled="isSubmitting" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {{ isSubmitting ? 'Guardando...' : 'Emitir Certificado' }}
        </button>
      </div>
    </form>

    <PDFPreview v-if="showPDFPreview" :pdf-data="pdfData" @close="showPDFPreview = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import PDFPreview from './PDFPreview.vue'

const props = defineProps(['admissionId'])
const emit = defineEmits(['success'])

const formData = ref({
  admision_id: props.admissionId,
  resultado: 'apto',
  restricciones: '',
  recomendaciones: '',
  fecha_vigencia: '',
  plantilla_id: ''
})

const templates = ref<any[]>([])
const selectedTemplate = ref('')
const isSubmitting = ref(false)
const showPDFPreview = ref(false)
const pdfData = ref('')

onMounted(async () => {
  templates.value = await $fetch<any>('/api/medical/aptitude/templates')
})

const loadTemplate = () => {
  const t = templates.value.find(x => x.id === selectedTemplate.value)
  if (t) formData.value.plantilla_id = t.id
}

const submitForm = async () => {
  isSubmitting.value = true
  try {
    await $fetch('/api/concepto-aptitud/create', {
      method: 'POST',
      body: formData.value
    })
    useToast().success('Certificado emitido correctamente')
    emit('success')
  } catch (e: any) {
    useToast().error(e.data?.message || 'Error al guardar')
  } finally {
    isSubmitting.value = false
  }
}

const generatePDF = async () => {
  try {
    const res: any = await $fetch('/api/concepto-aptitud/generate-pdf', {
      method: 'POST',
      body: formData.value
    })
    pdfData.value = res.pdf_base64
    showPDFPreview.value = true
  } catch (e) {
    useToast().error('Error generando PDF')
  }
}
</script>