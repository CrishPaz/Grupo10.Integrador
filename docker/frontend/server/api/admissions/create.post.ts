
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { paciente_id, empresa_id, tipo_examen, fecha_programada, hora, medico_id } = body

  if (!paciente_id || !tipo_examen || !fecha_programada || !hora) {
    throw createError({ statusCode: 400, message: 'Faltan datos obligatorios' })
  }

  // Combine Date and Time
  const fechaHora = new Date(`${fecha_programada}T${hora}:00`)

  try {
    const admission = await prisma.admisiones.create({
      data: {
        paciente_id,
        empresa_id: empresa_id || null, // Optional
        tipo_examen,
        fecha_programada: fechaHora,
        estado: 'programado',
        medico_id: medico_id || null
      }
    })

    return { success: true, admission }
  } catch (error: any) {
    console.error('Error creating admission:', error)
    throw createError({ statusCode: 500, message: error.message || 'Error al crear admisión' })
  }
})