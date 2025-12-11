import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  await requireRole(event, ['admin', 'admissions'])
  
  const query = getQuery(event)
  const fechaStr = query.fecha ? String(query.fecha) : new Date().toISOString()
  const fecha = new Date(fechaStr)
  
  const startOfDay = new Date(fecha)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(fecha)
  endOfDay.setHours(23, 59, 59, 999)

  try {
    // 1. Obtener Cajas Abiertas/Cerradas
    // CORREGIDO: cajas
    const cajas = await prisma.cajas.findMany({
      where: {
        fecha: { gte: startOfDay, lt: endOfDay }
      },
      include: {
        responsable: { select: { nombres: true, apellidos: true } }
      }
    })

    // 2. Obtener Facturas del día
    // CORREGIDO: facturas
    const facturasDelDia = await prisma.facturas.findMany({
      where: {
        fecha_emision: { gte: startOfDay, lt: endOfDay }
      }
    })

    // 3. Obtener Pagos del día
    // CORREGIDO: pagos
    const pagosDelDia = await prisma.pagos.findMany({
      where: {
        fecha_pago: { gte: startOfDay, lt: endOfDay }
      },
      include: {
        factura: { select: { serie: true, numero: true } }
      }
    })

    // 4. Calcular Resumen
    const resumen = {
      total_ingresos: pagosDelDia.reduce((sum, p) => sum + Number(p.monto), 0),
      total_facturado: facturasDelDia.reduce((sum, f) => sum + Number(f.total), 0),
      efectivo: pagosDelDia.filter(p => p.tipo_pago === 'EFECTIVO').reduce((sum, p) => sum + Number(p.monto), 0),
      digital: pagosDelDia.filter(p => p.tipo_pago !== 'EFECTIVO').reduce((sum, p) => sum + Number(p.monto), 0)
    }

    return {
      success: true,
      data: {
        fecha: fecha.toISOString().split('T')[0],
        cajas,
        facturas: facturasDelDia,
        pagos: pagosDelDia,
        resumen
      }
    }

  } catch (error) {
    console.error('Error caja:', error)
    throw createError({ statusCode: 500, message: 'Error obteniendo caja' })
  }
})