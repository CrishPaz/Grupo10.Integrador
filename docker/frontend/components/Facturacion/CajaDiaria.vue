<template>
  <div class="caja-diaria-container">
    <!-- Resumen del Día -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Total Ingresos</p>
            <p class="text-2xl font-bold text-gray-800">S/ {{ resumenDia.total_ingresos.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Efectivo</p>
            <p class="text-2xl font-bold text-gray-800">S/ {{ resumenDia.efectivo.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tarjetas</p>
            <p class="text-2xl font-bold text-gray-800">S/ {{ resumenDia.tarjeta.toFixed(2) }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow p-4">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
          </div>
          <div>
            <p class="text-sm text-gray-600">Diferencia</p>
            <p :class="['text-2xl font-bold', 
                       resumenDia.diferencia_total >= 0 ? 'text-green-600' : 'text-red-600']">
              S/ {{ Math.abs(resumenDia.diferencia_total).toFixed(2) }}
              {{ resumenDia.diferencia_total >= 0 ? '▲' : '▼' }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div class="flex items-center space-x-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" v-model="filtros.fecha" 
                   @change="cargarDatos"
                   class="p-2 border border-gray-300 rounded-md">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cajero</label>
            <select v-model="filtros.cajero_id" 
                    @change="cargarDatos"
                    class="p-2 border border-gray-300 rounded-md">
              <option value="">Todos los cajeros</option>
              <option v-for="cajero in cajeros" :key="cajero.id" :value="cajero.id">
                {{ cajero.nombres }} {{ cajero.apellidos }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="filtros.estado" 
                    @change="cargarDatos"
                    class="p-2 border border-gray-300 rounded-md">
              <option value="">Todos</option>
              <option value="ABIERTA">Abiertas</option>
              <option value="CERRADA">Cerradas</option>
            </select>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button @click="exportarExcel" 
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Excel
          </button>
          
          <button @click="generarPDF" 
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            PDF
          </button>
          
          <button @click="imprimirReporte" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
            Imprimir
          </button>
        </div>
      </div>
    </div>
    
    <!-- Listado de Cajas -->
    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">Cajas del Día</h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cajero</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Apertura</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora Cierre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicial</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egresos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Esperado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Real</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="caja in cajas" :key="caja.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ caja.usuario.nombres }} {{ caja.usuario.apellidos }}
                    </div>
                    <div class="text-sm text-gray-500">{{ caja.usuario.dni }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(caja.hora_apertura) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ caja.hora_cierre ? formatDateTime(caja.hora_cierre) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                S/ {{ (Number(caja.monto_inicial_efectivo) || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                S/ {{ (Number(caja.total_ingresos) || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                S/ {{ (Number(caja.total_egresos) || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                S/ {{ (Number(caja.total_esperado) || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                S/ {{ (Number(caja.total_real) || 0).toFixed(2) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  (Number(caja.diferencia) || 0) >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                ]">
                  S/ {{ Math.abs(Number(caja.diferencia) || 0).toFixed(2) }}
                  {{ (Number(caja.diferencia) || 0) >= 0 ? '▲' : '▼' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  caja.estado === 'ABIERTA' 
                    ? 'bg-yellow-100 text-yellow-800'
                    : caja.estado === 'CERRADA'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                ]">
                  {{ caja.estado }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="verDetalleCaja(caja)" 
                        class="text-blue-600 hover:text-blue-900 mr-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                
                <button v-if="caja.estado === 'ABIERTA'" 
                        @click="cerrarCaja(caja)"
                        class="text-green-600 hover:text-green-900">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                </button>
                
                <button v-if="caja.estado === 'CERRADA'" 
                        @click="imprimirArqueo(caja)"
                        class="text-purple-600 hover:text-purple-900 ml-3">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Detalle de Movimientos -->
    <div v-if="cajaSeleccionada" class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-semibold text-gray-800">
          Movimientos - {{ cajaSeleccionada.usuario.nombres }} 
          ({{ formatDate(cajaSeleccionada.fecha) }})
        </h3>
        <button @click="cajaSeleccionada = null" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método Pago</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factura</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="movimiento in movimientosCaja" :key="movimiento.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDateTime(movimiento.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  movimiento.tipo_movimiento === 'INGRESO'
                    ? 'bg-green-100 text-green-800'
                    : movimiento.tipo_movimiento === 'EGRESO'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                ]">
                  {{ movimiento.tipo_movimiento }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ movimiento.descripcion }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ movimiento.metodo_pago || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span v-if="movimiento.factura" 
                      class="text-blue-600 hover:text-blue-900 cursor-pointer"
                      @click="verFactura(movimiento.factura!.id)">
                  {{ movimiento.factura.serie }}-{{ movimiento.factura.numero }}
                </span>
                <span v-else>-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span :class="movimiento.tipo_movimiento === 'INGRESO' ? 'text-green-600' : 'text-red-600'">
                  {{ movimiento.tipo_movimiento === 'INGRESO' ? '+' : '-' }}
                  S/ {{ Number(movimiento.monto).toFixed(2) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button v-if="movimiento.estado === 'ACTIVO'" 
                        @click="anularMovimiento(movimiento)"
                        class="text-red-600 hover:text-red-900">
                  Anular
                </button>
                <span v-else class="text-gray-500 italic">Anulado</span>
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="5" class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                Total Ingresos:
              </td>
              <td class="px-6 py-3 text-sm font-bold text-green-600">
                S/ {{ calcularTotalMovimientos('INGRESO').toFixed(2) }}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colspan="5" class="px-6 py-3 text-right text-sm font-medium text-gray-900">
                Total Egresos:
              </td>
              <td class="px-6 py-3 text-sm font-bold text-red-600">
                S/ {{ calcularTotalMovimientos('EGRESO').toFixed(2) }}
              </td>
              <td></td>
            </tr>
            <tr class="border-t border-gray-300">
              <td colspan="5" class="px-6 py-3 text-right text-sm font-bold text-gray-900">
                Saldo Final:
              </td>
              <td class="px-6 py-3 text-sm font-bold text-blue-600">
                S/ {{ (calcularTotalMovimientos('INGRESO') - calcularTotalMovimientos('EGRESO')).toFixed(2) }}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    
    <!-- Estadísticas del Día -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Facturas del Día -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Facturas del Día</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="factura in facturasDelDia" :key="factura.id" 
                 class="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
              <div>
                <div class="font-medium">{{ factura.receptor_razon_social }}</div>
                <div class="text-sm text-gray-600">
                  {{ factura.serie }}-{{ factura.numero }} | 
                  {{ formatDateTime(factura.fecha_emision) }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold">S/ {{ Number(factura.total).toFixed(2) }}</div>
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  factura.estado_pago === 'PAGADO'
                    ? 'bg-green-100 text-green-800'
                    : factura.estado_pago === 'PENDIENTE'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                ]">
                  {{ factura.estado_pago }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Métodos de Pago -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Distribución por Método de Pago</h3>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div v-for="(monto, metodo) in distribucionMetodos" :key="metodo" 
                 class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full mr-2" 
                     :style="{ backgroundColor: coloresMetodos[metodo] }"></div>
                <span class="font-medium">{{ metodo }}</span>
              </div>
              <div class="text-right">
                <div class="font-bold">S/ {{ monto.toFixed(2) }}</div>
                <div class="text-sm text-gray-600">
                  {{ ((monto / resumenDia.total_ingresos) * 100).toFixed(1) }}%
                </div>
              </div>
            </div>
            
            <!-- Gráfico circular simplificado -->
            <div class="mt-6 relative" style="height: 200px;">
              <canvas ref="graficoMetodos"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';

interface Usuario {
  id: string;
  nombres: string;
  apellidos: string;
  dni: string;
}

interface Cajero {
  id: string;
  nombres: string;
  apellidos: string;
}

interface Caja {
  id: string;
  usuario: Usuario;
  hora_apertura: string;
  hora_cierre: string | null;
  monto_inicial_efectivo: number;
  total_ingresos: number;
  total_egresos: number;
  total_esperado: number;
  total_real: number;
  diferencia: number;
  estado: 'ABIERTA' | 'CERRADA';
  fecha: string;
}

interface Factura {
  id: string;
  serie: string;
  numero: string;
  fecha_emision: string;
  total: number;
  receptor_razon_social: string;
  estado_pago: 'PAGADO' | 'PENDIENTE' | 'ANULADO';
}

interface Movimiento {
  id: string;
  created_at: string;
  tipo_movimiento: 'INGRESO' | 'EGRESO';
  descripcion: string;
  metodo_pago: string | null;
  factura_id: string | null;
  factura?: Factura;
  monto: number;
  estado: 'ACTIVO' | 'ANULADO';
}

interface ResumenDia {
  total_ingresos: number;
  total_egresos: number;
  efectivo: number;
  tarjeta: number;
  transferencia: number;
  otros: number;
  diferencia_total: number;
}

// Datos
const filtros = ref({
  fecha: new Date().toISOString().split('T')[0],
  cajero_id: '',
  estado: ''
});

const cajas = ref<Caja[]>([]);
const cajeros = ref<Cajero[]>([])
const resumenDia = ref<ResumenDia>({
  total_ingresos: 0,
  total_egresos: 0,
  efectivo: 0,
  tarjeta: 0,
  transferencia: 0,
  otros: 0,
  diferencia_total: 0
});

const cajaSeleccionada = ref<Caja | null>(null);
const movimientosCaja = ref<Movimiento[]>([]);
const facturasDelDia = ref<Factura[]>([]);

// Computed
const distribucionMetodos = computed(() => {
  return {
    'EFECTIVO': resumenDia.value.efectivo,
    'TARJETA': resumenDia.value.tarjeta,
    'TRANSFERENCIA': resumenDia.value.transferencia,
    'OTROS': resumenDia.value.otros
  };
});

const coloresMetodos: Record<string, string> = {
  'EFECTIVO': '#10B981',
  'TARJETA': '#3B82F6',
  'TRANSFERENCIA': '#8B5CF6',
  'OTROS': '#F59E0B'
};

// Métodos
async function cargarDatos() {
  try {
    const query = new URLSearchParams();
    if (filtros.value.fecha) query.append('fecha', filtros.value.fecha);
    if (filtros.value.cajero_id) query.append('usuario_id', filtros.value.cajero_id);
    if (filtros.value.estado) query.append('estado', filtros.value.estado);
    
    // @ts-ignore
    const response = await $fetch(`/api/facturacion/caja/diaria?${query}`);
    
    // @ts-ignore
    cajas.value = response.data.cajas;
    // @ts-ignore
    resumenDia.value = response.data.resumen_dia;
    // @ts-ignore
    facturasDelDia.value = response.data.facturas;
    
    // Cargar cajeros si no están cargados
    if (cajeros.value.length === 0) {
      await cargarCajeros();
    }
    
    // Actualizar gráfico
    nextTick(() => {
      actualizarGrafico();
    });
    
  } catch (error) {
    console.error('Error cargando datos de caja:', error);
  }
}

async function cargarCajeros() {
  try {
    // @ts-ignore
    const response = await $fetch('/api/usuarios?rol=admissions');
    // @ts-ignore
    cajeros.value = response.data;
  } catch (error) {
    console.error('Error cargando cajeros:', error);
  }
}

async function verDetalleCaja(caja: Caja) {
  cajaSeleccionada.value = caja;
  
  try {
    // @ts-ignore
    const response = await $fetch(`/api/facturacion/caja/${caja.id}/movimientos`);
    // @ts-ignore
    movimientosCaja.value = response.data;
  } catch (error) {
    console.error('Error cargando movimientos:', error);
  }
}

async function cerrarCaja(caja: Caja) {
  if (!confirm('¿Está seguro de cerrar esta caja? Esta acción no se puede deshacer.')) {
    return;
  }
  
  try {
    // @ts-ignore
    const response = await $fetch(`/api/facturacion/caja/${caja.id}/cerrar`, {
      method: 'POST'
    });
    
    // @ts-ignore
    if (response.success) {
      alert('Caja cerrada exitosamente');
      cargarDatos();
    }
  } catch (error) {
    console.error('Error cerrando caja:', error);
    alert('Error al cerrar la caja');
  }
}

function calcularTotalMovimientos(tipo: 'INGRESO' | 'EGRESO') {
  return movimientosCaja.value
    .filter(m => m.tipo_movimiento === tipo && m.estado === 'ACTIVO')
    .reduce((sum, m) => sum + Number(m.monto), 0);
}

async function anularMovimiento(movimiento: Movimiento) {
  if (!confirm('¿Está seguro de anular este movimiento?')) {
    return;
  }
  
  try {
    // @ts-ignore
    const response = await $fetch(`/api/facturacion/movimientos/${movimiento.id}/anular`, {
      method: 'POST'
    });
    
    // @ts-ignore
    if (response.success) {
      alert('Movimiento anulado exitosamente');
      if (cajaSeleccionada.value) {
        verDetalleCaja(cajaSeleccionada.value);
      }
    }
  } catch (error) {
    console.error('Error anulando movimiento:', error);
    alert('Error al anular el movimiento');
  }
}

function verFactura(facturaId: string) {
  // Navegar a la vista de factura
  navigateTo(`/facturacion/facturas/${facturaId}`);
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE');
}

function formatDateTime(dateTimeString: string) {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('es-PE', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

// Funciones de exportación
async function exportarExcel() {
  try {
    // @ts-ignore
    const response = await $fetch('/api/facturacion/reportes/excel', {
      method: 'POST',
      body: {
        fecha: filtros.value.fecha,
        tipo: 'CAJA_DIARIA'
      }
    });
    
    // Descargar el archivo
    // @ts-ignore
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caja_diaria_${filtros.value.fecha}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error exportando a Excel:', error);
    alert('Error al exportar el reporte');
  }
}

async function generarPDF() {
  try {
    const response = await $fetch<{ data: string }>('/api/facturacion/reportes/pdf', {
      method: 'POST',
      body: {
        fecha: filtros.value.fecha,
        tipo: 'CAJA_DIARIA',
        caja_id: cajaSeleccionada.value?.id
      }
    });
    
    // Abrir PDF en nueva pestaña
    const pdfWindow = window.open();
    if (pdfWindow) {
      pdfWindow.document.write(`
        <html>
          <head><title>Reporte Caja Diaria</title></head>
          <body style="margin: 0;">
            <embed width="100%" height="100%" src="data:application/pdf;base64,${response.data}" type="application/pdf">
          </body>
        </html>
      `);
    }
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    alert('Error al generar el PDF');
  }
}

function imprimirReporte() {
  window.print();
}

function imprimirArqueo(caja: Caja) {
  // Implementar impresión de arqueo de caja
  console.log('Imprimiendo arqueo de caja:', caja);
}

// Gráfico
let grafico: Chart | null = null;
const graficoMetodos = ref<HTMLCanvasElement | null>(null);

function actualizarGrafico() {
  if (!graficoMetodos.value) return;
  
  if (grafico) {
    grafico.destroy();
  }
  
  const ctx = graficoMetodos.value.getContext('2d');
  if (!ctx) return;

  const data = Object.values(distribucionMetodos.value);
  const labels = Object.keys(distribucionMetodos.value);
  
  grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: labels.map(label => coloresMetodos[label]),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = typeof context.raw === 'number' ? context.raw : 0;
              const total = context.dataset.data.reduce((a, b) => (typeof a === 'number' ? a : 0) + (typeof b === 'number' ? b : 0), 0) as number;
              const percentage = Math.round((value / total) * 100);
              return `${label}: S/ ${value.toFixed(2)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Lifecycle
onMounted(() => {
  cargarDatos();
  cargarCajeros();
});
</script>

<style scoped>
.caja-diaria-container {
  max-width: 1400px;
  margin: 0 auto;
}

@media print {
  .caja-diaria-container {
    max-width: none;
  }
  
  button {
    display: none !important;
  }
  
  .no-print {
    display: none !important;
  }
}
</style>
