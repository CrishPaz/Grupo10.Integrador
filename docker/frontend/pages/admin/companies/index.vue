
<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100 sm:text-3xl sm:truncate">
              Gestión de Empresas
            </h2>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <button @click="openModal()" type="button" class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
               Nueva Empresa
            </button>
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  RUC
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Razón Social
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dirección
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="company in companies" :key="company.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ company.ruc }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ company.razon_social }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ company.direccion || '-' }}
                </td>
                 <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {{ company.contacto_nombre || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openModal(company)" class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">Editar</button>
                  <button @click="deleteCompany(company)" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Eliminar</button>
                </td>
              </tr>
              <tr v-if="companies.length === 0">
                 <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No hay empresas registradas.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <CompanyModal 
      :show="showModal" 
      :company="selectedCompany" 
      @close="showModal = false"
      @save="handleSave"
    />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import CompanyModal from '~/components/Admin/CompanyModal.vue'
import { useToast } from '~/composables/useToast'

const companies = ref<any[]>([])
const showModal = ref(false)
const selectedCompany = ref<any>(null)
const toast = useToast()

const loadCompanies = async () => {
    try {
        companies.value = await $fetch('/api/admin/companies')
    } catch (error) {
        toast.error('Error cargando empresas')
    }
}

const openModal = (company = null) => {
    selectedCompany.value = company
    showModal.value = true
}

const handleSave = async (form: any) => {
    try {
        if (selectedCompany.value) {
            await $fetch(`/api/admin/companies/${selectedCompany.value.id}`, {
                method: 'PUT',
                body: form
            })
            toast.success('Empresa actualizada correctamente')
        } else {
            await $fetch('/api/admin/companies/create', {
                method: 'POST',
                body: form
            })
            toast.success('Empresa creada correctamente')
        }
        showModal.value = false
        loadCompanies()
    } catch (error: any) {
        toast.error('Error al guardar: ' + (error.data?.message || error.message))
    }
}

const deleteCompany = async (company: any) => {
    if (!confirm('¿Estás seguro de desactivar esta empresa?')) return

    try {
        await $fetch(`/api/admin/companies/${company.id}`, {
            method: 'DELETE'
        })
        toast.success('Empresa eliminada correctamente')
        loadCompanies()
    } catch (error: any) {
        toast.error('Error al eliminar: ' + error.message)
    }
}

onMounted(() => {
    loadCompanies()
})

definePageMeta({ middleware: ['auth'] })
</script>
