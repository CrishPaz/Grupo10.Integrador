<template>
  <AdminLayout>
    <div class="gestion-inventario-container py-6 px-4">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p class="text-gray-600 mt-2">Control de insumos médicos y materiales</p>
        </div>
        <div class="flex space-x-3">
          <button @click="abrirModalNuevoItem" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
            <PlusIcon class="h-5 w-5 mr-2" /> Nuevo Ítem
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8">
        <div class="bg-white rounded-lg shadow p-4 flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4"><ArchiveBoxIcon class="h-6 w-6"/></div>
          <div><p class="text-sm text-gray-600">Total Ítems</p><p class="text-2xl font-bold">{{ estadisticas.total_items }}</p></div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 flex items-center">
          <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4"><ExclamationTriangleIcon class="h-6 w-6"/></div>
          <div><p class="text-sm text-gray-600">Stock Crítico</p><p class="text-2xl font-bold text-red-600">{{ estadisticas.stock_critico }}</p></div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4"><ClockIcon class="h-6 w-6"/></div>
          <div><p class="text-sm text-gray-600">Por Vencer</p><p class="text-2xl font-bold text-yellow-600">{{ estadisticas.por_vencer }}</p></div>
        </div>
        <div class="bg-white rounded-lg shadow p-4 flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4"><CurrencyDollarIcon class="h-6 w-6"/></div>
          <div><p class="text-sm text-gray-600">Valor Total</p><p class="text-2xl font-bold">S/ {{ estadisticas.valor_total.toFixed(2) }}</p></div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Inventario Actual</h3>
          <input v-model="filtros.busqueda" type="text" placeholder="Buscar..." class="border rounded px-3 py-1 text-sm" />
        </div>
        
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ítem</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in itemsFiltrados" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.codigo }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-gray-900">{{ item.nombre }}</div>
                <div class="text-xs text-gray-500">{{ item.nombre_comercial }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ item.categoria }}</td>
              <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-bold rounded-full" 
                      :class="item.stock_actual <= item.stock_minimo ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'">
                  {{ item.stock_actual }} {{ item.tipo_unidad }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ item.ubicacion }}</td>
              <td class="px-6 py-4 text-sm font-medium flex space-x-2">
                <button class="text-blue-600 hover:text-blue-900" @click="editarItem(item)">Editar</button>
                <button class="text-green-600 hover:text-green-900" @click="registrarMovimiento(item)">Mover</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="mostrarModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 overflow-y-auto">
        <div class="bg-white p-6 rounded shadow-lg w-full max-w-2xl my-8">
          <h3 class="font-bold text-lg mb-4">{{ editando ? 'Editar Ítem' : 'Nuevo Ítem de Inventario' }}</h3>
          
          <form @submit.prevent="guardarItem" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Información Básica -->
            <div class="md:col-span-2">
              <h4 class="text-sm font-medium text-gray-500 border-b pb-1 mb-3">Información Básica</h4>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Código *</label>
              <input v-model="form.codigo" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" :disabled="editando">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre *</label>
              <input v-model="form.nombre" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre Comercial</label>
              <input v-model="form.nombre_comercial" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Categoría *</label>
              <select v-model="form.categoria" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                <option value="MEDICAMENTO">Medicamento</option>
                <option value="MATERIAL">Material Médico</option>
                <option value="REACTIVOS">Reactivos</option>
                <option value="MATERIAL_LAB">Material Laboratorio</option>
                <option value="EPP">EPP</option>
                <option value="GENERAL">Insumo General</option>
              </select>
            </div>

            <!-- Inventario y Ubicación -->
            <div class="md:col-span-2 mt-2">
              <h4 class="text-sm font-medium text-gray-500 border-b pb-1 mb-3">Inventario y Ubicación</h4>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Unidad de Medida</label>
              <select v-model="form.tipo_unidad" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
                <option value="UNIDAD">Unidad</option>
                <option value="CAJA">Caja</option>
                <option value="FRASCO">Frasco</option>
                <option value="PAQUETE">Paquete</option>
                <option value="KIT">Kit</option>
                <option value="GALON">Galón</option>
                <option value="ROLLO">Rollo</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Stock Actual</label>
              <input v-model.number="form.stock_actual" type="number" step="0.01" min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Stock Mínimo</label>
              <input v-model.number="form.stock_minimo" type="number" step="1" min="0" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Ubicación</label>
              <input v-model="form.ubicacion" type="text" placeholder="Ej: Estante A-1" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Lote</label>
              <input v-model="form.lote" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha Vencimiento</label>
              <input v-model="form.fecha_vencimiento" type="date" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <!-- Costos y Facturación -->
            <div class="md:col-span-2 mt-2">
              <h4 class="text-sm font-medium text-gray-500 border-b pb-1 mb-3">Costos y Facturación</h4>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Costo Unitario (Compra)</label>
              <div class="relative mt-1 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-gray-500 sm:text-sm">S/</span>
                </div>
                <input v-model.number="form.costo_unitario" type="number" step="0.01" min="0" class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="0.00">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Precio Venta (Público)</label>
              <div class="relative mt-1 rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span class="text-gray-500 sm:text-sm">S/</span>
                </div>
                <input v-model.number="form.precio_venta" type="number" step="0.01" min="0" class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="0.00">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">IGV (%)</label>
              <input v-model.number="form.iva_porcentaje" type="number" step="1" min="0" max="100" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2">
            </div>

            <!-- Acciones -->
            <div class="md:col-span-2 flex justify-end space-x-3 mt-6 border-t pt-4">
              <button @click="mostrarModal = false" type="button" class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Cancelar
              </button>
              <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                {{ editando ? 'Actualizar' : 'Guardar' }}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import { PlusIcon, ArchiveBoxIcon, ExclamationTriangleIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/vue/24/outline'

// Estado
const { data: inventoryData, refresh: refreshInventory, error: inventoryError } = await useFetch<any>('/api/inventory/items')

const items = computed(() => inventoryData.value?.items || [])
const estadisticas = computed(() => inventoryData.value?.stats || { total_items: 0, stock_critico: 0, por_vencer: 0, valor_total: 0 })

if (inventoryError.value) {
  console.error('Error loading inventory:', inventoryError.value)
}

const filtros = ref({ busqueda: '' })
const mostrarModal = ref(false)
const editando = ref(false)

const form = ref({
  id: '',
  codigo: '',
  nombre: '',
  nombre_comercial: '',
  categoria: 'MEDICAMENTO',
  tipo_unidad: 'UNIDAD',
  stock_actual: 0,
  stock_minimo: 5,
  ubicacion: '',
  lote: '',
  fecha_vencimiento: '',
  costo_unitario: 0,
  precio_venta: 0,
  iva_porcentaje: 18
})

const cargarDatos = async () => {
  await refreshInventory()
}

const itemsFiltrados = computed(() => {
  if (!filtros.value.busqueda) return items.value
  const q = filtros.value.busqueda.toLowerCase()
  return items.value.filter((i: any) => i.nombre.toLowerCase().includes(q) || i.codigo.toLowerCase().includes(q))
})

const abrirModalNuevoItem = () => {
  editando.value = false
  form.value = {
    id: '',
    codigo: '',
    nombre: '',
    nombre_comercial: '',
    categoria: 'MEDICAMENTO',
    tipo_unidad: 'UNIDAD',
    stock_actual: 0,
    stock_minimo: 5,
    ubicacion: '',
    lote: '',
    fecha_vencimiento: '',
    costo_unitario: 0,
    precio_venta: 0,
    iva_porcentaje: 18
  }
  mostrarModal.value = true
}

const editarItem = (item: any) => {
  editando.value = true
  form.value = { ...item, fecha_vencimiento: item.fecha_vencimiento ? item.fecha_vencimiento.split('T')[0] : '' }
  mostrarModal.value = true
}

// onMounted not needed for initial fetch with useFetch, but we can keep it empty or remove
onMounted(() => {
  // refreshInventory() // Auto-fetched by useFetch
})
const guardarItem = async () => {
  try {
    const endpoint = editando.value ? `/api/inventory/items/${form.value.id}` : '/api/inventory/items/create'
    const method = editando.value ? 'PUT' : 'POST'

    await $fetch(endpoint, {
      method,
      body: form.value
    })

    mostrarModal.value = false
    await cargarDatos()
    // Notificación de éxito (se puede implementar useToast aquí)
  } catch (error: any) {
    console.error('Error guardando ítem:', error)
    alert(error.data?.message || 'Error al guardar el ítem')
  }
}
const registrarMovimiento = (item: any) => {
  // Implementación futura
  alert('Funcionalidad de movimientos en desarrollo')
}
</script>

<style scoped>
.gestion-inventario-container { max-width: 1400px; margin: 0 auto; }
</style>