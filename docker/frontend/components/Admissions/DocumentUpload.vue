<template>
  <div>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <div v-if="!file" class="mt-1">
      <div
        @click="triggerFileInput"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        class="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-400 transition-colors cursor-pointer"
        :class="{ 'border-indigo-500': isDragging, 'border-red-300': error }"
      >
        <div class="space-y-1 text-center">
          <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
          <div class="flex text-sm text-gray-600">
            <label class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
              <span>Subir archivo</span>
              <input
                ref="fileInput"
                type="file"
                :accept="accept"
                class="sr-only"
                @change="handleFileSelect"
              />
            </label>
            <p class="pl-1">o arrastrar y soltar</p>
          </div>
          <p class="text-xs text-gray-500">
           {{ acceptDescription }}
          </p>
          <p v-if="maxSize" class="text-xs text-gray-500">
           Máximo {{ formatFileSize(maxSize) }}
          </p>
        </div>
      </div>
      <p v-if="error" class="mt-2 text-sm text-red-600">
        {{ error }}
      </p>
    </div>

    <div v-else class="mt-1">
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-md">
        <div class="flex items-center">
          <DocumentIcon class="h-8 w-8 text-gray-400 mr-3" />
          <div>
            <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="previewFile"
            type="button"
            class="text-indigo-600 hover:text-indigo-900"
          >
            <EyeIcon class="h-5 w-5" />
          </button>
          <button
            @click="removeFile"
            type="button"
            class="text-red-600 hover:text-red-900"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div v-if="uploading" class="mt-2">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: uploadProgress + '%' }"
          ></div>
        </div>
        <p class="mt-1 text-xs text-gray-600 text-center">
         Subiendo... {{ Math.round(uploadProgress) }}%
        </p>
      </div>
    </div>

    <div v-if="showPreview" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">
                    Vista previa: {{ file?.name }}
                  </h3>
                  <button
                    @click="showPreview = false"
                    class="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                
                <div class="mt-2">
                  <img
                    v-if="isImage"
                    :src="previewUrl"
                    :alt="file?.name"
                    class="max-w-full h-auto mx-auto"
                  />
                  <div v-else-if="isPDF" class="h-96">
                    <iframe
                      :src="previewUrl"
                      class="w-full h-full border-0"
                    ></iframe>
                  </div>
                  <div v-else class="text-center py-12">
                    <DocumentIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <p class="mt-2 text-sm text-gray-500">
                      Vista previa no disponible para este tipo de archivo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="showPreview = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { PhotoIcon, DocumentIcon, EyeIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['file-uploaded'])

interface Props {
  label?: string
  required?: boolean
  accept?: string
  maxSize?: number // en bytes
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  accept: '.pdf,.jpg,.jpeg,.png',
  maxSize: 5 * 1024 * 1024, // 5MB por defecto
  compact: false
})

// Estado reactivo
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()
const isDragging = ref(false)
const error = ref('')
const uploading = ref(false)
const uploadProgress = ref(0)
const showPreview = ref(false)
const previewUrl = ref('')

// Computed properties
const acceptDescription = computed(() => {
  if (!props.accept) return ''
  const types = props.accept.split(',')
  return types.map(type => {
    if (type === '.pdf') return 'PDF'
    if (type === '.jpg' || type === '.jpeg') return 'JPG'
    if (type === '.png') return 'PNG'
    return type.replace('.', '').toUpperCase()
  }).join(', ')
})

const isImage = computed(() => {
  return file.value?.type.startsWith('image/') || false
})

const isPDF = computed(() => {
  return file.value?.type === 'application/pdf' || false
})

// Funciones
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (selectedFile: File) => {
  // Validar tamaño
  if (props.maxSize && selectedFile.size > props.maxSize) {
    error.value = `El archivo es muy grande. Máximo ${formatFileSize(props.maxSize)}.`
    return
  }

  // Validar tipo
  if (props.accept && props.accept !== '*') {
    const acceptedTypes = props.accept.split(',').map(type => type.trim().toLowerCase())
    const fileExtension = '.' + selectedFile.name.split('.').pop()?.toLowerCase()
    const fileType = selectedFile.type.toLowerCase()
    
    const isValidType = acceptedTypes.some(type => {
      return type.startsWith('.') 
        ? fileExtension === type
        : fileType.startsWith(type.replace('/*', '/'))
    })
    
    if (!isValidType) {
      error.value = `Tipo de archivo no permitido. Formatos aceptados: ${acceptDescription.value}`
      return
    }
  }

  // Limpiar error
  error.value = ''
  file.value = selectedFile

  // Simular subida (en producción sería una petición real)
  if (!props.compact) {
    uploadFile(selectedFile)
  }
}

const uploadFile = async (fileToUpload: File) => {
  uploading.value = true
  uploadProgress.value = 0

  // Simular progreso de subida
  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploading.value = false
      
      // Convertir a base64 para enviar al padre
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        emit('file-uploaded', {
          name: fileToUpload.name,
          type: fileToUpload.type,
          size: fileToUpload.size,
          lastModified: fileToUpload.lastModified,
          base64: base64.split(',')[1] // Remover el prefijo data:...
        })
      }
      reader.readAsDataURL(fileToUpload)
    }
  }, 100)
}

const removeFile = () => {
  file.value = null
  uploadProgress.value = 0
  uploading.value = false
  error.value = ''
  emit('file-uploaded', null)
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const previewFile = () => {
  if (!file.value) return
  
  previewUrl.value = URL.createObjectURL(file.value)
  showPreview.value = true
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Eventos de arrastrar
const handleDragOver = () => {
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

// Limpiar URL de vista previa al desmontar
onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
})
</script>