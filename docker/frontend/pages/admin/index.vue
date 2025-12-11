<template>
  <div class="min-h-screen bg-gray-50">
    <AdminLayout>
      <div class="py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Panel de Administración</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              Gestión central del sistema de salud laboral
            </p>
          </div>

          <!-- Estadísticas -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-md p-3">
                  <UserIcon class="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Usuarios Activos</h3>
                  <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.usuariosActivos }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-green-100 dark:bg-green-900/30 rounded-md p-3">
                  <BuildingOfficeIcon class="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Empresas Registradas</h3>
                  <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.empresasRegistradas }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 dark:bg-purple-900/30 rounded-md p-3">
                  <DocumentTextIcon class="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Conceptos Emitidos</h3>
                  <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.conceptosEmitidos }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Módulos de Administración -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink to="/admin/users" class="group">
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6 hover:shadow-lg transition-shadow duration-300">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 rounded-md p-3 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors">
                    <UserGroupIcon class="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                      Gestión de Usuarios
                    </h3>
                    <p class="mt-1 text-gray-600 dark:text-gray-400">
                      Administra usuarios, roles y permisos del sistema
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/clinic-settings" class="group">
              <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-green-100 rounded-md p-3 group-hover:bg-green-200">
                    <CogIcon class="h-8 w-8 text-green-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 group-hover:text-green-700">
                      Configuración Clínica
                    </h3>
                    <p class="mt-1 text-gray-600">
                      Datos de la clínica, SUNAT y personalización
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/integrations" class="group">
              <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-blue-100 rounded-md p-3 group-hover:bg-blue-200">
                    <LinkIcon class="h-8 w-8 text-blue-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-700">
                      Integraciones
                    </h3>
                    <p class="mt-1 text-gray-600">
                      APIs de pago, DNI, biométrico y notificaciones
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>

            <NuxtLink to="/admin/templates" class="group">
              <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-300">
                <div class="flex items-center">
                  <div class="flex-shrink-0 bg-yellow-100 rounded-md p-3 group-hover:bg-yellow-200">
                    <DocumentDuplicateIcon class="h-8 w-8 text-yellow-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900 group-hover:text-yellow-700">
                      Plantillas
                    </h3>
                    <p class="mt-1 text-gray-600">
                      Gestión de plantillas de documentos
                    </p>
                  </div>
                </div>
              </div>
            </NuxtLink>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <ShieldCheckIcon class="h-8 w-8 text-red-600" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Seguridad</h3>
                  <p class="mt-1 text-gray-600">
                    Logs de auditoría y políticas de acceso
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <CloudArrowDownIcon class="h-8 w-8 text-purple-600" />
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">Backups</h3>
                  <p class="mt-1 text-gray-600">
                    Respaldo y recuperación de datos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Últimos Logs -->
          <div class="mt-8">
            <div class="bg-white dark:bg-gray-800 shadow dark:shadow-gray-900/50 rounded-lg overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Actividad Reciente</h3>
              </div>
              <div class="divide-y divide-gray-200 dark:divide-gray-700">
                <div v-for="log in recentLogs" :key="log.id" class="px-6 py-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ log.accion }}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-400">{{ log.detalles }}</p>
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatTime(log.created_at) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CogIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  ShieldCheckIcon,
  CloudArrowDownIcon
} from '@heroicons/vue/24/outline'

// Definir tipos
interface Stats {
  usuariosActivos: number
  empresasRegistradas: number
  conceptosEmitidos: number
}

interface AuditLog {
  id: string
  accion: string
  detalles: string
  created_at: string
}

// Estado reactivo
const stats = ref<Stats>({
  usuariosActivos: 0,
  empresasRegistradas: 0,
  conceptosEmitidos: 0
})

const recentLogs = ref<AuditLog[]>([])

// Formatear tiempo relativo
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) {
    return `Hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
  } else if (diffHours < 24) {
    return `Hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  } else if (diffDays < 7) {
    return `Hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
  } else {
    return date.toLocaleDateString('es-PE')
  }
}

// Cargar datos iniciales
onMounted(async () => {
  await loadDashboardData()
})

const loadDashboardData = async () => {
  try {
    // Cargar estadísticas
    const [statsRes, logsRes] = await Promise.all([
      $fetch('/api/admin/dashboard/stats'),
      $fetch('/api/admin/audit-logs?limit=5')
    ])

// Forzamos el tipo con 'as'
  stats.value = statsRes as Stats
recentLogs.value = logsRes as AuditLog[]
  } catch (error) {
    console.error('Error cargando datos del dashboard:', error)
    useToast().error('Error al cargar datos del panel')
  }
}

// Middleware de seguridad
definePageMeta({
  middleware: ['auth', 'admin-only']
})
</script>
