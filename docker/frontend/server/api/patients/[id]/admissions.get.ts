
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const patientId = event.context.params?.id

    if (!patientId) {
        throw createError({ statusCode: 400, message: 'ID de paciente requerido' })
    }

    try {
        const admissions = await prisma.admisiones.findMany({
            where: {
                paciente_id: patientId,
                estado: { not: 'cancelado' }
            },
            orderBy: { fecha_programada: 'desc' },
            select: {
                id: true,
                tipo_examen: true,
                fecha_programada: true,
                estado: true
            }
        })

        return { data: admissions }
    } catch (error) {
        console.error('Error fetching patient admissions:', error)
        return { data: [] }
    }
})
