<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Configuración de la Clínica
            </h2>
            <p class="mt-1 text-sm text-gray-600">
              Datos de la clínica, configuración SUNAT y personalización
            </p>
          </div>
        </div>

        <!-- Formulario de configuración -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">Información General</h3>
          </div>

          <form @submit.prevent="saveSettings" class="px-6 py-6 space-y-6">
            <!-- Logo de la clínica -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <LogoUpload v-model="settings.logo" />
              <p class="mt-1 text-sm text-gray-500">
                Sube el logo de la clínica en formato PNG o JPG (máx. 2MB)
              </p>
            </div>

            <!-- Información básica -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="nombre" class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Clínica *
                </label>
                <input
                  v-model="settings.nombre"
                  type="text"
                  id="nombre"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label for="ruc" class="block text-sm font-medium text-gray-700 mb-1">
                  RUC *
                </label>
                <input
                  v-model="settings.ruc"
                  type="text"
                  id="ruc"
                  required
                  pattern="\d{11}"
                  maxlength="11"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label for="telefono" class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  v-model="settings.telefono"
                  type="tel"
                  id="telefono"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contacto *
                </label>
                <input
                  v-model="settings.email"
                  type="email"
                  id="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label for="direccion" class="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <textarea
                v-model="settings.direccion"
                id="direccion"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <!-- Configuración SUNAT -->
            <div class="border-t pt-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Configuración SUNAT</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label for="sunat_usuario" class="block text-sm font-medium text-gray-700 mb-1">
                    Usuario SUNAT
                  </label>
                  <input
                    v-model="settings.sunat_usuario"
                    type="text"
                    id="sunat_usuario"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label for="sunat_password" class="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña SUNAT
                  </label>
                  <div class="relative">
                    <input
                      v-model="settings.sunat_password"
                      :type="showSunatPassword ? 'text' : 'password'"
                      id="sunat_password"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                    />
                    <button
                      type="button"
                      @click="showSunatPassword = !showSunatPassword"
                      class="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <EyeIcon v-if="!showSunatPassword" class="h-5 w-5 text-gray-400" />
                      <EyeSlashIcon v-else class="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div>
                  <label for="sunat_ambiente" class="block text-sm font-medium text-gray-700 mb-1">
                    Ambiente
                  </label>
                  <select
                    v-model="settings.sunat_ambiente"
                    id="sunat_ambiente"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="beta">Beta (Pruebas)</option>
                    <option value="produccion">Producción</option>
                  </select>
                </div>

                <div class="flex items-end">
                  <button
                    type="button"
                    @click="testSunatConnection"
                    :disabled="testingSunat"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {{ testingSunat ? 'Probando...' : 'Probar Conexión SUNAT' }}
                  </button>
                </div>
              </div>

              <div v-if="sunatTestResult" class="mt-4 p-3 rounded-md"
                :class="sunatTestResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                {{ sunatTestResult.message }}
              </div>
            </div>

            <!-- Configuración del sistema -->
            <div class="border-t pt-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Configuración del Sistema</h4>
              
              <div class="space-y-4">
                <div class="flex items-center">
                  <input
                    v-model="settings.maintenance_mode"
                    type="checkbox"
                    id="maintenance_mode"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label for="maintenance_mode" class="ml-2 block text-sm text-gray-700">
                    Modo Mantenimiento
                  </label>
                </div>

                <div>
                  <label for="timezone" class="block text-sm font-medium text-gray-700 mb-1">
                    Zona Horaria
                  </label>
                  <select
                    v-model="settings.timezone"
                    id="timezone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="America/Lima">Lima, Perú (GMT-5)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="border-t pt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {{ saving ? 'Guardando...' : 'Guardar Configuración' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import LogoUpload from '~/components/Admin/ClinicSettings/LogoUpload.vue'

// Definir tipos
interface ClinicSettings {
  nombre: string
  ruc: string
  direccion: string
  telefono: string
  email: string
  logo: string | null
  sunat_usuario: string
  sunat_password: string
  sunat_ambiente: 'beta' | 'produccion'
  maintenance_mode: boolean
  timezone: string
}

interface SunatTestResult {
  success: boolean
  message: string
}

// Estado reactivo
const settings = ref<ClinicSettings>({
  nombre: '',
  ruc: '',
  direccion: '',
  telefono: '',
  email: '',
  logo: null,
  sunat_usuario: '',
  sunat_password: '',
  sunat_ambiente: 'beta',
  maintenance_mode: false,
  timezone: 'America/Lima'
})

const showSunatPassword = ref(false)
const saving = ref(false)
const testingSunat = ref(false)
const sunatTestResult = ref<SunatTestResult | null>(null)

// Cargar configuración actual
const loadSettings = async () => {
  try {
    const data = await $fetch('/api/admin/clinic/settings')
    settings.value = data as ClinicSettings
  } catch (error) {
    console.error('Error cargando configuración:', error)
    useToast().error('Error al cargar configuración')
  }
}

// Guardar configuración
const saveSettings = async () => {
  saving.value = true
  try {
    await $fetch('/api/admin/clinic/settings', {
      method: 'PUT',
      body: settings.value
    })
    
    useToast().success('Configuración guardada correctamente')
    
    // Registrar en logs de auditoría
    await $fetch('/api/admin/audit-logs', {
      method: 'POST',
      body: {
        accion: 'UPDATE_CLINIC_SETTINGS',
        modulo: 'admin',
        detalles: 'Configuración de clínica actualizada'
      }
    })
  } catch (error) {
    console.error('Error guardando configuración:', error)
    useToast().error('Error al guardar configuración')
  } finally {
    saving.value = false
  }
}

// Probar conexión SUNAT
const testSunatConnection = async () => {
  if (!settings.value.sunat_usuario || !settings.value.sunat_password) {
    useToast().warning('Complete usuario y contraseña SUNAT')
    return
  }

  testingSunat.value = true
  sunatTestResult.value = null

  try {
    const result: any = await $fetch('/api/admin/integrations/sunat/test', {
      method: 'POST',
      body: {
        usuario: settings.value.sunat_usuario,
        password: settings.value.sunat_password,
        ambiente: settings.value.sunat_ambiente
      }
    })

    sunatTestResult.value = result as SunatTestResult
    
    // Registrar en logs de auditoría
    await $fetch('/api/admin/audit-logs', {
      method: 'POST',
      body: {
        accion: 'TEST_SUNAT_CONNECTION',
        modulo: 'admin',
        detalles: `Prueba de conexión SUNAT: ${result.success ? 'Exitosa' : 'Fallida'}`
      }
    })
  } catch (error) {
    sunatTestResult.value = {
      success: false,
      message: 'Error en la prueba de conexión'
    }
  } finally {
    testingSunat.value = false
  }
}

// Resetear formulario
const resetForm = () => {
  if (confirm('¿Desea descartar los cambios?')) {
    loadSettings()
    sunatTestResult.value = null
  }
}

// Cargar configuración al montar el componente
onMounted(() => {
  loadSettings()
})

// Middleware de seguridad
definePageMeta({
  middleware: ['auth', 'admin-only']
})
</script>
