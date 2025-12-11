<template>
  <AdminLayout>
    <div class="seguimiento-servicios-container">
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Seguimiento de Servicios</h1>
            <p class="text-gray-600 mt-2">Monitoreo en tiempo real de muestras y resultados</p>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-3">
            <button @click="actualizarEstados" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              Actualizar
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="bg-white rounded-lg shadow p-4 flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">⏱️</div>
            <div>
              <p class="text-sm text-gray-600">En Tiempo</p>
              <p class="text-2xl font-bold text-green-600">{{ estadisticas.en_tiempo }}</p>
            </div>
          </div>
          
          <div class="bg-white rounded-lg shadow p-4 flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">⚠️</div>
            <div>
              <p class="text-sm text-gray-600">Retrasados</p>
              <p class="text-2xl font-bold text-yellow-600">{{ estadisticas.retrasados }}</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4 flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">🚨</div>
            <div>
              <p class="text-sm text-gray-600">Críticos</p>
              <p class="text-2xl font-bold text-red-600">{{ estadisticas.criticos }}</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-4 flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">✅</div>
            <div>
              <p class="text-sm text-gray-600">Completados</p>
              <p class="text-2xl font-bold text-gray-800">{{ estadisticas.completados_hoy }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Seguimientos Activos</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servicio</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="seg in seguimientos" :key="seg.id" class="hover:bg-gray-50">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ seg.paciente_nombre }}</div>
                  <div class="text-xs text-gray-500">DNI: {{ seg.paciente_dni }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ seg.tipo_servicio }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded text-xs font-bold" :class="estadoColor(seg.estado_actual)">
                    {{ seg.estado_actual }}
                  </span>
                  <div class="text-xs text-gray-500 mt-1">{{ formatDateTime(seg.fecha_estado_actual) }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ seg.ubicacion_actual }}</td>
                <td class="px-6 py-4 text-sm font-medium flex space-x-2">
                  <button @click="actualizarEstado(seg)" class="text-green-600 hover:text-green-900">Actualizar</button>
                  <button @click="verTimeline(seg)" class="text-purple-600 hover:text-purple-900">Timeline</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div v-if="mostrarTimeline && seguimientoSeleccionado" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <TimelineSeguimiento :seguimiento-id="seguimientoSeleccionado.id" @cerrar="mostrarTimeline = false" />
        </div>
      </div>
      
      <EstadoServicio v-if="mostrarModalEstado" :seguimiento="seguimientoParaEstado" @guardar="guardarEstadoActualizado" @cancelar="cerrarModalEstado" />
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import TimelineSeguimiento from '~/components/Logistica/TimelineSeguimiento.vue'
import EstadoServicio from '~/components/Logistica/EstadoServicio.vue'
import { useToast } from '~/composables/useToast'

interface Seguimiento {
  id: string
  paciente_nombre: string
  paciente_dni: string
  tipo_servicio: string
  estado_actual: string
  ubicacion_actual: string
  fecha_estado_actual: string
}

// Estado
const seguimientos = ref<Seguimiento[]>([])
const estadisticas = ref({ en_tiempo: 0, retrasados: 0, criticos: 0, completados_hoy: 0 })
const mostrarTimeline = ref(false)
const mostrarModalEstado = ref(false)
const seguimientoSeleccionado = ref<Seguimiento | null>(null)
const seguimientoParaEstado = ref<Seguimiento | null>(null)

// Funciones
const cargarDatos = async () => {
  // Simulación de datos (Mock)
  setTimeout(() => {
    estadisticas.value = { en_tiempo: 12, retrasados: 2, criticos: 1, completados_hoy: 8 }
    seguimientos.value = [
      { 
        id: '1', 
        paciente_nombre: 'Juan Pérez', 
        paciente_dni: '12345678', 
        tipo_servicio: 'LABORATORIO', 
        estado_actual: 'MUESTRA_TOMADA',
        ubicacion_actual: 'Consultorio 1',
        fecha_estado_actual: new Date().toISOString()
      },
      { 
        id: '2', 
        paciente_nombre: 'Maria Gomez', 
        paciente_dni: '87654321', 
        tipo_servicio: 'IMAGENES', 
        estado_actual: 'EN_PROCESO',
        ubicacion_actual: 'Rayos X',
        fecha_estado_actual: new Date().toISOString()
      }
    ]
  }, 500)
}

const actualizarEstados = () => cargarDatos()

const verTimeline = (seg: Seguimiento) => {
  seguimientoSeleccionado.value = seg
  mostrarTimeline.value = true
}

const actualizarEstado = (seg: Seguimiento) => {
  seguimientoParaEstado.value = seg
  mostrarModalEstado.value = true
}

const cerrarModalEstado = () => {
  mostrarModalEstado.value = false
  seguimientoParaEstado.value = null
}

const guardarEstadoActualizado = (data: any) => {
  useToast().success(`Estado actualizado a ${data.nuevo_estado}`)
  cerrarModalEstado()
  cargarDatos()
}

const estadoColor = (estado: string) => {
  if (estado.includes('RETRASADO')) return 'bg-red-100 text-red-800'
  if (estado.includes('PROCESO')) return 'bg-yellow-100 text-yellow-800'
  if (estado.includes('COMPLETADO')) return 'bg-green-100 text-green-800'
  return 'bg-gray-100 text-gray-800'
}

const formatDateTime = (d: string) => new Date(d).toLocaleString('es-PE')

onMounted(() => cargarDatos())

definePageMeta({ middleware: ['auth'] })
</script>

<style scoped>
.seguimiento-servicios-container { max-width: 1400px; margin: 0 auto; padding: 20px; }
</style>