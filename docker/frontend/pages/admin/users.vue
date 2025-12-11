<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header con acciones -->
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Gestión de Usuarios
            </h2>
            <p class="mt-1 text-sm text-gray-600">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <button
              @click="showImportModal = true"
              class="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
              Importar
            </button>
            <button
              @click="showUserForm = true"
              class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Nuevo Usuario
            </button>
          </div>
        </div>

        <!-- Filtros -->
        <div class="mb-6 bg-white p-4 rounded-lg shadow">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
              <input
                v-model="filters.search"
                type="text"
                placeholder="Nombre, DNI o email..."
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                v-model="filters.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos los roles</option>
                <option v-for="role in roles" :key="role.value" :value="role.value">
                  {{ role.label }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                v-model="filters.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
            <div class="flex items-end">
              <button
                @click="applyFilters"
                class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Filtrar
              </button>
            </div>
          </div>
        </div>

        <!-- Tabla de usuarios -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div v-if="loading" class="p-8 text-center">
            <Spinner class="h-8 w-8 mx-auto text-indigo-600" />
            <p class="mt-2 text-gray-600">Cargando usuarios...</p>
          </div>

          <ul v-else class="divide-y divide-gray-200">
            <li v-for="user in users" :key="user.id">
              <div class="px-4 py-4 sm:px-6">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span class="text-indigo-800 font-medium">
                          {{ user.nombres.charAt(0) }}{{ user.apellidos.charAt(0) }}
                        </span>
                      </div>
                    </div>
                    <div class="ml-4">
                      <div class="flex items-center">
                        <p class="text-sm font-medium text-gray-900">
                          {{ user.nombres }} {{ user.apellidos }}
                        </p>
                        <RoleBadge :role="user.rol" class="ml-2" />
                      </div>
                      <div class="mt-1 flex items-center text-sm text-gray-500">
                        <span class="mr-4">{{ user.dni }}</span>
                        <span>{{ user.email }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ user.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                    <div class="relative">
                      <button
                        @click="toggleActions(user.id)"
                        class="inline-flex items-center p-1 border border-gray-300 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <EllipsisVerticalIcon class="h-5 w-5" />
                      </button>
                      
                      <!-- Menú de acciones -->
                      <div
                        v-if="activeActions === user.id"
                        class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                      >
                        <div class="py-1" role="menu">
                          <button
                            @click="editUser(user)"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Editar
                          </button>
                          <button
                            @click="toggleUserStatus(user)"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            {{ user.activo ? 'Desactivar' : 'Activar' }}
                          </button>
                          <button
                            @click="resetPassword(user.id)"
                            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Resetear Contraseña
                          </button>
                          <button
                            @click="deleteUser(user.id)"
                            class="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100 w-full text-left"
                            role="menuitem"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-changed="changePage"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de creación/edición de usuario -->
    <UserFormModal
      :show="showUserForm"
      :user="selectedUser"
      @close="closeUserForm"
      @saved="refreshUsers"
    />

    <!-- Modal de importación -->
    <ImportUsersModal
      :show="showImportModal"
      @close="showImportModal = false"
      @imported="refreshUsers"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import {
  PlusIcon,
  EllipsisVerticalIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

import AdminLayout from '~/components/AdminLayout.vue'
import Spinner from '~/components/Common/Spinner.vue'
import Pagination from '~/components/Common/Pagination.vue'
import RoleBadge from '~/components/Admin/UserManagement/RoleBadge.vue'
import ImportUsersModal from '~/components/Admin/UserManagement/ImportUsersModal.vue'
import UserFormModal from '~/components/Admin/UserManagement/UserFormModal.vue'

// Definir tipos
interface User {
  id: string
  dni: string
  email: string
  nombres: string
  apellidos: string
  rol: string
  activo: boolean
  telefono?: string
  especialidad?: string
  colegiatura?: string
}

interface Filters {
  search: string
  role: string
  status: string
}

// Estado reactivo
const users = ref<User[]>([])
const selectedUser = ref<User | null>(null)
const loading = ref(true)
const activeActions = ref<string | null>(null)
const showUserForm = ref(false)
const showImportModal = ref(false)

// Filtros y paginación
const filters = ref<Filters>({
  search: '',
  role: '',
  status: ''
})
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 20

// Roles disponibles
const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'admissions', label: 'Admisiones' },
  { value: 'doctor', label: 'Médico' },
  { value: 'lab', label: 'Laboratorio' },
  { value: 'patient', label: 'Paciente' }
]

// Cargar usuarios
const loadUsers = async () => {
  loading.value = true
  try {
    const query = new URLSearchParams({
      page: currentPage.value.toString(),
      limit: pageSize.toString(),
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.role && { role: filters.value.role }),
      ...(filters.value.status && { status: filters.value.status })
    })

    const response = await $fetch(`/api/admin/users?${query}`)
    users.value = response.data as User[]
    totalPages.value = response.meta.totalPages
  } catch (error) {
    console.error('Error cargando usuarios:', error)
    useToast().error('Error al cargar usuarios')
  } finally {
    loading.value = false
  }
}

// Aplicar filtros
const applyFilters = () => {
  currentPage.value = 1
  loadUsers()
}

// Cambiar página
const changePage = (page: number) => {
  currentPage.value = page
  loadUsers()
}

// Editar usuario
const editUser = (user: User) => {
  selectedUser.value = { ...user }
  showUserForm.value = true
  activeActions.value = null
}

// Alternar estado del usuario
const toggleUserStatus = async (user: User) => {
  try {
    await $fetch(`/api/admin/users/${user.id}/toggle-status`, {
      method: 'PUT' as any
    })
    
    useToast().success(`Usuario ${user.activo ? 'desactivado' : 'activado'} correctamente`)
    loadUsers()
  } catch (error) {
    useToast().error('Error al cambiar estado del usuario')
  }
}

// Resetear contraseña
const resetPassword = async (userId: string) => {
  if (!confirm('¿Está seguro de resetear la contraseña de este usuario?')) return

  try {
    await $fetch(`/api/admin/users/${userId}/reset-password`, {
      method: 'POST'
    })
    
    useToast().success('Contraseña reseteada correctamente')
  } catch (error) {
    useToast().error('Error al resetear contraseña')
  }
}

// Eliminar usuario
const deleteUser = async (userId: string) => {
  if (!confirm('¿Está seguro de eliminar este usuario?')) return

  try {
    await $fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE' as any
    })
    
    useToast().success('Usuario eliminado correctamente')
    loadUsers()
  } catch (error) {
    useToast().error('Error al eliminar usuario')
  }
}

// Cerrar formulario de usuario
const closeUserForm = () => {
  showUserForm.value = false
  selectedUser.value = null
}

// Refrescar lista de usuarios
const refreshUsers = () => {
  loadUsers()
}

// Alternar menú de acciones
const toggleActions = (userId: string) => {
  activeActions.value = activeActions.value === userId ? null : userId
}

// Cargar usuarios al montar el componente
onMounted(() => {
  loadUsers()
})

// Middleware de seguridad
definePageMeta({
  middleware: ['auth', 'admin-only']
})
</script>
