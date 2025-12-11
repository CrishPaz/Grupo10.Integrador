
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    paciente_id, admision_id, tipo_muestra,
    recipiente, cantidad, color, aspecto,
    temperatura_transporte, tiempo_transporte, observaciones_muestra
  } = body

  if (!paciente_id || !tipo_muestra) {
    throw createError({ statusCode: 400, message: 'Faltan datos obligatorios' })
  }

  try {
    // Generate a sample code (simple uuid substring or sequence)
    const code = `M-${Date.now().toString().slice(-6)}`

    const sample = await prisma.muestrasLaboratorio.create({
      data: {
        codigo_muestra: code,
        paciente_id,
        admision_id: admision_id || null,
        tipo_muestra,
        recipiente,
        cantidad: cantidad ? Number(cantidad) : null,
        color,
        aspecto,
        temperatura_transporte: temperatura_transporte ? Number(temperatura_transporte) : null,
        tiempo_transporte: tiempo_transporte ? Number(tiempo_transporte) : null,
        observaciones_muestra,
        estado: 'pendiente',
        fecha_recepcion: new Date()
      }
    })

    // Create a default request/solicitud linked to this sample? 
    // Usually a sample comes with a request. For now, we just create the sample.
    // Ideally, we should also look up what exams are in the admission and create requests.
    // But the form doesn't ask for exams, just sample reception. 
    // We'll leave it as just sample creation for now, as that's what the UI supports.

    return { success: true, sample }
  } catch (error: any) {
    console.error('Error creating sample:', error)
    throw createError({ statusCode: 500, message: error.message || 'Error al crear muestra' })
  }
})