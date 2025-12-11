<template>
  <AdminLayout>
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard de Analítica</h1>
        <p class="text-gray-600 dark:text-gray-400">Métricas y tendencias para la toma de decisiones</p>
      </div>
      
      <div class="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow dark:shadow-gray-900/50 flex flex-wrap gap-4 items-center">
        <select v-model="period" @change="fetchDashboardData" class="border dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-gray-100">
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
          <option value="quarter">Último trimestre</option>
          <option value="year">Último año</option>
        </select>
        
        <button @click="refreshData" class="bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-600">
          Actualizar
        </button>

        <button @click="navigateTo('/analytics/reports')" class="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-700 dark:hover:bg-indigo-600">
          Generador de Reportes
        </button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardStat
          v-for="stat in summaryStats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :change="stat.change"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">Tendencias Mensuales</h3>
          <LineChart :data="trendsData" :options="trendsOptions" />
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">Distribución de Exámenes</h3>
          <PieChart :data="examDistribution" :options="pieOptions" />
        </div>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">Top Empresas</h3>
          <DataTable :columns="companyColumns" :data="topCompanies" />
        </div>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow dark:shadow-gray-900/50">
          <h3 class="text-lg font-semibold mb-4 dark:text-gray-100">Tareas Pendientes</h3>
          <DataTable :columns="taskColumns" :data="pendingTasks" />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AdminLayout from '~/components/AdminLayout.vue'
import DashboardStat from '~/components/Analytics/DashboardStat.vue';
import LineChart from '~/components/Analytics/Charts/LineChart.vue';
import PieChart from '~/components/Analytics/Charts/PieChart.vue';
import DataTable from '~/components/Analytics/DataTable.vue';

const period = ref('month');
const loading = ref(false);

// Datos reactivos
interface SummaryStat {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  color: string;
}

const summaryStats = ref<SummaryStat[]>([]);
const trendsData = ref<any>({});
const examDistribution = ref<any>({});
const topCompanies = ref<any[]>([]);
const pendingTasks = ref<any[]>([]);

// Configuración de columnas
const companyColumns = [
  { key: 'empresa', label: 'Empresa' },
  { key: 'total', label: 'Ingresos Totales', format: 'currency' }
];

const taskColumns = [
  { key: 'tipo', label: 'Tipo Tarea' },
  { key: 'cantidad', label: 'Cantidad' }
];

const trendsOptions = { responsive: true, plugins: { legend: { position: 'top' } } };
const pieOptions = { responsive: true, plugins: { legend: { position: 'right' } } };

async function fetchDashboardData() {
  loading.value = true;
  try {
    // LLAMADA A LA API REAL QUE CREAMOS
    const response: any = await $fetch(`/api/analytics/dashboards?period=${period.value}`);
    
    if (response.success) {
      const data = response.data;
      
      // Mapear resumen
      summaryStats.value = [
        { title: 'Atenciones Totales', value: data.summary.total_atenciones, change: '+5%', icon: 'users', color: 'blue' },
        { title: 'Empresas Activas', value: data.summary.empresas_activas, change: '+2', icon: 'user-group', color: 'green' },
        { title: 'Ingresos Totales', value: `S/ ${Number(data.summary.ingresos_totales).toFixed(2)}`, change: '+12%', icon: 'currency-dollar', color: 'purple' },
        { title: 'Tiempo Promedio', value: '4.5h', change: '-10%', icon: 'clock', color: 'yellow' }
      ];
      
      // Mapear tendencias
      trendsData.value = {
        labels: data.trends.map((t: any) => t.mes),
        datasets: [
          { label: 'Exámenes', data: data.trends.map((t: any) => t.total_examenes), borderColor: 'rgb(59, 130, 246)', tension: 0.1 },
          { label: 'Aptos', data: data.trends.map((t: any) => t.aptos), borderColor: 'rgb(16, 185, 129)', tension: 0.1 }
        ]
      };
      
      // Mapear Top Empresas
      topCompanies.value = data.topCompanies;
      
      // Datos simulados para gráfico circular (mientras llenamos más datos reales)
      examDistribution.value = {
        labels: ['Laboratorio', 'Rayos X', 'Psicología', 'Medicina'],
        datasets: [{ data: [45, 25, 15, 15], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] }]
      };
      
      // Tareas pendientes simuladas
      pendingTasks.value = [
        { tipo: 'Resultados por validar', cantidad: 12 },
        { tipo: 'Facturas por cobrar', cantidad: 5 },
        { tipo: 'Citas por confirmar', cantidad: 8 }
      ];
    }
  } catch (error) {
    console.error('Error fetching dashboard:', error);
  } finally {
    loading.value = false;
  }
}

const refreshData = () => fetchDashboardData();

onMounted(() => {
  fetchDashboardData();
});

definePageMeta({ 
  middleware: ['auth', 'analytics-guard'] 
})
</script>