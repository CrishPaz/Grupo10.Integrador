import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Funciones auxiliares
function calcularTotales(items: any[], descuento: number) {
  let subtotal = 0
  for (const item of items) {
    subtotal += item.cantidad * item.precio_unitario
  }
  const baseImponible = subtotal - descuento
  const igv = baseImponible * 0.18
  const total = baseImponible + igv
  return { subtotal, igv, total }
}

async function obtenerSerie(tipoComprobante: string): Promise<string> {
  const config: Record<string, string> = {
    '01': 'F001',
    '03': 'B001',
    '07': 'FC01',
    '08': 'FD01'
  }
  return config[tipoComprobante] || 'F001'
}

async function generarNumeroFactura(serie: string): Promise<number> {
  // CORREGIDO: Usamos Prisma aggregate en lugar de queryRaw para mayor seguridad
  const result = await prisma.facturas.aggregate({
    where: { serie },
    _max: { numero: true }
  })
  return (result._max.numero || 0) + 1
}

export default defineEventHandler(async (event) => {
  // Verificación de seguridad simulada
  await requireRole(event, ['admin', 'admissions'])
  
  const body = await readBody(event)
  const user = event.context.user
  
  const { admision_id, tipo_comprobante, receptor, items, descuento = 0 } = body
  
  // Validaciones
  if (!items || items.length === 0) {
    throw createError({ statusCode: 400, message: 'Faltan items' })
  }

  try {
    // 1. Obtener serie y número
    const serie = await obtenerSerie(tipo_comprobante)
    const numero = await generarNumeroFactura(serie)
    
    // 2. Calcular totales
    const { subtotal, igv, total } = calcularTotales(items, descuento)
    
    // 3. Crear Factura (Transacción)
    const factura = await prisma.$transaction(async (tx) => {
      // CORREGIDO: facturas
      const newInvoice = await tx.facturas.create({
        data: {
          admision_id: admision_id || null,
          tipo_comprobante,
          serie,
          numero,
          fecha_emision: new Date(),
          
          // Emisor (Hardcoded por ahora)
          emisor_ruc: '20600000001',
          emisor_razon_social: 'CLINICA SALUD LABORAL DEMO',
          
          // Receptor
          receptor_tipo_documento: receptor.tipo_documento,
          receptor_numero_documento: receptor.numero_documento,
          receptor_razon_social: receptor.razon_social,
          receptor_direccion: receptor.direccion,
          receptor_email: receptor.email,
          
          // Montos
          subtotal,
          descuento,
          base_imponible: subtotal - descuento,
          igv,
          total,
          total_letras: `SON: ${total} SOLES`, // Simplificado
          
          estado_sunat: 'PENDIENTE',
          estado_pago: 'PENDIENTE',
          
          created_by: user.id
        }
      })
      
      // Crear detalles
      for (const [index, item] of items.entries()) {
        // CORREGIDO: facturaDetalles
        await tx.facturaDetalles.create({
          data: {
            factura_id: newInvoice.id,
            item_orden: index + 1,
            codigo_producto: item.codigo,
            descripcion: item.descripcion,
            cantidad: item.cantidad,
            unidad_medida: item.unidad_medida || 'NIU',
            precio_unitario: item.precio_unitario,
            subtotal: item.cantidad * item.precio_unitario,
            igv_porcentaje: 18.00,
            igv_monto: (item.cantidad * item.precio_unitario) * 0.18,
            total: (item.cantidad * item.precio_unitario) * 1.18
          }
        })
      }
      
      return newInvoice
    })
    
    // 4. Auditoría
    // CORREGIDO: logsAuditoria
    await prisma.logsAuditoria.create({
      data: {
        usuario_id: user.id,
        accion: 'CREATE_INVOICE',
        modulo: 'facturacion',
        detalles: `Factura creada ${serie}-${numero}`,
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return { success: true, data: factura }

  } catch (error: any) {
    console.error('Error factura:', error)
    throw createError({ statusCode: 500, message: 'Error creando factura' })
  }
})