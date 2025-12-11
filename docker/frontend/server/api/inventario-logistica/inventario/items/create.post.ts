import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para generar código único
async function generarCodigoUnico(categoria: string): Promise<string> {
  const prefixes: Record<string, string> = {
    'MEDICAMENTO': 'MED',
    'MATERIAL_LABORATORIO': 'MLAB',
    'INSTRUMENTAL': 'INST',
    'EQUIPO_MEDICO': 'EQMED',
    'CONSUMIBLES': 'CONS',
    'REACTIVOS': 'REACT',
    'DESECHABLES': 'DES'
  }
  
  const prefix = prefixes[categoria] || 'INV'
  
  // CORREGIDO: inventarioItems
  const ultimoItem = await prisma.inventarioItems.findFirst({
    where: { codigo: { startsWith: prefix } },
    orderBy: { codigo: 'desc' }
  })
  
  let nextNumber = 1
  if (ultimoItem && ultimoItem.codigo) {
    const lastNumber = parseInt(ultimoItem.codigo.replace(prefix, '')) || 0
    nextNumber = lastNumber + 1
  }
  
  return `${prefix}${nextNumber.toString().padStart(5, '0')}`
}

export default defineEventHandler(async (event) => {
  // Verificación simulada
  await requireRole(event, ['admin', 'lab'])
  
  const body = await readBody(event)
  const user = event.context.user
  
  const { nombre, categoria, tipo_unidad, stock_minimo, costo_unitario } = body
  
  if (!nombre || !categoria || !tipo_unidad || !stock_minimo || !costo_unitario) {
    throw createError({ statusCode: 400, message: 'Datos requeridos faltantes' })
  }

  try {
    const codigo = await generarCodigoUnico(categoria)
    const codigoBarras = `BAR-${codigo}` // Simulación simple

    // Crear ítem
    // CORREGIDO: inventarioItems
    const item = await prisma.inventarioItems.create({
      data: {
        codigo,
        codigo_barras: codigoBarras,
        nombre,
        nombre_comercial: body.nombre_comercial,
        descripcion: body.descripcion,
        categoria,
        subcategoria: body.subcategoria,
        tipo_unidad,
        stock_actual: body.stock_inicial ? parseFloat(body.stock_inicial) : 0,
        stock_minimo: parseFloat(stock_minimo),
        stock_maximo: body.stock_maximo ? parseFloat(body.stock_maximo) : null,
        ubicacion: body.ubicacion,
        proveedor_id: body.proveedor_id,
        costo_unitario: parseFloat(costo_unitario),
        precio_venta: body.precio_venta ? parseFloat(body.precio_venta) : null,
        lote: body.lote,
        fecha_vencimiento: body.fecha_vencimiento ? new Date(body.fecha_vencimiento) : null,
        estado: 'ACTIVO',
        created_by: user.id
      }
    })

    // Registrar movimiento inicial si hay stock
    if (body.stock_inicial && parseFloat(body.stock_inicial) > 0) {
      // CORREGIDO: movimientosInventario
      await prisma.movimientosInventario.create({
        data: {
          item_id: item.id,
          tipo_movimiento: 'ENTRADA',
          cantidad: parseFloat(body.stock_inicial),
          unidad_medida: tipo_unidad,
          costo_unitario: parseFloat(costo_unitario),
          total_costo: parseFloat(body.stock_inicial) * parseFloat(costo_unitario),
          observaciones: 'Inventario Inicial',
          created_by: user.id
        }
      })
    }

    return { success: true, item }

  } catch (error: any) {
    console.error('Error inventario:', error)
    throw createError({ statusCode: 500, message: 'Error creando ítem' })
  }
})