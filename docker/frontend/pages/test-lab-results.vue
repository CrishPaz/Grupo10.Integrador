<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Guardar Resultados de Laboratorio (PRUEBA)</h1>
    
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <p class="text-sm text-yellow-800">
        ⚠️ Esta es una página de PRUEBA para verificar el webhook de n8n.
        <br>Ingresa un ID de solicitud de laboratorio válido para probar.
      </p>
    </div>

    <form @submit.prevent="guardarResultados" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          ID de Solicitud de Laboratorio
        </label>
        <input 
          v-model="solicitudId" 
          type="text" 
          required
          placeholder="Ej: 550e8400-e29b-41d4-a716-446655440000"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <p class="text-xs text-gray-500 mt-1">
          Puedes obtener un ID válido desde la base de datos: tabla solicitudes_laboratorio
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Parámetro
        </label>
        <input 
          v-model="parametro.codigo" 
          type="text" 
          required
          placeholder="Ej: HB (Hemoglobina)"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Valor Numérico
        </label>
        <input 
          v-model.number="parametro.valor" 
          type="number" 
          step="0.01"
          required
          placeholder="Ej: 14.5"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Unidad
        </label>
        <input 
          v-model="parametro.unidad" 
          type="text" 
          required
          placeholder="Ej: g/dL"
          class="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div class="flex items-center">
        <input 
          v-model="esBorrador" 
          type="checkbox" 
          id="borrador"
          class="h-4 w-4 text-indigo-600 rounded"
        />
        <label for="borrador" class="ml-2 text-sm text-gray-700">
          Guardar como borrador (no enviará notificaciones)
        </label>
      </div>

      <div class="flex gap-4">
        <button 
          type="submit"
          :disabled="loading"
          class="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {{ loading ? 'Guardando...' : 'Guardar Resultados' }}
        </button>
      </div>
    </form>

    <div v-if="resultado" class="mt-6 p-4 rounded-lg" :class="resultado.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'">
      <h3 class="font-semibold mb-2" :class="resultado.success ? 'text-green-800' : 'text-red-800'">
        {{ resultado.success ? '✅ Éxito' : '❌ Error' }}
      </h3>
      <pre class="text-sm overflow-auto">{{ JSON.stringify(resultado, null, 2) }}</pre>
    </div>

    <div class="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 class="font-semibold text-blue-900 mb-2">📋 Instrucciones:</h3>
      <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
        <li>Obtén un ID de solicitud válido de la base de datos</li>
        <li>Ingresa los datos del resultado</li>
        <li>Desmarca "borrador" para que se envíen las notificaciones</li>
        <li>Haz clic en "Guardar Resultados"</li>
        <li>Verifica en n8n que se ejecutó el workflow</li>
        <li>Verifica que llegaron los emails</li>
      </ol>
    </div>

    <div class="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 class="font-semibold text-gray-900 mb-2">🔍 Verificar en n8n:</h3>
      <p class="text-sm text-gray-700">
        Abre <a href="http://localhost:5678" target="_blank" class="text-indigo-600 underline">n8n</a> 
        → Executions → Busca "Flujo de Notificaciones de Laboratorio"
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const solicitudId = ref('')
const parametro = ref({
  codigo: 'HB',
  valor: 14.5,
  unidad: 'g/dL'
})
const esBorrador = ref(false)
const loading = ref(false)
const resultado = ref<any>(null)

const guardarResultados = async () => {
  loading.value = true
  resultado.value = null

  try {
    const response = await $fetch(`/api/laboratory/tests/${solicitudId.value}/results`, {
      method: 'POST',
      body: {
        es_borrador: esBorrador.value,
        resultados: [
          {
            parametro_codigo: parametro.value.codigo,
            resultado_numerico: parametro.value.valor,
            unidad: parametro.value.unidad
          }
        ]
      }
    })

    resultado.value = {
      success: true,
      message: 'Resultados guardados correctamente',
      data: response
    }

    if (!esBorrador.value) {
      resultado.value.webhook = '✅ Webhook enviado a n8n (verifica en Executions)'
    }
  } catch (error: any) {
    resultado.value = {
      success: false,
      error: error.message || 'Error desconocido',
      details: error.data || error
    }
  } finally {
    loading.value = false
  }
}


definePageMeta({ middleware: ['auth'] })
</script>
