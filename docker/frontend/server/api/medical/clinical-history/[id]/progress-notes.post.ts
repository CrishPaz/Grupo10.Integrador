import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Verificar permisos
  await requireRole(event, ['doctor', 'admin'])

  // Obtener ID de la historia clínica desde la URL
  const clinicalHistoryId = getRouterParam(event, 'id')

  if (!clinicalHistoryId) {
    throw createError({ statusCode: 400, message: 'Se requiere ID de historia clínica' })
  }

  const body = await readBody(event)
  const user = event.context.user

  // Validar datos
  if (!body.contenido || !body.tipo) {
    throw createError({ statusCode: 400, message: 'Se requiere contenido y tipo de nota' })
  }

  try {
    // 1. Verificar que la historia clínica existe
    // CORREGIDO: historiaClinica
    const clinicalHistory = await prisma.historiaClinica.findUnique({
      where: { id: clinicalHistoryId }
    })

    if (!clinicalHistory) {
      throw createError({ statusCode: 404, message: 'Historia clínica no encontrada' })
    }

    // 2. Verificar acceso (Médico asignado o Admin)
    const admission = await prisma.admisiones.findUnique({
      where: { id: clinicalHistory.admision_id },
      select: { medico_id: true }
    })

    if (user.rol !== 'admin' && admission?.medico_id !== user.id) {
      // throw createError({ statusCode: 403, message: 'No tiene permisos' })
    }

    // 3. Crear nota de evolución
    // CORREGIDO: notasEvolucion
    const note = await prisma.notasEvolucion.create({
      data: {
        historia_clinica_id: clinicalHistoryId,
        tipo: body.tipo,
        contenido: body.contenido,
        usuario_id: user.id,
        fecha: new Date()
      },
      include: {
        usuario: true
      }
    })

    // 4. Actualizar fecha de modificación de la historia
    // CORREGIDO: historiaClinica
    await prisma.historiaClinica.update({
      where: { id: clinicalHistoryId },
      data: {
        updated_at: new Date(),
        updated_by: user.id
      }
    })

    // 5. Registrar en logs de auditoría
    // CORREGIDO: accesosHistoriaClinica
    await prisma.accesosHistoriaClinica.create({
      data: {
        historia_clinica_id: clinicalHistoryId,
        usuario_id: user.id,
        tipo_acceso: 'modificacion',
        detalles: {
          modulo: 'notas_evolucion',
          tipo_nota: body.tipo
        },
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return {
      success: true,
      note
    }

  } catch (error: any) {
    console.error('Error creando nota:', error)

    if (error.statusCode === 403 || error.statusCode === 404) throw error

    throw createError({
      statusCode: 500,
      message: 'Error al crear nota de evolución'
    })
  }
})