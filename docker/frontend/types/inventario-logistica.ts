export interface InventarioItem {
  id: string;
  codigo: string;
  nombre: string;
  nombre_comercial?: string;
  categoria: string;
  tipo_unidad: string;
  stock_actual: number;
  stock_minimo: number;
  stock_maximo?: number;
  punto_reorden?: number;
  ubicacion?: string;
  costo_unitario: number;
  precio_venta?: number;
  lote?: string;
  fecha_vencimiento?: string;
  estado: string;
}

export interface MovimientoInventario {
  id: string;
  item_id: string;
  tipo_movimiento: 'ENTRADA' | 'SALIDA' | 'AJUSTE' | 'TRASLADO' | 'CADUCADO';
  cantidad: number;
  costo_unitario: number;
  total_costo: number;
  observaciones?: string;
  created_at: string;
  created_by?: string;
}

export interface SeguimientoLogistico {
  id: string;
  admision_id: string;
  tipo_servicio: 'LABORATORIO' | 'IMAGENES' | 'CONSULTA' | 'PROCEDIMIENTO';
  estado_actual: string;
  ubicacion_actual?: string;
  responsable_actual?: string;
  fecha_estimada_entrega: string;
  fecha_real_entrega?: string;
  estado_general: 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO' | 'RETRASADO';
  // Campos calculados en frontend
  paciente_nombre?: string;
  paciente_dni?: string;
  responsable_nombre?: string;
  estado_tiempo?: string;
}

export interface AlertaInventario {
  id: string;
  item_id: string;
  tipo_alerta: string;
  nivel_gravedad: string;
  mensaje: string;
  estado: string;
  created_at: string;
}