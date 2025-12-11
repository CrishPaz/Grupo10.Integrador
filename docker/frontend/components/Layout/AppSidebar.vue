<template>
  <aside class="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 min-h-[calc(100vh-4rem)] hidden md:block">
    <nav class="p-4 space-y-6">
      
      <div v-if="user?.rol === 'admin'" class="space-y-1">
        <SidebarItem to="/dashboard" icon="dashboard">Dashboard</SidebarItem>
        <SidebarItem to="/admissions" icon="clipboard-document-list">Admisiones</SidebarItem>
        <SidebarItem to="/medical" icon="user-group">Área Médica</SidebarItem>
        <SidebarItem to="/laboratory" icon="beaker">Laboratorio</SidebarItem>
        <SidebarItem to="/facturacion" icon="currency-dollar">Facturación</SidebarItem>
        <SidebarItem to="/inventario-logistica/inventario" icon="archive-box">Inventario</SidebarItem>
        <SidebarItem to="/analytics" icon="chart-bar">Analítica</SidebarItem>
        <SidebarItem to="/biometric/register" icon="fingerprint">Biométrico</SidebarItem>
        <SidebarItem to="/admin" icon="cog-6-tooth">Administración</SidebarItem>
        <SidebarItem to="/admin/companies" icon="building-office">Gestión Empresas</SidebarItem>
      </div>
      
      <div v-else-if="user?.rol === 'admissions'" class="space-y-1">
        <SidebarItem to="/dashboard" icon="dashboard">Dashboard</SidebarItem>
        <SidebarItem to="/admissions" icon="clipboard-document-list">
          Admisiones
          <span v-if="pendingAdmissions > 0" class="ml-auto px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">{{ pendingAdmissions }}</span>
        </SidebarItem>
        <SidebarItem to="/patients" icon="users">Pacientes</SidebarItem>
        <SidebarItem to="/companies" icon="building-office">Empresas</SidebarItem>
        <SidebarItem to="/biometric/checkin" icon="fingerprint">Check-in</SidebarItem>
        <SidebarItem to="/schedule" icon="calendar">Calendario</SidebarItem>
      </div>

      <div v-else-if="user?.rol === 'doctor'" class="space-y-1">
        <SidebarItem to="/dashboard" icon="dashboard">Dashboard</SidebarItem>
        <SidebarItem to="/medical/today" icon="clock">
          Citas de Hoy
          <span v-if="todayAppointments > 0" class="ml-auto px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full font-medium">{{ todayAppointments }}</span>
        </SidebarItem>
        <SidebarItem to="/medical/clinical-history" icon="document-text">Historias Clínicas</SidebarItem>
        <SidebarItem to="/medical/exams" icon="beaker">Exámenes</SidebarItem>
        <SidebarItem to="/medical/aptitude" icon="document-check">Aptitud</SidebarItem>
      </div>

      <div v-else-if="user?.rol === 'patient'" class="space-y-1">
        <SidebarItem to="/dashboard" icon="dashboard">Mi Salud</SidebarItem>
        <SidebarItem to="/my-appointments" icon="calendar">Mis Citas</SidebarItem>
        <SidebarItem to="/my-results" icon="document-text">Resultados</SidebarItem>
      </div>

      <div class="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700">
        <div class="px-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
          <p class="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">Estado del Sistema</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">API</span>
              <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Base de Datos</span>
              <span class="flex h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-600">Biométrico</span>
              <span class="flex h-2 w-2 rounded-full" :class="biometricConnected ? 'bg-green-500' : 'bg-red-500'"></span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuth } from '~/composables/useAuth'
import SidebarItem from './SidebarItem.vue'

const { user } = useAuth()

// Estado simulado (en producción vendría de la API)
const pendingAdmissions = ref(3)
const todayAppointments = ref(5)
const pendingSamples = ref(12)
const biometricConnected = ref(true)

// Simulación de carga de datos iniciales
onMounted(async () => {
  // Aquí irían los fetch reales a la API de estadísticas
  // const { data } = await $fetch('/api/system/stats')
})
</script>