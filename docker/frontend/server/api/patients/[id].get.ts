
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID de paciente requerido' })
    }

    try {
        const patient = await prisma.pacientes.findUnique({
            where: { id },
            include: {
                usuarioUsuario: true,
                empresa: true
            }
        })

        if (!patient) {
            throw createError({ statusCode: 404, message: 'Paciente no encontrado' })
        }

        return {
            patient,
            user: patient.usuarioUsuario
        }

    } catch (error: any) {
        // If invalid UUID, might crash prisma, so handle it
        console.error('Error fetching patient:', error)
        throw createError({ statusCode: 500, message: 'Error cargando paciente' })
    }
})
