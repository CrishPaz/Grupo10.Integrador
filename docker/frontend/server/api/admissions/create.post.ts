
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

    // Trigger n8n webhook for confirmation notifications
    const webhookUrl = process.env.N8N_WEBHOOK_URL + '/admission-created'
    if (webhookUrl) {
      try {
        console.log('🔔 Enviando webhook a:', webhookUrl)
        const response = await $fetch(webhookUrl, {
          method: 'POST',
          body: {
            admission_id: admission.id
          }
        })
        console.log('✅ Webhook de confirmación enviado a n8n:', response)
      } catch (webhookError: any) {
        console.error('⚠️ Error al enviar webhook a n8n:', webhookError)
        console.error('URL intentada:', webhookUrl)
        console.error('Detalles del error:', webhookError.message || webhookError)
        // No lanzamos error para que la admisión se cree aunque falle el webhook
      }
    } else {
      console.warn('⚠️ N8N_WEBHOOK_URL no está configurada')
    }

    return { success: true, admission }
  } catch (error: any) {
    console.error('Error creating admission:', error)
    throw createError({ statusCode: 500, message: error.message || 'Error al crear admisión' })
  }
})