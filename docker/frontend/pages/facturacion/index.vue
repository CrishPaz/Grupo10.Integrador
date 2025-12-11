<template>
  <AdminLayout>
    <div class="dashboard-container py-6 px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Facturación y Tesorería</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-2">Gestión integral de aspectos económicos</p>
        </div>
        <div class="text-sm text-gray-500 dark:text-gray-400">
          {{ new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Facturas Hoy</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.facturas_hoy }}</p>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span :class="stats.facturas_vs_ayer >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ stats.facturas_vs_ayer >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.facturas_vs_ayer) }}%
            </span> vs ayer
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Ingresos Hoy</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">S/ {{ stats.ingresos_hoy.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span :class="stats.ingresos_vs_ayer >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              {{ stats.ingresos_vs_ayer >= 0 ? '↑' : '↓' }} {{ Math.abs(stats.ingresos_vs_ayer) }}%
            </span> vs ayer
          </p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Pendiente de Cobro</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">S/ {{ stats.monto_pendiente.toFixed(2) }}</p>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ stats.facturas_pendientes }} facturas por cobrar</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600 dark:text-gray-400">Cajas Abiertas</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.cajas_abiertas }}</p>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
            </div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ stats.cajas_cerradas }} cajas cerradas hoy</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Acciones Rápidas</h3>
            <div class="space-y-3">
              <button @click="navigateTo('/facturacion/facturas/nueva')" class="w-full flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors">
                <div class="flex items-center"><span class="font-medium text-gray-800 dark:text-gray-100">Nueva Factura</span></div>
                <span class="dark:text-gray-300">→</span>
              </button>
              <button @click="navigateTo('/facturacion/caja/diaria')" class="w-full flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-800/50 rounded-lg transition-colors">
                <div class="flex items-center"><span class="font-medium text-gray-800 dark:text-gray-100">Caja Diaria</span></div>
                <span class="dark:text-gray-300">→</span>
              </button>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Estado SUNAT</h3>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Por enviar:</span>
                <span class="font-bold text-yellow-600 dark:text-yellow-400">{{ sunatStats.pendientes }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Aceptadas hoy:</span>
                <span class="font-bold text-green-600 dark:text-green-400">{{ sunatStats.aceptadas }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600 dark:text-gray-400">Rechazadas:</span>
                <span class="font-bold text-red-600 dark:text-red-400">{{ sunatStats.rechazadas }}</span>
              </div>
              <button class="w-full py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50" :disabled="sunatStats.pendientes === 0">
                Enviar Pendientes
              </button>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 p-6">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Ingresos por Método</h3>
              <select v-model="periodoGrafico" @change="actualizarGraficos" class="p-2 border dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 dark:text-gray-100">
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
              </select>
            </div>
            <div class="h-64 relative">
              <canvas ref="graficoIngresos"></canvas>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Facturas Recientes</h3>
            </div>
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Número</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cliente</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Total</th>
                  <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="factura in facturasRecientes" :key="factura.id">
                  <td class="px-4 py-3 text-sm font-medium text-indigo-600 dark:text-indigo-400">{{ factura.serie }}-{{ factura.numero }}</td>
                  <td class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{{ factura.receptor_razon_social }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 text-right font-bold">S/ {{ Number(factura.total).toFixed(2) }}</td>
                  <td class="px-4 py-3 text-center">
                    <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="factura.estado_pago === 'PAGADO' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'">
                      {{ factura.estado_pago }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import Chart from 'chart.js/auto'

// Interfaces
interface FacturaResumen {
  id: string
  serie: string
  numero: number
  receptor_razon_social: string
  total: number
  estado_pago: string
  fecha_emision: string
}

// Estados
const stats = ref({ facturas_hoy: 0, facturas_vs_ayer: 0, ingresos_hoy: 0, ingresos_vs_ayer: 0, monto_pendiente: 0, facturas_pendientes: 0, cajas_abiertas: 0, cajas_cerradas: 0 })
const sunatStats = ref({ pendientes: 0, aceptadas: 0, rechazadas: 0 })
const facturasRecientes = ref<FacturaResumen[]>([])
const periodoGrafico = ref('7d')
const graficoIngresos = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

// Carga de Datos (Simulada para visualización inmediata)
const cargarDatos = async () => {
  // Aquí llamaríamos a la API real: const res = await $fetch('/api/facturacion/dashboard/stats')
  
  // SIMULACIÓN:
  stats.value = {
    facturas_hoy: 12,
    facturas_vs_ayer: 5,
    ingresos_hoy: 1540.50,
    ingresos_vs_ayer: 12,
    monto_pendiente: 450.00,
    facturas_pendientes: 3,
    cajas_abiertas: 1,
    cajas_cerradas: 0
  }
  
  sunatStats.value = { pendientes: 2, aceptadas: 10, rechazadas: 0 }
  
  facturasRecientes.value = [
    { id: '1', serie: 'F001', numero: 1001, receptor_razon_social: 'Minería del Sur SAC', total: 1200.00, estado_pago: 'PAGADO', fecha_emision: new Date().toISOString() },
    { id: '2', serie: 'B001', numero: 502, receptor_razon_social: 'Juan Pérez', total: 150.00, estado_pago: 'PAGADO', fecha_emision: new Date().toISOString() },
    { id: '3', serie: 'F001', numero: 1002, receptor_razon_social: 'Constructora Norte', total: 450.00, estado_pago: 'PENDIENTE', fecha_emision: new Date().toISOString() }
  ]
  
  actualizarGraficos()
}

const actualizarGraficos = () => {
  if (!graficoIngresos.value) return
  if (chartInstance) chartInstance.destroy()
  
  const ctx = graficoIngresos.value.getContext('2d')
  if (!ctx) return
  
  // Datos simulados para el gráfico
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
      datasets: [
        { label: 'Efectivo', data: [500, 600, 450, 700, 800, 300], backgroundColor: '#10B981' },
        { label: 'Tarjeta', data: [300, 400, 350, 500, 600, 200], backgroundColor: '#3B82F6' }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  })
}

onMounted(() => {
  cargarDatos()
})

definePageMeta({ middleware: ['auth'] })
</script>

<style scoped>
.dashboard-container { max-width: 1400px; margin: 0 auto; }
</style>