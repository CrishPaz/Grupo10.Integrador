<template>
  <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
              <path fill-rule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.294-2.718.635-3.985a.75.75 0 01.722-.516l.143.001c2.996 0 5.717-1.17 7.734-3.08zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM12 15a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75v-.008a.75.75 0 00-.75-.75H12z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">Salud Laboral</h1>
            <p class="text-[10px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Ley N° 29783</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
            <div class="text-right hidden md:block">
              <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ userName }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ userRole }}</p>
            </div>
            <button @click="logout" class="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Cerrar Sesión">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()

const userName = computed(() => user.value ? `${user.value.nombres} ${user.value.apellidos}` : 'Usuario')
const userRole = computed(() => {
  const map: any = { admin: 'Administrador', doctor: 'Médico', admissions: 'Admisiones', lab: 'Laboratorio' }
  return user.value ? (map[user.value.rol] || user.value.rol) : 'Invitado'
})
</script>