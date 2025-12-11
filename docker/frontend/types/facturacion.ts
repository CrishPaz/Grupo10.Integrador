export interface Factura {
  id: string;
  serie: string;
  numero: number;
  fecha_emision: string;
  receptor_razon_social: string;
  receptor_numero_documento: string;
  total: number;
  estado_pago: 'PENDIENTE' | 'PAGADO' | 'PAGO_PARCIAL' | 'ANULADO';
  estado_sunat: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO';
  xml_firmado?: string;
  cdr_respuesta?: string;
  items?: FacturaItem[];
  pagos?: Pago[];
}

export interface FacturaItem {
  id?: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  igv_monto: number;
  total: number;
}

export interface Pago {
  id: string;
  factura_id: string;
  tipo_pago: string;
  monto: number;
  fecha_pago: string;
  numero_transaccion?: string;
  estado: string;
}

export interface Caja {
  id: string;
  usuario_id: string;
  fecha: string;
  hora_apertura: string;
  hora_cierre?: string;
  total_ingresos: number;
  total_egresos: number;
  diferencia: number;
  estado: 'ABIERTA' | 'CERRADA';
  monto_final_efectivo?: number;
  monto_final_tarjeta?: number;
  monto_final_transferencia?: number;
  monto_final_otros?: number;
}

export interface ReporteCaja {
  fecha: string;
  total_ingresos: number;
  total_egresos: number;
  detalle_por_metodo: Record<string, number>;
}