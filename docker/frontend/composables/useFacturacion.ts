import { ref, computed } from 'vue';
import type { Factura, Pago, Caja, ReporteCaja } from '~/types/facturacion';

export const useFacturacion = () => {
  // Estados
  const facturas = ref<Factura[]>([]);
  const pagos = ref<Pago[]>([]);
  const cajas = ref<Caja[]>([]);
  const reportes = ref<ReporteCaja[]>([]);
  
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  // Facturas
  const fetchFacturas = async (filtros: any = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const query = new URLSearchParams(filtros).toString();
      const response: any = await $fetch(`/api/facturacion/facturas?${query}`);
      facturas.value = response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al cargar facturas';
      console.error('Error fetching facturas:', err);
    } finally {
      loading.value = false;
    }
  };
  
  const fetchFacturaById = async (facturaId: string) => {
    loading.value = true;
    
    try {
      const response: any = await $fetch(`/api/facturacion/facturas/${facturaId}`);
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al cargar factura';
      console.error('Error fetching factura:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const crearFactura = async (facturaData: any) => {
    loading.value = true;
    
    try {
      const response: any = await $fetch('/api/facturacion/facturas/create', {
        method: 'POST',
        body: facturaData
      });
      
      // Actualizar lista local
      if (response.data) {
          facturas.value.unshift(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al crear factura';
      console.error('Error creating factura:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const enviarASUNAT = async (facturaId: string) => {
    try {
      const response: any = await $fetch('/api/facturacion/sunat/enviar', {
        method: 'POST',
        body: { factura_id: facturaId }
      });
      
      // Actualizar factura local
      const index = facturas.value.findIndex(f => f.id === facturaId);
      if (index !== -1) {
        facturas.value[index] = {
          ...facturas.value[index],
          estado_sunat: response.data.estado,
          cdr_respuesta: response.data.cdr
        };
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al enviar a SUNAT';
      console.error('Error sending to SUNAT:', err);
      throw err;
    }
  };
  
  // Pagos
  const fetchPagos = async (filtros: any = {}) => {
    try {
      const query = new URLSearchParams(filtros).toString();
      const response: any = await $fetch(`/api/facturacion/pagos?${query}`);
      pagos.value = response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al cargar pagos';
      console.error('Error fetching pagos:', err);
    }
  };
  
  const registrarPago = async (pagoData: any) => {
    loading.value = true;
    
    try {
      const response: any = await $fetch('/api/facturacion/pagos/create', {
        method: 'POST',
        body: pagoData
      });
      
      // Actualizar lista local
      if (response.data) {
          pagos.value.unshift(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al registrar pago';
      console.error('Error creating payment:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Caja
  const abrirCaja = async (montoInicial: number) => {
    try {
      const response: any = await $fetch('/api/facturacion/caja/abrir', {
        method: 'POST',
        body: { monto_inicial: montoInicial }
      });
      
      if (response.data) {
          cajas.value.unshift(response.data);
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al abrir caja';
      console.error('Error opening cash register:', err);
      throw err;
    }
  };
  
  const cerrarCaja = async (cajaId: string, observaciones?: string) => {
    try {
      const response: any = await $fetch(`/api/facturacion/caja/${cajaId}/cerrar`, {
        method: 'POST',
        body: { observaciones }
      });
      
      // Actualizar caja local
      const index = cajas.value.findIndex(c => c.id === cajaId);
      if (index !== -1) {
        cajas.value[index] = response.data;
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al cerrar caja';
      console.error('Error closing cash register:', err);
      throw err;
    }
  };
  
  const fetchReporteCajaDiaria = async (fecha?: string) => {
    try {
      const query = fecha ? `?fecha=${fecha}` : '';
      const response: any = await $fetch(`/api/facturacion/caja/diaria${query}`);
      
      // Si la API devuelve un resumen, lo usamos
      if (response.data) {
          // Adaptamos según lo que devuelve tu API real
          // reportes.value = response.data.reportes; 
      }
      
      return response.data;
    } catch (err: any) {
      error.value = err.message || 'Error al cargar reporte de caja';
      console.error('Error fetching cash report:', err);
      throw err;
    }
  };
  
  // Utilitarios
  const calcularTotalesPorMetodo = (pagosList: Pago[]) => {
    const totales: Record<string, number> = {
      EFECTIVO: 0,
      TARJETA_CREDITO: 0,
      TARJETA_DEBITO: 0,
      TRANSFERENCIA: 0,
      YAPE: 0,
      PLIN: 0
    };
    
    pagosList.forEach(pago => {
      if (pago.tipo_pago in totales) {
        totales[pago.tipo_pago] += Number(pago.monto || 0);
      }
    });
    
    return totales;
  };
  
  return {
    // Estados
    facturas,
    pagos,
    cajas,
    reportes,
    loading,
    error,
    
    // Métodos Facturas
    fetchFacturas,
    fetchFacturaById,
    crearFactura,
    enviarASUNAT,
    
    // Métodos Pagos
    fetchPagos,
    registrarPago,
    
    // Métodos Caja
    abrirCaja,
    cerrarCaja,
    fetchReporteCajaDiaria,
    
    // Utilitarios
    calcularTotalesPorMetodo
  };
};