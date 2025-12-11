
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const patientId = event.context.params?.id

    if (!patientId) {
        throw createError({ statusCode: 400, message: 'ID de paciente requerido' })
    }

    try {
        // Fetch specialized exams linked to admissions for this patient
        const exams = await prisma.examenesEspecializados.findMany({
            where: {
                admision: {
                    paciente_id: patientId
                }
            },
            orderBy: { created_at: 'desc' },
            include: {
                admision: {
                    select: { fecha_programada: true }
                }
            }
        })

        return { exams }

    } catch (error: any) {
        console.error('Error fetching patient history:', error)
        throw createError({ statusCode: 500, message: 'Error cargando historial' })
    }
})
