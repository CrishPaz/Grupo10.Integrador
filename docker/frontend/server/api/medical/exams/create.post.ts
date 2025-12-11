
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { patientId, tipo_examen, resultados, interpretacion, recomendaciones } = body

    if (!patientId || !tipo_examen || !resultados) {
        throw createError({ statusCode: 400, message: 'Faltan datos obligatorios' })
    }

    try {
        // 1. Find the latest ACTIVE admission for this patient
        // We assume "programado" or "en proceso" (?)
        // If none, we might need to look for any recent one, or fail.
        // For now, let's look for the most recent one.
        const admission = await prisma.admisiones.findFirst({
            where: { paciente_id: patientId },
            orderBy: { fecha_programada: 'desc' },
            take: 1
        })

        if (!admission) {
            throw createError({ statusCode: 400, message: 'El paciente no tiene admisiones registradas para asociar este examen.' })
        }

        // 2. Create the Specialized Exam record
        const exam = await prisma.examenesEspecializados.create({
            data: {
                admision_id: admission.id,
                tipo_examen,
                resultados,
                interpretacion,
                recomendaciones,
                estado: 'completado',
                fecha_realizacion: new Date(),
                // realizado_por: user.id (if we had auth context here easily accessible, we'd add it)
            }
        })

        // 3. Update Admission status? Optional.

        return { success: true, exam }

    } catch (error: any) {
        console.error('Error creating exam:', error)
        throw createError({ statusCode: 500, message: error.message || 'Error guardando examen' })
    }
})
