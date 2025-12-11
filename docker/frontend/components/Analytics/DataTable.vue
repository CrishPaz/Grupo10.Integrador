<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-for="col in columns" :key="col.key" 
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              @click="$emit('sort', col.key)">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(row, i) in data" :key="i">
          <td v-for="col in columns" :key="col.key" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ formatValue(row[col.key], col.format) }}
          </td>
        </tr>
        <tr v-if="data.length === 0">
          <td :colspan="columns.length" class="px-6 py-4 text-center text-gray-500">No hay datos disponibles</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const props = defineProps(['columns', 'data', 'pagination'])

const formatValue = (val, format) => {
  if (format === 'currency') return `S/ ${Number(val).toFixed(2)}`
  return val
}
</script>