<template>
  <AdminLayout>
    <div class="py-6 max-w-7xl mx-auto px-4">
      <h2 class="text-2xl font-bold mb-6">Cierre de Caja</h2>
      <CajaDiaria />
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '~/components/AdminLayout.vue'
import CajaDiaria from '~/components/Facturacion/CajaDiaria.vue'
</script>