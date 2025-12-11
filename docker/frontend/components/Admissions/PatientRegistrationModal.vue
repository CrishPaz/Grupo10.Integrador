<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button @click="$emit('close')" type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <span class="sr-only">Cerrar</span>
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div class="sm:flex sm:items-start">
          <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
            <UserPlusIcon class="h-6 w-6 text-indigo-600" aria-hidden="true" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ patientToEdit ? 'Editar Paciente' : 'Registrar Nuevo Paciente' }}
            </h3>
            <div class="mt-2">
              <p class="text-sm text-gray-500 mb-4">
                Complete los datos del paciente para registrarlo en el sistema.
              </p>
              
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="dni" class="block text-sm font-medium text-gray-700">DNI</label>
                    <input type="text" id="dni" v-model="form.dni" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="fecha_nacimiento" class="block text-sm font-medium text-gray-700">Fecha Nacimiento</label>
                    <input type="date" id="fecha_nacimiento" v-model="form.fecha_nacimiento" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres</label>
                    <input type="text" id="nombres" v-model="form.nombres" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="apellidos" class="block text-sm font-medium text-gray-700">Apellidos</label>
                    <input type="text" id="apellidos" v-model="form.apellidos" required
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>

                <div>
                  <label for="genero" class="block text-sm font-medium text-gray-700">Género</label>
                  <select id="genero" v-model="form.genero" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Seleccione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                  </select>
                </div>

                <div>
                  <label for="empresa" class="block text-sm font-medium text-gray-700">Empresa (Opcional)</label>
                  <select id="empresa" v-model="form.empresa_id" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="">Ninguna / Particular</option>
                    <option v-for="company in companies" :key="company.id" :value="company.id">{{ company.razon_social }}</option>
                  </select>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input type="tel" id="telefono" v-model="form.telefono"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" v-model="form.email"
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button @click="handleSubmit" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
            Registrar
          </button>
          <button @click="$emit('close')" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { XMarkIcon, UserPlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  show: boolean,
  patientToEdit?: any
}>()

const emit = defineEmits(['close', 'patient-registered', 'patient-updated'])

const form = ref({
  id: '',
  dni: '',
  nombres: '',
  apellidos: '',
  fecha_nacimiento: '',
  genero: '',
  telefono: '',
  email: '',
  empresa_id: ''
})

const companies = ref<any[]>([])

onMounted(async () => {
  try {
    companies.value = await $fetch<any[]>('/api/admin/companies')
  } catch (e) {
    console.error('Error loading companies', e)
  }
})

// Watch for changes in patientToEdit or show to populate form
watch(() => props.show, (newVal) => {
  if (newVal) {
    if (props.patientToEdit) {
      // Edit Mode
      const p = props.patientToEdit
      form.value = {
        id: p.id,
        dni: p.dni || '',
        nombres: p.nombres || '',
        apellidos: p.apellidos || '',
        fecha_nacimiento: p.fecha_nacimiento ? p.fecha_nacimiento.split('T')[0] : '',
        genero: p.genero || '',
        telefono: p.telefono || '',
        email: p.email || '',
        empresa_id: p.empresa_id || p.empresa?.id || ''
      }
    } else {
      // Create Mode - Reset
      form.value = {
        id: '',
        dni: '',
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        genero: '',
        telefono: '',
        email: '',
        empresa_id: ''
      }
    }
  }
})

const handleSubmit = async () => {
  if (!form.value.dni || !form.value.nombres || !form.value.apellidos) {
    alert('Por favor complete los campos obligatorios')
    return
  }

  try {
    if (props.patientToEdit) {
      // Update
      const response = await $fetch<any>(`/api/patients/${form.value.id}`, {
        method: 'PUT',
        body: form.value
      })
      
      // Emit full updated patient object
      const updatedPatient = {
        ...response,
        dni: response.usuarioUsuario?.dni || form.value.dni,
        nombres: response.usuarioUsuario?.nombres || form.value.nombres,
        apellidos: response.usuarioUsuario?.apellidos || form.value.apellidos,
        empresa: response.empresa
      }

      emit('patient-updated', updatedPatient)
      alert('Paciente actualizado correctamente')
    } else {
      // Create
      const response = await $fetch<{ success: boolean; user: any; patient: any }>('/api/patients/create', {
        method: 'POST',
        body: form.value
      })

      const newPatient = {
        id: response.patient.id, 
        dni: response.user.dni,
        nombres: response.user.nombres,
        apellidos: response.user.apellidos,
        empresa: companies.value.find(c => c.id === form.value.empresa_id) || null
      }

      emit('patient-registered', newPatient)
    }
    
    emit('close')
    
  } catch (error: any) {
    console.error('Error registrando/actualizando paciente:', error)
    alert(error.data?.message || 'Error al procesar paciente')
  }
}
</script>
