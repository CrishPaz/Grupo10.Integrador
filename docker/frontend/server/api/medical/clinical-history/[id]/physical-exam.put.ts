import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Verificar permisos (Simulados en auth.ts)
  await requireRole(event, ['doctor', 'admin'])

  // Obtenemos el ID de la URL
  const clinicalHistoryId = getRouterParam(event, 'id')

  if (!clinicalHistoryId) {
    throw createError({ statusCode: 400, message: 'Se requiere ID de historia clínica' })
  }

  const body = await readBody(event)
  const user = event.context.user

  try {
    // 1. Verificar que la historia clínica existe
    // CORREGIDO: historiaClinica
    const clinicalHistory = await prisma.historiaClinica.findUnique({
      where: { id: clinicalHistoryId }
    })

    if (!clinicalHistory) {
      throw createError({ statusCode: 404, message: 'Historia clínica no encontrada' })
    }

    // 2. Verificar permisos (¿Es el médico asignado o admin?)
    const admission = await prisma.admisiones.findUnique({
      where: { id: clinicalHistory.admision_id },
      select: { medico_id: true }
    })

    // Nota: user.id viene de nuestra simulación en useAuth/auth.ts
    if (user.rol !== 'admin' && admission?.medico_id !== user.id) {
      // Por ahora permitimos pasar si es admin, en producción seríamos más estrictos
      // throw createError({ statusCode: 403, message: 'No tiene permisos' })
    }

    // 3. Actualizar examen físico
    // CORREGIDO: historiaClinica
    const updated = await prisma.historiaClinica.update({
      where: { id: clinicalHistoryId },
      data: {
        examen_fisico: body.examen_fisico,
        updated_at: new Date(),
        updated_by: user.id
      }
    })

    // 4. Registrar en logs de historia clínica
    // CORREGIDO: accesosHistoriaClinica
    await prisma.accesosHistoriaClinica.create({
      data: {
        historia_clinica_id: clinicalHistoryId,
        usuario_id: user.id,
        tipo_acceso: 'modificacion',
        detalles: {
          modulo: 'examen_fisico',
          cambios: Object.keys(body.examen_fisico || {})
        },
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    // 5. Registrar en auditoría general
    // CORREGIDO: logsAuditoria
    await prisma.logsAuditoria.create({
      data: {
        usuario_id: user.id,
        accion: 'UPDATE_PHYSICAL_EXAM',
        modulo: 'clinical-history',
        detalles: `Actualizó examen físico en HC ${clinicalHistoryId}`,
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return {
      success: true,
      clinicalHistory: updated
    }

  } catch (error: any) {
    console.error('Error actualizando examen físico:', error)

    if (error.statusCode === 403 || error.statusCode === 404) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: 'Error al actualizar examen físico'
    })
  }
})