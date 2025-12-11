import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para validar flujo
function validarTransicion(actual: string, nuevo: string): boolean {
  // Lógica simplificada: Permitir avanzar siempre, bloquear retrocesos ilógicos si se desea
  // Por ahora permitimos todo para facilitar pruebas
  return true 
}

export default defineEventHandler(async (event) => {
  await requireRole(event, ['admin', 'lab', 'doctor'])
  
  const body = await readBody(event)
  const user = event.context.user
  
  const { seguimiento_id, nuevo_estado, observaciones, ubicacion } = body
  
  if (!seguimiento_id || !nuevo_estado) {
    throw createError({ statusCode: 400, message: 'Faltan datos' })
  }

  try {
    // 1. Obtener seguimiento
    // CORREGIDO: seguimientoLogistico
    const seguimiento = await prisma.seguimientoLogistico.findUnique({
      where: { id: seguimiento_id },
      include: { admision: { include: { paciente: { include: { usuarioUsuario: true } } } } }
    })

    if (!seguimiento) throw createError({ statusCode: 404, message: 'Seguimiento no encontrado' })

    // 2. Actualizar estado principal
    const actualizado = await prisma.seguimientoLogistico.update({
      where: { id: seguimiento_id },
      data: {
        estado_actual: nuevo_estado,
        ubicacion_actual: ubicacion || seguimiento.ubicacion_actual,
        responsable_actual: user.id,
        fecha_estado_actual: new Date(),
        // Si es estado final, cerramos el ciclo
        fecha_real_entrega: ['ENTREGADO', 'COMPLETADO'].includes(nuevo_estado) ? new Date() : null,
        estado_general: ['ENTREGADO', 'CANCELADO'].includes(nuevo_estado) ? nuevo_estado : 'EN_PROCESO'
      }
    })

    // 3. Registrar en historial (Timeline)
    // CORREGIDO: historialEstadosLogistica
    await prisma.historialEstadosLogistica.create({
      data: {
        seguimiento_id,
        estado: nuevo_estado,
        observaciones: observaciones || `Cambio de estado a ${nuevo_estado}`,
        ubicacion: ubicacion || seguimiento.ubicacion_actual,
        responsable_id: user.id,
        created_by: user.id
      }
    })

    return { success: true, data: actualizado }

  } catch (error: any) {
    console.error('Error logistica:', error)
    throw createError({ statusCode: 500, message: error.message })
  }
})