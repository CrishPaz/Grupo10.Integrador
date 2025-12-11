<template>
  <AdminLayout>
    <div class="py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900">Integraciones</h1>
        <div class="py-4">
          <div class="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p class="text-gray-500">Módulo en construcción: Integraciones con Laboratorios y SUNAT</p>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'admin-only']
})
</script>
