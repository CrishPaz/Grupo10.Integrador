<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between mb-8">
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Calendario de Turnos</h2>
            <p class="mt-1 text-sm text-gray-600">Visualización y gestión de citas programadas</p>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
            <button @click="viewMode = 'day'" :class="viewMode === 'day' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium">Día</button>
            <button @click="viewMode = 'week'" :class="viewMode === 'week' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium">Semana</button>
            <button @click="viewMode = 'month'" :class="viewMode === 'month' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-700'" class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium">Mes</button>
            <button @click="showScheduleModal = true" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              <CogIcon class="h-4 w-4 mr-2" /> Configurar
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <button @click="previousPeriod" class="p-2 rounded-full hover:bg-gray-100"><ChevronLeftIcon class="h-5 w-5" /></button>
            <h3 class="text-lg font-medium text-gray-900">{{ periodTitle }}</h3>
            <button @click="nextPeriod" class="p-2 rounded-full hover:bg-gray-100"><ChevronRightIcon class="h-5 w-5" /></button>
            <button @click="goToToday" class="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Hoy</button>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg overflow-hidden min-h-[600px]">
          <div v-if="viewMode === 'month'" class="p-6">
            <div class="grid grid-cols-7 gap-px bg-gray-200">
              <div v-for="dayName in ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']" :key="dayName" class="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500">{{ dayName }}</div>
              <div v-for="day in monthDays" :key="day.date" class="bg-white min-h-32 p-2" :class="{ 'bg-gray-50': !day.isCurrentMonth }">
                <div class="flex justify-between">
                  <span class="text-sm font-medium" :class="day.isToday ? 'text-indigo-600' : 'text-gray-900'">{{ day.day }}</span>
                </div>
                <div class="mt-2 space-y-1">
                  <div v-for="event in getEventsForDate(day.date)" :key="event.id" class="text-xs p-1 rounded truncate cursor-pointer bg-blue-50 text-blue-800" @click="selectEvent(event)">
                    {{ event.paciente.nombres }} - {{ formatTime(event.fecha_programada) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="p-10 text-center text-gray-500">
            Vista de {{ viewMode === 'week' ? 'Semana' : 'Día' }} en construcción... (Usa la vista Mensual)
          </div>
        </div>
      </div>
    </div>

    <EventDetailModal :show="!!selectedEvent" :event="selectedEvent" @close="selectedEvent = null" />
    <ScheduleConfigModal :show="showScheduleModal" @close="showScheduleModal = false" />
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, CogIcon } from '@heroicons/vue/24/outline'
import EventDetailModal from '~/components/Admissions/EventDetailModal.vue'
import ScheduleConfigModal from '~/components/Admissions/ScheduleConfigModal.vue'
import { useToast } from '~/composables/useToast'

// Tipos
interface CalendarEvent {
  id: string
  paciente: { nombres: string, apellidos: string, dni: string }
  tipo_examen: string
  estado: string
  fecha_programada: string
  medico?: { nombres: string, apellidos: string }
}

const viewMode = ref<'day' | 'week' | 'month'>('month')
const currentDate = ref(new Date())
const selectedEvent = ref<CalendarEvent | null>(null)
const showScheduleModal = ref(false)
const events = ref<CalendarEvent[]>([])

const periodTitle = computed(() => {
  return currentDate.value.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })
})

const monthDays = computed(() => {
  const date = new Date(currentDate.value)
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []
  
  // Días vacíos al inicio
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push({ date: `empty-${i}`, day: '', isCurrentMonth: false, isToday: false })
  }
  
  // Días del mes
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i)
    const dateStr = d.toISOString().split('T')[0]
    const todayStr = new Date().toISOString().split('T')[0]
    days.push({ date: dateStr, day: i, isCurrentMonth: true, isToday: dateStr === todayStr })
  }
  return days
})

const previousPeriod = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

const nextPeriod = () => {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

const goToToday = () => currentDate.value = new Date()

const loadEvents = async () => {
  // Simulación de carga
  events.value = [
    {
      id: '1',
      paciente: { nombres: 'Juan', apellidos: 'Perez', dni: '123' },
      tipo_examen: 'Examen Médico',
      estado: 'programado',
      fecha_programada: new Date().toISOString()
    }
  ]
}

const getEventsForDate = (dateStr: string) => {
  return events.value.filter(e => e.fecha_programada.split('T')[0] === dateStr)
}

const formatTime = (dateStr: string) => {
  return new Date(dateStr).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

const selectEvent = (event: CalendarEvent) => selectedEvent.value = event

onMounted(() => loadEvents())
watch(currentDate, () => loadEvents())

definePageMeta({ middleware: ['auth'] })
</script>