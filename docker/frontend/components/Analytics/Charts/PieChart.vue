<template>
  <div class="h-64">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps(['data', 'options'])
const canvas = ref(null)
let chart = null

const renderChart = () => {
  if (!canvas.value) return
  if (chart) chart.destroy()
  
  if (props.data && props.data.labels) {
    chart = new Chart(canvas.value, {
      type: 'doughnut',
      data: props.data,
      options: { ...props.options, maintainAspectRatio: false }
    })
  }
}

onMounted(renderChart)
watch(() => props.data, renderChart, { deep: true })
</script>