<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <CloudArrowUpIcon class="h-6 w-6 text-indigo-600" aria-hidden="true" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Importar Usuarios
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-4">
                  Sube un archivo Excel (.xlsx) con las siguientes columnas: <br>
                  <strong>DNI, Nombres, Apellidos, Email, Rol, Especialidad, Colegiatura</strong>
                </p>

                <div v-if="!results" class="mt-2">
                   <div class="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md" 
                        :class="{'border-indigo-500 ring-1 ring-indigo-500': isDragging}"
                        @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false"
                        @drop.prevent="handleDrop">
                      <div class="space-y-1 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="flex text-sm text-gray-600 justify-center">
                          <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Sube un archivo</span>
                            <input id="file-upload" name="file-upload" type="file" class="sr-only" accept=".xlsx, .xls" @change="handleFileSelect">
                          </label>
                          <p class="pl-1">o arrástralo aquí</p>
                        </div>
                        <p class="text-xs text-gray-500">
                          XLSX hasta 5MB
                        </p>
                        <p v-if="selectedFile" class="text-sm text-indigo-600 font-bold mt-2">
                          {{ selectedFile.name }}
                        </p>
                      </div>
                    </div>
                </div>

                <div v-else class="mt-4 bg-gray-50 p-4 rounded text-left">
                  <h4 class="font-bold text-gray-900 mb-2">Resultados:</h4>
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-green-100 p-2 rounded">
                      <span class="block text-xs text-green-600 font-bold">EXITOSOS</span>
                      <span class="text-xl font-bold text-green-800">{{ results.success }}</span>
                    </div>
                    <div class="bg-red-100 p-2 rounded">
                      <span class="block text-xs text-red-600 font-bold">ERRORES</span>
                      <span class="text-xl font-bold text-red-800">{{ results.errors.length }}</span>
                    </div>
                  </div>
                  
                  <div v-if="results.errors.length > 0" class="max-h-40 overflow-y-auto text-xs text-red-600 space-y-1">
                    <p v-for="(err, idx) in results.errors" :key="idx">{{ err }}</p>
                  </div>
                </div>

                <div v-if="loading" class="mt-4 flex items-center justify-center text-indigo-600">
                   <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button v-if="!results" type="button" 
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            :disabled="!selectedFile || loading"
            @click="uploadFile">
            Importar
          </button>
          <button v-else type="button" 
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="emitClose">
            Finalizar
          </button>

          <button type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm" @click="emitClose">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CloudArrowUpIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close', 'refresh'])

const selectedFile = ref<File | null>(null)
const isDragging = ref(false)
const loading = ref(false)
const results = ref<any>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0]
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    if (file.type.includes('sheet') || file.name.endsWith('.xlsx')) {
      selectedFile.value = file
    }
  }
}

const uploadFile = async () => {
  if (!selectedFile.value) return

  loading.value = true
  const formData = new FormData()
  formData.append('file', selectedFile.value)

  try {
    const data = await $fetch('/api/admin/users/import', {
      method: 'POST',
      body: formData
    })
    results.value = data
    emit('refresh')
  } catch (error: any) {
    console.error(error)
    alert(error.data?.message || 'Error al subir archivo')
  } finally {
    loading.value = false
  }
}

const emitClose = () => {
  selectedFile.value = null
  results.value = null
  loading.value = false
  emit('close')
}
</script>