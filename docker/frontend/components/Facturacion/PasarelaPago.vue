<template>
  <div class="pasarela-pago-container">
    <!-- Selección de Método de Pago -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Seleccione Método de Pago</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <button v-for="metodo in metodosPago" 
                :key="metodo.id"
                @click="seleccionarMetodo(metodo)"
                :class="[
                  'p-4 border rounded-lg flex flex-col items-center justify-center transition-all',
                  metodoSeleccionado?.id === metodo.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                ]">
          <div class="text-3xl mb-2">{{ metodo.icono }}</div>
          <div class="font-medium text-gray-800">{{ metodo.nombre }}</div>
          <div v-if="metodo.comision > 0" class="text-sm text-gray-600 mt-1">
            Comisión: {{ metodo.comision }}%
          </div>
        </button>
      </div>
    </div>
    
    <!-- Formulario según Método Seleccionado -->
    <div v-if="metodoSeleccionado" class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-800">
          {{ metodoSeleccionado.nombre }} - S/ {{ montoTotal.toFixed(2) }}
        </h3>
        <button @click="metodoSeleccionado = null" 
                class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <!-- EFECTIVO -->
      <div v-if="metodoSeleccionado.tipo === 'EFECTIVO'" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Monto Recibido *
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
            <input type="number" 
                   v-model="datosPago.monto_recibido"
                   @input="calcularCambio"
                   step="0.01"
                   min="0"
                   class="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                   placeholder="0.00">
          </div>
        </div>
        
        <div v-if="datosPago.monto_recibido > 0" class="p-4 bg-blue-50 rounded-lg">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Total a Pagar:</p>
              <p class="text-2xl font-bold text-gray-800">S/ {{ montoTotal.toFixed(2) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Cambio:</p>
              <p class="text-2xl font-bold" 
                 :class="cambio >= 0 ? 'text-green-600' : 'text-red-600'">
                S/ {{ Math.abs(cambio).toFixed(2) }}
                {{ cambio >= 0 ? '▲' : '▼' }}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- TARJETA -->
      <div v-if="metodoSeleccionado.tipo === 'TARJETA'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Número de Tarjeta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Tarjeta *
            </label>
            <div class="relative">
              <input type="text" 
                     v-model="datosPago.numero_tarjeta"
                     @input="detectarTipoTarjeta"
                     maxlength="19"
                     placeholder="1234 5678 9012 3456"
                     class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <div v-if="tipoTarjeta" class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <img :src="obtenerLogoTarjeta(tipoTarjeta)" 
                     :alt="tipoTarjeta" 
                     class="h-6">
              </div>
            </div>
          </div>
          
          <!-- Fecha Vencimiento -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento *
            </label>
            <div class="grid grid-cols-2 gap-2">
              <select v-model="datosPago.mes_vencimiento"
                      class="p-3 border border-gray-300 rounded-lg">
                <option value="">Mes</option>
                <option v-for="mes in 12" :key="mes" :value="mes">
                  {{ mes.toString().padStart(2, '0') }}
                </option>
              </select>
              <select v-model="datosPago.anio_vencimiento"
                      class="p-3 border border-gray-300 rounded-lg">
                <option value="">Año</option>
                <option v-for="anio in aniosVencimiento" :key="anio" :value="anio">
                  {{ anio }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nombre en Tarjeta -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre en la Tarjeta *
            </label>
            <input type="text" 
                   v-model="datosPago.nombre_tarjeta"
                   placeholder="JUAN PEREZ"
                   class="w-full p-3 border border-gray-300 rounded-lg uppercase">
          </div>
          
          <!-- CVV -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CVV *
            </label>
            <div class="relative">
              <input type="text" 
                     v-model="datosPago.cvv"
                     maxlength="4"
                     placeholder="123"
                     class="w-full p-3 border border-gray-300 rounded-lg">
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button type="button" 
                        @click="mostrarCVV = !mostrarCVV"
                        class="text-gray-500 hover:text-gray-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="!mostrarCVV" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Cuotas -->
        <div v-if="metodoSeleccionado.tipo_tarjeta === 'CREDITO'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Cuotas
          </label>
          <select v-model="datosPago.cuotas"
                  class="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg">
            <option value="1">1 cuota</option>
            <option value="2">2 cuotas</option>
            <option value="3">3 cuotas</option>
            <option value="6">6 cuotas</option>
            <option value="12">12 cuotas</option>
          </select>
          
          <div v-if="datosPago.cuotas > 1" class="mt-4 p-4 bg-blue-50 rounded-lg">
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-sm text-gray-600">Total:</p>
                <p class="text-lg font-bold">S/ {{ montoTotal.toFixed(2) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Cuotas:</p>
                <p class="text-lg font-bold">{{ datosPago.cuotas }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Por cuota:</p>
                <p class="text-lg font-bold">S/ {{ (montoTotal / datosPago.cuotas).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- YAPE / PLIN -->
      <div v-if="['YAPE', 'PLIN'].includes(metodoSeleccionado.tipo)" class="space-y-6">
        <div class="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div class="text-5xl mb-4">{{ metodoSeleccionado.icono }}</div>
          <h4 class="text-xl font-semibold mb-2">Pago con {{ metodoSeleccionado.nombre }}</h4>
          <p class="text-gray-600 mb-4">Escanea el código QR para realizar el pago</p>
          
          <!-- Código QR -->
          <div class="flex justify-center mb-6">
            <div class="p-4 bg-white border border-gray-300 rounded-lg">
              <img :src="generarQRCode()" 
                   alt="Código QR para pago" 
                   class="w-48 h-48">
            </div>
          </div>
          
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">O envía el pago a:</p>
            <p class="text-lg font-bold text-blue-600">{{ numeroCelular }}</p>
            <p class="text-sm text-gray-600">Referencia: {{ referenciaPago }}</p>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Número de operación *
          </label>
          <input type="text" 
                 v-model="datosPago.numero_operacion"
                 placeholder="Ingrese el número de operación"
                 class="w-full p-3 border border-gray-300 rounded-lg">
        </div>
      </div>
      
      <!-- TRANSFERENCIA BANCARIA -->
      <div v-if="metodoSeleccionado.tipo === 'TRANSFERENCIA'" class="space-y-6">
        <div class="p-6 bg-gray-50 rounded-lg">
          <h4 class="font-semibold text-lg mb-4">Datos para Transferencia</h4>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Banco:</span>
              <span class="font-medium">Banco de Crédito del Perú (BCP)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tipo de Cuenta:</span>
              <span class="font-medium">Cuenta Corriente</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Número de Cuenta:</span>
              <span class="font-medium">191-12345678-1-99</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">CCI:</span>
              <span class="font-medium">00219100123456781999</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Titular:</span>
              <span class="font-medium">CLINICA SALUD LABORAL S.A.C.</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">RUC:</span>
              <span class="font-medium">20123456789</span>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Operación *
            </label>
            <input type="text" 
                   v-model="datosPago.numero_operacion"
                   placeholder="Ej: OP-12345678"
                   class="w-full p-3 border border-gray-300 rounded-lg">
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Transferencia *
            </label>
            <input type="date" 
                   v-model="datosPago.fecha_operacion"
                   class="w-full p-3 border border-gray-300 rounded-lg">
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Banco Origen
          </label>
          <select v-model="datosPago.banco_origen"
                  class="w-full p-3 border border-gray-300 rounded-lg">
            <option value="">Seleccionar banco</option>
            <option value="BCP">BCP</option>
            <option value="BBVA">BBVA</option>
            <option value="INTERBANK">Interbank</option>
            <option value="SCOTIABANK">Scotiabank</option>
            <option value="BANBIF">BanBif</option>
            <option value="OTRO">Otro</option>
          </select>
        </div>
      </div>
      
      <!-- Botón de Pago -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-600">Total a pagar:</p>
            <p class="text-2xl font-bold text-gray-800">S/ {{ montoTotal.toFixed(2) }}</p>
            <p v-if="metodoSeleccionado.comision > 0" class="text-sm text-gray-600">
              Incluye comisión de {{ metodoSeleccionado.comision }}%
            </p>
          </div>
          
          <button @click="procesarPago"
                  :disabled="!pagoValido || procesando"
                  :class="[
                    'px-8 py-3 rounded-lg font-semibold text-lg transition-all',
                    procesando 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  ]">
            {{ procesando ? 'Procesando...' : `Pagar con ${metodoSeleccionado.nombre}` }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Comprobante de Pago -->
    <div v-if="comprobanteGenerado && comprobante" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div class="p-6">
          <div class="text-center mb-8">
            <div class="text-5xl text-green-500 mb-4">✓</div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
            <p class="text-gray-600">El pago se ha procesado correctamente</p>
          </div>
          
          <div class="border border-gray-300 rounded-lg p-6 mb-6">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-gray-600">Número de Transacción:</p>
                <p class="font-bold">{{ comprobante.numero_transaccion }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Fecha y Hora:</p>
                <p class="font-bold">{{ formatDateTime(comprobante.fecha) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Método de Pago:</p>
                <p class="font-bold">{{ comprobante.metodo_pago }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Monto:</p>
                <p class="font-bold">S/ {{ comprobante.monto.toFixed(2) }}</p>
              </div>
            </div>
            
            <div v-if="comprobante.datos_tarjeta" class="border-t pt-4">
              <h4 class="font-semibold mb-2">Datos de Tarjeta:</h4>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <p class="text-sm text-gray-600">Últimos 4 dígitos:</p>
                  <p class="font-bold">**** **** **** {{ comprobante.datos_tarjeta.ultimos_digitos }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Tipo:</p>
                  <p class="font-bold">{{ comprobante.datos_tarjeta.tipo }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-4">
            <button @click="imprimirComprobante"
                    class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Imprimir
            </button>
            
            <button @click="enviarComprobanteEmail"
                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Enviar por Email
            </button>
            
            <button @click="cerrarComprobante"
                    class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const props = defineProps({
  facturaId: {
    type: String,
    required: true
  },
  montoTotal: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['pago-exitoso', 'pago-fallido']);

// Métodos de pago disponibles
interface MetodoPago {
  id: number;
  tipo: string;
  nombre: string;
  icono: string;
  comision: number;
  tipo_tarjeta?: string;
}

const metodosPago = ref<MetodoPago[]>([
  { id: 1, tipo: 'EFECTIVO', nombre: 'Efectivo', icono: '💰', comision: 0 },
  { id: 2, tipo: 'TARJETA', tipo_tarjeta: 'DEBITO', nombre: 'Tarjeta Débito', icono: '💳', comision: 1.5 },
  { id: 3, tipo: 'TARJETA', tipo_tarjeta: 'CREDITO', nombre: 'Tarjeta Crédito', icono: '💳', comision: 3.5 },
  { id: 4, tipo: 'YAPE', nombre: 'Yape', icono: '📱', comision: 0 },
  { id: 5, tipo: 'PLIN', nombre: 'Plin', icono: '📱', comision: 0 },
  { id: 6, tipo: 'TRANSFERENCIA', nombre: 'Transferencia', icono: '🏦', comision: 0 }
]);

// Estado
const metodoSeleccionado = ref<MetodoPago | null>(null);
const datosPago = ref({
  monto_recibido: 0,
  numero_tarjeta: '',
  mes_vencimiento: '',
  anio_vencimiento: '',
  nombre_tarjeta: '',
  cvv: '',
  cuotas: 1,
  numero_operacion: '',
  fecha_operacion: '',
  banco_origen: ''
});

const tipoTarjeta = ref('');
const mostrarCVV = ref(false);
const procesando = ref(false);
const comprobanteGenerado = ref(false);

interface Comprobante {
  numero_transaccion: string;
  fecha: Date;
  metodo_pago: string;
  monto: number;
  datos_tarjeta: {
    ultimos_digitos: string;
    tipo: string;
  } | null;
}

const comprobante = ref<Comprobante | null>(null);

// Computed
const cambio = computed(() => {
  if (datosPago.value.monto_recibido && metodoSeleccionado.value?.tipo === 'EFECTIVO') {
    return datosPago.value.monto_recibido - props.montoTotal;
  }
  return 0;
});

const pagoValido = computed(() => {
  if (!metodoSeleccionado.value) return false;
  
  switch (metodoSeleccionado.value.tipo) {
    case 'EFECTIVO':
      return datosPago.value.monto_recibido >= props.montoTotal;
      
    case 'TARJETA':
      return datosPago.value.numero_tarjeta.length >= 16 &&
             datosPago.value.mes_vencimiento &&
             datosPago.value.anio_vencimiento &&
             datosPago.value.nombre_tarjeta &&
             datosPago.value.cvv.length >= 3;
      
    case 'YAPE':
    case 'PLIN':
    case 'TRANSFERENCIA':
      return datosPago.value.numero_operacion.trim().length > 0;
      
    default:
      return false;
  }
});

const aniosVencimiento = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 10; i++) {
    years.push(currentYear + i);
  }
  return years;
});

const referenciaPago = computed(() => {
  return `FACT-${props.facturaId.substring(0, 8)}`;
});

const numeroCelular = computed(() => {
  return metodoSeleccionado.value?.tipo === 'YAPE' ? '999 888 777' : '988 777 666';
});

// Métodos
function seleccionarMetodo(metodo: MetodoPago) {
  metodoSeleccionado.value = metodo;
  resetearDatosPago();
}

function resetearDatosPago() {
  datosPago.value = {
    monto_recibido: 0,
    numero_tarjeta: '',
    mes_vencimiento: '',
    anio_vencimiento: '',
    nombre_tarjeta: '',
    cvv: '',
    cuotas: 1,
    numero_operacion: '',
    fecha_operacion: new Date().toISOString().split('T')[0],
    banco_origen: ''
  };
  tipoTarjeta.value = '';
}

function detectarTipoTarjeta() {
  const numero = datosPago.value.numero_tarjeta.replace(/\s/g, '');
  
  // Detectar tipo de tarjeta por BIN
  if (numero.startsWith('4')) {
    tipoTarjeta.value = 'VISA';
  } else if (numero.startsWith('5')) {
    tipoTarjeta.value = 'MASTERCARD';
  } else if (numero.startsWith('34') || numero.startsWith('37')) {
    tipoTarjeta.value = 'AMEX';
  } else if (numero.startsWith('36') || numero.startsWith('38') || numero.startsWith('39')) {
    tipoTarjeta.value = 'DINERS';
  } else {
    tipoTarjeta.value = '';
  }
  
  // Formatear número de tarjeta
  if (numero.length <= 16) {
    datosPago.value.numero_tarjeta = numero.replace(/(\d{4})/g, '$1 ').trim();
  }
}

function obtenerLogoTarjeta(tipo: string) {
  const logos: Record<string, string> = {
    'VISA': '/img/visa.png',
    'MASTERCARD': '/img/mastercard.png',
    'AMEX': '/img/amex.png',
    'DINERS': '/img/diners.png'
  };
  return logos[tipo] || '';
}

function calcularCambio() {
  // Formatear monto recibido
  if (datosPago.value.monto_recibido < 0) {
    datosPago.value.monto_recibido = 0;
  }
}

function generarQRCode() {
  if (!metodoSeleccionado.value) return '';
  const datosQR = {
    tipo: metodoSeleccionado.value.tipo,
    monto: props.montoTotal,
    referencia: referenciaPago.value,
    celular: numeroCelular.value,
    fecha: new Date().toISOString()
  };
  
  const qrData = JSON.stringify(datosQR);
  // En producción, usar librería para generar QR
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
}

async function procesarPago() {
  if (!metodoSeleccionado.value) return;
  try {
    procesando.value = true;
    
    // Preparar datos según método de pago
    const datosEnvio = {
      factura_id: props.facturaId,
      tipo_pago: metodoSeleccionado.value.tipo,
      monto: props.montoTotal,
      detalles: {}
    };
    
    switch (metodoSeleccionado.value.tipo) {
      case 'EFECTIVO':
        datosEnvio.detalles = {
          monto_recibido: datosPago.value.monto_recibido,
          cambio: cambio.value
        };
        break;
        
      case 'TARJETA':
        datosEnvio.detalles = {
          numero_tarjeta: datosPago.value.numero_tarjeta.replace(/\s/g, '').slice(-4),
          tipo_tarjeta: metodoSeleccionado.value.tipo_tarjeta,
          cuotas: datosPago.value.cuotas
        };
        // En producción: integrar con pasarela de pago (Culqi, PayU, etc.)
        await procesarPagoTarjeta();
        break;
        
      case 'YAPE':
      case 'PLIN':
        datosEnvio.detalles = {
          numero_operacion: datosPago.value.numero_operacion,
          celular_destino: numeroCelular.value
        };
        break;
        
      case 'TRANSFERENCIA':
        datosEnvio.detalles = {
          numero_operacion: datosPago.value.numero_operacion,
          fecha_operacion: datosPago.value.fecha_operacion,
          banco_origen: datosPago.value.banco_origen
        };
        break;
    }
    
    // Enviar pago al servidor
    const response: any = await $fetch('/api/facturacion/pagos/create', {
      method: 'POST',
      body: datosEnvio
    });
    
    if (response.success) {
      // Generar comprobante
      comprobante.value = {
        numero_transaccion: response.data.numero_transaccion || `TRX-${Date.now()}`,
        fecha: new Date(),
        metodo_pago: metodoSeleccionado.value.nombre,
        monto: props.montoTotal,
        datos_tarjeta: metodoSeleccionado.value.tipo === 'TARJETA' ? {
          ultimos_digitos: datosPago.value.numero_tarjeta.replace(/\s/g, '').slice(-4),
          tipo: tipoTarjeta.value
        } : null
      };
      
      comprobanteGenerado.value = true;
      emit('pago-exitoso', response.data);
    } else {
      throw new Error('Error en el procesamiento del pago');
    }
    
  } catch (error: any) {
    console.error('Error procesando pago:', error);
    alert(`Error al procesar el pago: ${error.message}`);
    emit('pago-fallido', error);
  } finally {
    procesando.value = false;
  }
}

async function procesarPagoTarjeta() {
  // Simulación de integración con pasarela de pago
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const exito = Math.random() > 0.1; // 90% de éxito
      if (exito) {
        resolve({
          transaction_id: `TXN-${Date.now()}`,
          status: 'approved',
          authorization_code: Math.random().toString(36).substring(2, 10).toUpperCase()
        });
      } else {
        reject(new Error('Tarjeta rechazada por el banco'));
      }
    }, 2000);
  });
}

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function imprimirComprobante() {
  if (!comprobante.value) return;
  const ventana = window.open('', '_blank');
  if (!ventana) return;
  ventana.document.write(`
    <html>
      <head>
        <title>Comprobante de Pago</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #2c3e50; }
          .comprobante { border: 2px solid #2c3e50; padding: 20px; border-radius: 8px; }
          .success { color: #27ae60; font-size: 24px; text-align: center; }
          .info { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">CLÍNICA SALUD LABORAL</div>
          <h1>Comprobante de Pago</h1>
        </div>
        
        <div class="comprobante">
          <div class="success">✓ PAGO EXITOSO</div>
          
          <div class="info">
            <div class="info-row">
              <span>Número de Transacción:</span>
              <strong>${comprobante.value.numero_transaccion}</strong>
            </div>
            <div class="info-row">
              <span>Fecha y Hora:</span>
              <strong>${formatDateTime(comprobante.value.fecha)}</strong>
            </div>
            <div class="info-row">
              <span>Método de Pago:</span>
              <strong>${comprobante.value.metodo_pago}</strong>
            </div>
            <div class="info-row">
              <span>Monto Pagado:</span>
              <strong>S/ ${comprobante.value.monto.toFixed(2)}</strong>
            </div>
          </div>
          
          ${comprobante.value.datos_tarjeta ? `
            <hr>
            <div class="info">
              <h3>Datos de Tarjeta</h3>
              <div class="info-row">
                <span>Tarjeta:</span>
                <strong>**** **** **** ${comprobante.value.datos_tarjeta.ultimos_digitos}</strong>
              </div>
              <div class="info-row">
                <span>Tipo:</span>
                <strong>${comprobante.value.datos_tarjeta.tipo}</strong>
              </div>
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>Documento generado electrónicamente - Sistema Inteligente de Salud Laboral</p>
          <p>Gracias por su pago</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Imprimir Comprobante
          </button>
        </div>
      </body>
    </html>
  `);
  ventana.document.close();
}

async function enviarComprobanteEmail() {
  if (!comprobante.value) return;
  try {
    const response: any = await $fetch('/api/facturacion/comprobante/email', {
      method: 'POST',
      body: {
        comprobante: comprobante.value,
        email: 'cliente@ejemplo.com' // En producción, obtener del receptor
      }
    });
    
    if (response.success) {
      alert('Comprobante enviado por email exitosamente');
    }
  } catch (error) {
    console.error('Error enviando email:', error);
    alert('Error al enviar el comprobante por email');
  }
}

function cerrarComprobante() {
  comprobanteGenerado.value = false;
  metodoSeleccionado.value = null;
  resetearDatosPago();
}

// Lifecycle
onMounted(() => {
  // Auto-seleccionar efectivo por defecto
  metodoSeleccionado.value = metodosPago.value[0];
});
</script>

<style scoped>
.pasarela-pago-container {
  max-width: 800px;
  margin: 0 auto;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
