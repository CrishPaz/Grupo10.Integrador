<template>
  <AdminLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400">Bienvenido al panel de control principal.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStat title="Citas Hoy" value="12" change="+12%" icon="clock" color="blue" />
        <DashboardStat title="Pacientes Activos" value="245" change="+5%" icon="users" color="green" />
        <DashboardStat title="Ingresos Mes" value="S/ 12,450" change="+8%" icon="currency-dollar" color="purple" />
        <DashboardStat title="Tasa Aptitud" value="87.5%" change="-2%" icon="document-check" color="yellow" />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">Exámenes por Tipo</h3>
          <PieChart :data="examTypesData" :options="chartOptions" />
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">Tendencia de Consultas</h3>
          <LineChart :data="consultationTrendData" :options="chartOptions" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-900/50 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Actividad Reciente</h3>
        </div>
        <ul class="divide-y divide-gray-200 dark:divide-gray-700">
          <li v-for="activity in recentActivity" :key="activity.id" class="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <span class="text-2xl">{{ activity.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ activity.title }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ activity.description }}</p>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">{{ activity.time }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '~/components/AdminLayout.vue'
import DashboardStat from '~/components/Analytics/DashboardStat.vue'
import PieChart from '~/components/Analytics/Charts/PieChart.vue'
import LineChart from '~/components/Analytics/Charts/LineChart.vue'

// Datos Simulados
const examTypesData = ref({
  labels: ['Ingreso', 'Periódico', 'Retiro'],
  datasets: [{ data: [35, 40, 15], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'] }]
})

const consultationTrendData = ref({
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
  datasets: [{ label: 'Consultas', data: [120, 135, 142, 138, 155, 168], borderColor: '#3b82f6', tension: 0.1 }]
})

const chartOptions = { responsive: true, maintainAspectRatio: false }

const recentActivity = ref([
  { id: 1, title: 'Nueva admisión', description: 'Juan Pérez - Examen de ingreso', time: '10:30 AM', icon: '📝' },
  { id: 2, title: 'Resultado laboratorio', description: 'Hematología completada', time: '09:15 AM', icon: '🔬' },
  { id: 3, title: 'Pago registrado', description: 'Factura #001-123', time: 'Ayer', icon: '💰' }
])

definePageMeta({ middleware: ['auth'] })
</script>