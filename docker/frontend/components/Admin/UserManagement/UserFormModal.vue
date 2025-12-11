<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-10" @close="closeModal">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <div>
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                  <UserIcon class="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    {{ user ? 'Editar Usuario' : 'Nuevo Usuario' }}
                  </DialogTitle>
                  <div class="mt-2 text-left">
                    <form @submit.prevent="saveUser" class="space-y-4">
                      
                      <!-- DNI -->
                      <div>
                        <label for="dni" class="block text-sm font-medium text-gray-700">DNI</label>
                        <input type="text" v-model="form.dni" id="dni" required pattern="\d{8}" maxlength="8"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          :disabled="!!user" 
                        />
                      </div>

                      <!-- Nombres y Apellidos -->
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label for="nombres" class="block text-sm font-medium text-gray-700">Nombres</label>
                            <input type="text" v-model="form.nombres" id="nombres" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label for="apellidos" class="block text-sm font-medium text-gray-700">Apellidos</label>
                            <input type="text" v-model="form.apellidos" id="apellidos" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        </div>
                      </div>

                      <!-- Email -->
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" v-model="form.email" id="email" required
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                      </div>

                      <!-- Rol -->
                      <div>
                        <label for="role" class="block text-sm font-medium text-gray-700">Rol</label>
                        <select v-model="form.rol" id="role" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option value="admin">Administrador</option>
                            <option value="admissions">Admisiones</option>
                            <option value="doctor">Médico</option>
                            <option value="lab">Laboratorio</option>
                            <option value="patient">Paciente</option>
                        </select>
                      </div>

                      <!-- Password (Solo crear) -->
                      <div v-if="!user">
                        <label for="password" class="block text-sm font-medium text-gray-700">Contraseña Temporal</label>
                        <input type="password" v-model="form.password" id="password" required minlength="6"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                        <p class="text-xs text-gray-500 mt-1">El usuario deberá cambiarla al iniciar sesión.</p>
                      </div>

                    </form>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                  @click="saveUser"
                  :disabled="saving"
                >
                  <span v-if="saving">Guardando...</span>
                  <span v-else>Guardar</span>
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                  @click="closeModal"
                  ref="cancelButtonRef"
                >
                  Cancelar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { UserIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  show: boolean
  user?: any
}>()

const emit = defineEmits(['close', 'saved'])

const saving = ref(false)
const form = ref({
    dni: '',
    nombres: '',
    apellidos: '',
    email: '',
    rol: 'doctor',
    password: ''
})

// Reset form when opening/closing or changing user
watch(() => props.show, (val) => {
    if (val) {
        if (props.user) {
            form.value = { ...props.user, password: '' }
        } else {
            form.value = {
                dni: '',
                nombres: '',
                apellidos: '',
                email: '',
                rol: 'doctor',
                password: ''
            }
        }
    }
})

const closeModal = () => {
  emit('close')
}

const saveUser = async () => {
    saving.value = true
    try {
        const url = props.user 
            ? `/api/admin/users/${props.user.id}` 
            : '/api/admin/users/create'
        
        const method = props.user ? 'PUT' : 'POST'

        // Si estamos editando, eliminamos password si está vacío para no enviarlo (o la API lo ignora)
        // En este caso simple, create.post requiere pass, update lo manejaría backend.
        // Como 'create' es POST, siempre enviamos.
        
        await $fetch(url, {
            method,
            body: form.value
        })

        useToast().success(props.user ? 'Usuario actualizado' : 'Usuario creado')
        emit('saved')
        closeModal()
    } catch (error: any) {
        console.error(error)
        useToast().error(error.data?.message || 'Error al guardar usuario')
    } finally {
        saving.value = false
    }
}
</script>