<template>
  <div class="bg-gray-50 p-3 rounded">
    <h6 class="font-bold text-xs uppercase mb-2">Resultados Audiometría</h6>
    <div class="grid grid-cols-2 gap-4 text-sm">
      <div><span class="text-gray-500">Oído Izquierdo:</span> Normal</div>
      <div><span class="text-gray-500">Oído Derecho:</span> Hipoacusia Leve</div>
    </div>
  </div>
</template>
<script setup>defineProps(['results'])</script>