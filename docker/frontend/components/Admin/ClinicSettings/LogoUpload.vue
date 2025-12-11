<template>
  <div>
    <!-- Vista previa del logo -->
    <div v-if="previewUrl" class="mb-4">
      <div class="relative w-32 h-32">
        <img :src="previewUrl" alt="Logo de la clínica" class="w-full h-full object-contain border rounded" />
        <button
          @click="removeLogo"
          type="button"
          class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 focus:outline-none"
        >
          <XMarkIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Área de subida -->
    <div
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors cursor-pointer"
      :class="{ 'border-indigo-500': isDragging }"
    >
      <input
        ref="fileInput"
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        class="hidden"
        @change="handleFileSelect"
      />
      
      <PhotoIcon class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm text-gray-600">
        Arrastra y suelta tu logo aquí, o haz clic para seleccionar
      </p>
      <p class="mt-1 text-xs text-gray-500">
        PNG, JPG, GIF hasta 2MB
      </p>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="mt-2 text-sm text-red-600">
      {{ error }}
    </div>

    <!-- Progreso de carga -->
    <div v-if="uploading" class="mt-4">
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div class="bg-indigo-600 h-2.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
      <p class="mt-1 text-sm text-gray-600 text-center">
        Subiendo... {{ uploadProgress }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits(['update:modelValue'])

const props = defineProps<{
  modelValue: string | null
}>()

const fileInput = ref<HTMLInputElement>()
const previewUrl = ref<string | null>(props.modelValue)
const isDragging = ref(false)
const error = ref<string | null>(null)
const uploading = ref(false)
const uploadProgress = ref(0)

// Observar cambios en el valor del modelo
watch(() => props.modelValue, (newValue) => {
  previewUrl.value = newValue
})

// Activar input de archivo
const triggerFileInput = () => {
  fileInput.value?.click()
}

// Manejar selección de archivo
const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    await processFile(input.files[0])
  }
}

// Manejar arrastrar y soltar
const handleDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer && event.dataTransfer.files[0]) {
    await processFile(event.dataTransfer.files[0])
  }
}

// Procesar archivo
const processFile = async (file: File) => {
  // Validar tamaño (2MB máximo)
  if (file.size > 2 * 1024 * 1024) {
    error.value = 'El archivo es demasiado grande. Máximo 2MB.'
    return
  }

  // Validar tipo
  const validTypes = ['image/jpeg', 'image/png', 'image/gif']
  if (!validTypes.includes(file.type)) {
    error.value = 'Formato de archivo no válido. Use JPG, PNG o GIF.'
    return
  }

  // Limpiar error previo
  error.value = null

  // Crear URL de vista previa
  previewUrl.value = URL.createObjectURL(file)

  // Simular carga (en producción, subiría al servidor)
  uploading.value = true
  uploadProgress.value = 0

  const interval = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(interval)
      uploading.value = false
      
      // Convertir a base64 para enviar al servidor
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        emit('update:modelValue', base64)
      }
      reader.readAsDataURL(file)
    }
  }, 100)
}

// Eliminar logo
const removeLogo = () => {
  previewUrl.value = null
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
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
