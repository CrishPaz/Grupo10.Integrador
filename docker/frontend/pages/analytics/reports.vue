<template>
  <AdminLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Generador de Informes</h1>
        <p class="text-gray-600">Exporta datos detallados a Excel</p>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow h-fit">
          <h3 class="text-lg font-semibold mb-4">Configuración</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select v-model="config.reportType" class="w-full border rounded px-3 py-2">
                <option value="monthly_exams">Exámenes por Mes</option>
                <option value="ingresos_empresa">Ingresos por Empresa</option>
                <option value="conceptos_aptitud">Aptitudes Médicas</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input type="date" v-model="config.startDate" class="w-full border rounded px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input type="date" v-model="config.endDate" class="w-full border rounded px-3 py-2">
              </div>
            </div>
            
            <button @click="generateReport" :disabled="loading" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {{ loading ? 'Generando...' : 'Generar Vista Previa' }}
            </button>
            
            <div class="flex gap-2" v-if="reportData.length > 0">
              <button @click="exportExcel" class="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">
                Excel
              </button>
              <button @click="exportPdf" class="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700">
                PDF
              </button>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          <div class="p-4 border-b">
            <h3 class="font-semibold">Vista Previa</h3>
          </div>
          <div class="p-4 overflow-auto">
             <DataTable v-if="reportData.length > 0" :columns="columns" :data="reportData" />
             <div v-else class="text-center text-gray-500 py-10">Selecciona parámetros y genera un reporte</div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import DataTable from '~/components/Analytics/DataTable.vue'

const loading = ref(false)
const reportData = ref([])
const config = ref({
  reportType: 'monthly_exams',
  startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0]
})

const columns = computed(() => {
  if (reportData.value.length === 0) return []
  return Object.keys(reportData.value[0]).map(key => ({ 
    key, 
    label: key.replace(/_/g, ' ').toUpperCase() 
  }))
})

const generateReport = async () => {
  loading.value = true
  try {
    const res = await $fetch('/api/analytics/reports', {
      method: 'POST',
      body: config.value
    })
    if (res.success) reportData.value = res.data
  } catch (e) {
    alert('Error generando reporte')
  } finally {
    loading.value = false
  }
}

const exportPdf = async () => {
  try {
    const res = await $fetch('/api/analytics/exports', {
      method: 'POST',
      body: { ...config.value, data: reportData.value, format: 'pdf' },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(res)
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte_${config.value.reportType}.pdf`
    link.click()
  } catch (e) {
    alert('Error exportando PDF')
  }
}

const exportExcel = async () => {
  try {
    const res = await $fetch('/api/analytics/exports', {
      method: 'POST',
      body: { ...config.value, data: reportData.value, format: 'excel' },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(res)
    const link = document.createElement('a')
    link.href = url
    link.download = `reporte_${config.value.reportType}.xlsx`
    link.click()
  } catch (e) {
    alert('Error exportando Excel')
  }
}
definePageMeta({ 
  middleware: ['auth', 'analytics-guard'] 
})
</script>