<template>
  <div class="factura-form-container">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">
        {{ editing ? 'Editar Factura' : 'Nueva Factura' }}
      </h2>
      
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Selección de Admisión -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Admisión / Cita *
            </label>
            <div class="relative">
              <input
                type="text"
                v-model="searchAdmision"
                @input="buscarAdmisiones"
                placeholder="Buscar por DNI o nombre del paciente"
                class="w-full p-2 border border-gray-300 rounded-md"
              />
              <div v-if="showAdmisionesList && admisionesFiltradas.length > 0" 
                   class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div v-for="adm in admisionesFiltradas" 
                     :key="adm.id"
                     @click="seleccionarAdmision(adm)"
                     class="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0">
                  <div class="font-medium">{{ adm.paciente.usuario.nombres }} {{ adm.paciente.usuario.apellidos }}</div>
                  <div class="text-sm text-gray-600">DNI: {{ adm.paciente.usuario.dni }} | Fecha: {{ formatDate(adm.fecha_programada) }}</div>
                </div>
              </div>
            </div>
            
            <div v-if="admisionSeleccionada" class="mt-4 p-4 bg-blue-50 rounded-md">
              <h4 class="font-medium text-blue-800">Admisión Seleccionada</h4>
              <div class="grid grid-cols-2 gap-2 mt-2">
                <div><span class="text-gray-600">Paciente:</span> {{ admisionSeleccionada.paciente.usuario.nombres }} {{ admisionSeleccionada.paciente.usuario.apellidos }}</div>
                <div><span class="text-gray-600">DNI:</span> {{ admisionSeleccionada.paciente.usuario.dni }}</div>
                <div><span class="text-gray-600">Empresa:</span> {{ admisionSeleccionada.paciente.empresa?.razon_social || 'Particular' }}</div>
                <div><span class="text-gray-600">Fecha:</span> {{ formatDate(admisionSeleccionada.fecha_programada) }}</div>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Comprobante *
            </label>
            <select v-model="formData.tipo_comprobante" 
                    @change="cambiarTipoComprobante"
                    class="w-full p-2 border border-gray-300 rounded-md">
              <option value="">Seleccionar...</option>
              <option value="01">Factura Electrónica</option>
              <option value="03">Boleta Electrónica</option>
              <option value="07">Nota de Crédito</option>
              <option value="08">Nota de Débito</option>
            </select>
            
            <div v-if="formData.tipo_comprobante" class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Número de Serie y Correlativo
              </label>
              <div class="flex space-x-2">
                <input type="text" v-model="formData.serie" 
                       class="w-1/4 p-2 border border-gray-300 rounded-md" 
                       placeholder="Serie" readonly>
                <span class="self-center">-</span>
                <input type="text" v-model="formData.numero" 
                       class="w-1/4 p-2 border border-gray-300 rounded-md" 
                       placeholder="Número" readonly>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Información del Receptor -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Información del Receptor</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <select v-model="formData.receptor.tipo_documento" 
                      class="w-full p-2 border border-gray-300 rounded-md">
                <option value="">Seleccionar...</option>
                <option value="1">DNI</option>
                <option value="6">RUC</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento *
              </label>
              <input type="text" 
                     v-model="formData.receptor.numero_documento"
                     :maxlength="formData.receptor.tipo_documento === '1' ? 8 : 11"
                     class="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="Ingrese DNI o RUC">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Razón Social / Nombre Completo *
              </label>
              <input type="text" 
                     v-model="formData.receptor.razon_social"
                     class="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="Ingrese nombre o razón social">
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <input type="text" 
                     v-model="formData.receptor.direccion"
                     class="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="Ingrese dirección">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input type="email" 
                     v-model="formData.receptor.email"
                     class="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="correo@ejemplo.com">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input type="text" 
                     v-model="formData.receptor.telefono"
                     class="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="Ingrese teléfono">
            </div>
          </div>
        </div>
        
        <!-- Items de la Factura -->
        <div class="border-t pt-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-800">Items / Servicios</h3>
            <button type="button" 
                    @click="agregarItem"
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Agregar Item
            </button>
          </div>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unit.</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IGV</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in formData.items" :key="index">
                  <td class="px-4 py-3 whitespace-nowrap">{{ index + 1 }}</td>
                  <td class="px-4 py-3">
                    <input type="text" 
                           v-model="item.descripcion"
                           @input="calcularItem(index)"
                           class="w-full p-1 border border-gray-300 rounded"
                           placeholder="Descripción del servicio">
                  </td>
                  <td class="px-4 py-3">
                    <input type="number" 
                           v-model="item.cantidad"
                           @input="calcularItem(index)"
                           min="0.01" step="0.01"
                           class="w-24 p-1 border border-gray-300 rounded">
                  </td>
                  <td class="px-4 py-3">
                    <select v-model="item.unidad_medida" 
                            class="w-24 p-1 border border-gray-300 rounded">
                      <option value="NIU">Unidad</option>
                      <option value="ZZ">Servicio</option>
                      <option value="H87">Pieza</option>
                    </select>
                  </td>
                  <td class="px-4 py-3">
                    <input type="number" 
                           v-model="item.precio_unitario"
                           @input="calcularItem(index)"
                           min="0" step="0.01"
                           class="w-32 p-1 border border-gray-300 rounded">
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">S/ {{ item.subtotal.toFixed(2) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">S/ {{ item.igv_monto.toFixed(2) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">S/ {{ item.total.toFixed(2) }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <button type="button" 
                            @click="eliminarItem(index)"
                            class="text-red-600 hover:text-red-900">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Totales -->
        <div class="border-t pt-6">
          <div class="flex justify-end">
            <div class="w-full md:w-1/3 space-y-3">
              <div class="flex justify-between">
                <span class="font-medium">Subtotal:</span>
                <span>S/ {{ formData.subtotal.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="font-medium">Descuento:</span>
                <div class="flex items-center">
                  <input type="number" 
                         v-model="formData.descuento"
                         @input="calcularTotales"
                         min="0" step="0.01"
                         class="w-24 p-1 border border-gray-300 rounded text-right">
                  <span class="ml-2">S/ {{ formData.descuento.toFixed(2) }}</span>
                </div>
              </div>
              
              <div class="flex justify-between border-t pt-2">
                <span class="font-medium">Base Imponible:</span>
                <span>S/ {{ (formData.subtotal - formData.descuento).toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between">
                <span class="font-medium">IGV (18%):</span>
                <span>S/ {{ formData.igv.toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between border-t pt-2 text-lg font-bold">
                <span>TOTAL:</span>
                <span>S/ {{ formData.total.toFixed(2) }}</span>
              </div>
              
              <div class="text-sm text-gray-600 italic">
                {{ numeroALetras }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Botones de Acción -->
        <div class="border-t pt-6 flex justify-end space-x-4">
          <button type="button" 
                  @click="$emit('cancel')"
                  class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          
          <button type="button" 
                  @click="guardarBorrador"
                  :disabled="isSubmitting"
                  class="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50">
            Guardar Borrador
          </button>
          
          <button type="submit" 
                  :disabled="isSubmitting || !formValido"
                  class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {{ isSubmitting ? 'Guardando...' : 'Generar Factura' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useFacturacionStore } from '~/stores/facturacion';

interface Usuario {
  nombres: string;
  apellidos: string;
  dni: string;
  email?: string;
  telefono?: string;
}

interface Empresa {
  ruc: string;
  razon_social: string;
  direccion?: string;
  contacto_email?: string;
  telefono?: string;
}

interface Paciente {
  usuario: Usuario;
  empresa?: Empresa;
}

interface Admision {
  id: string;
  paciente: Paciente;
  fecha_programada: string;
}

const props = defineProps({
  editing: {
    type: Boolean,
    default: false
  },
  facturaId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['success', 'cancel']);

const facturacionStore = useFacturacionStore();

// Estado del formulario
const formData = ref({
  admision_id: '',
  tipo_comprobante: '',
  serie: '',
  numero: 0,
  receptor: {
    tipo_documento: '',
    numero_documento: '',
    razon_social: '',
    direccion: '',
    email: '',
    telefono: ''
  },
  items: [
    {
      descripcion: 'Consulta Médica Ocupacional',
      cantidad: 1,
      unidad_medida: 'ZZ',
      precio_unitario: 150.00,
      subtotal: 150.00,
      igv_porcentaje: 18,
      igv_monto: 27.00,
      total: 177.00
    }
  ],
  subtotal: 150.00,
  descuento: 0,
  igv: 27.00,
  total: 177.00
});

const searchAdmision = ref('');
const admisionesFiltradas = ref<Admision[]>([]);
const admisionSeleccionada = ref<Admision | null>(null);
const showAdmisionesList = ref(false);
const isSubmitting = ref(false);

// Computed properties
const formValido = computed(() => {
  return formData.value.admision_id && 
         formData.value.tipo_comprobante &&
         formData.value.receptor.tipo_documento &&
         formData.value.receptor.numero_documento &&
         formData.value.receptor.razon_social &&
         formData.value.items.length > 0 &&
         formData.value.total > 0;
});

const numeroALetras = computed(() => {
  const numero = formData.value.total;
  return convertirNumeroALetras(numero);
});

// Métodos
async function buscarAdmisiones() {
  if (searchAdmision.value.length < 3) {
    admisionesFiltradas.value = [];
    return;
  }
  
  try {
    const response = await $fetch<{ data: Admision[] }>(`/api/admisiones/buscar?q=${searchAdmision.value}`);
    admisionesFiltradas.value = response.data;
    showAdmisionesList.value = true;
  } catch (error) {
    console.error('Error buscando admisiones:', error);
  }
}

function seleccionarAdmision(admision: Admision) {
  admisionSeleccionada.value = admision;
  formData.value.admision_id = admision.id;
  
  // Autocompletar datos del receptor
  if (admision.paciente) {
    const paciente = admision.paciente.usuario;
    const empresa = admision.paciente.empresa;
    
    formData.value.receptor = {
      tipo_documento: '1', // DNI por defecto
      numero_documento: paciente.dni,
      razon_social: `${paciente.nombres} ${paciente.apellidos}`,
      direccion: '',
      email: paciente.email || '',
      telefono: paciente.telefono || ''
    };
    
    // Si tiene empresa, usar datos de la empresa
    if (empresa) {
      formData.value.receptor = {
        tipo_documento: '6', // RUC
        numero_documento: empresa.ruc,
        razon_social: empresa.razon_social,
        direccion: empresa.direccion || '',
        email: empresa.contacto_email || '',
        telefono: empresa.telefono || ''
      };
    }
  }
  
  searchAdmision.value = '';
  showAdmisionesList.value = false;
}

async function cambiarTipoComprobante() {
  if (!formData.value.tipo_comprobante) return;
  
  try {
    // Obtener serie y número del servidor
    const response = await $fetch<{ serie: string; numero: number }>('/api/facturacion/serie-numero', {
      method: 'POST',
      body: { tipo_comprobante: formData.value.tipo_comprobante }
    });
    
    formData.value.serie = response.serie;
    formData.value.numero = response.numero;
  } catch (error) {
    console.error('Error obteniendo serie/número:', error);
  }
}

function agregarItem() {
  formData.value.items.push({
    descripcion: '',
    cantidad: 1,
    unidad_medida: 'NIU',
    precio_unitario: 0,
    subtotal: 0,
    igv_porcentaje: 18,
    igv_monto: 0,
    total: 0
  });
}

function eliminarItem(index: number) {
  if (formData.value.items.length > 1) {
    formData.value.items.splice(index, 1);
    calcularTotales();
  }
}

function calcularItem(index: number) {
  const item = formData.value.items[index];
  item.subtotal = item.cantidad * item.precio_unitario;
  item.igv_monto = item.subtotal * (item.igv_porcentaje / 100);
  item.total = item.subtotal + item.igv_monto;
  
  calcularTotales();
}

function calcularTotales() {
  formData.value.subtotal = formData.value.items.reduce((sum, item) => sum + item.subtotal, 0);
  formData.value.igv = formData.value.items.reduce((sum, item) => sum + item.igv_monto, 0);
  formData.value.total = (formData.value.subtotal - formData.value.descuento) + formData.value.igv;
}

async function guardarBorrador() {
  // Implementar guardado como borrador
  console.log('Guardando borrador...');
}

async function submitForm() {
  try {
    isSubmitting.value = true;
    
    const response = await $fetch<{ success: boolean; data: any }>('/api/facturacion/facturas/create', {
      method: 'POST',
      body: formData.value
    });
    
    if (response.success) {
      emit('success', response.data);
    }
  } catch (error) {
    console.error('Error creando factura:', error);
    alert('Error al crear la factura. Por favor, intente nuevamente.');
  } finally {
    isSubmitting.value = false;
  }
}

function formatDate(date: string | Date | number) {
  return new Date(date).toLocaleDateString('es-PE');
}

function convertirNumeroALetras(numero: number) {
  // Implementación simplificada
  const unidades = ['CERO', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
  const decenas = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
  
  const enteros = Math.floor(numero);
  const decimales = Math.round((numero - enteros) * 100);
  
  if (enteros === 0) {
    return `CERO CON ${decimales.toString().padStart(2, '0')}/100 SOLES`;
  }
  
  let letras = '';
  
  if (enteros < 10) {
    letras = unidades[enteros];
  } else if (enteros < 100) {
    const decena = Math.floor(enteros / 10);
    const unidad = enteros % 10;
    
    letras = decenas[decena];
    if (unidad > 0) {
      letras += ` Y ${unidades[unidad].toLowerCase()}`;
    }
  }
  
  return `${letras} CON ${decimales.toString().padStart(2, '0')}/100 SOLES`;
}

// Lifecycle
onMounted(() => {
  if (props.editing && props.facturaId) {
    cargarFacturaExistente();
  }
});

async function cargarFacturaExistente() {
  try {
    const response = await $fetch<{ data: any }>(`/api/facturacion/facturas/${props.facturaId}`);
    formData.value = response.data;
  } catch (error) {
    console.error('Error cargando factura:', error);
  }
}
</script>

<style scoped>
.factura-form-container {
  max-width: 1200px;
  margin: 0 auto;
}

table {
  font-size: 0.875rem;
}

input:read-only {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style>
