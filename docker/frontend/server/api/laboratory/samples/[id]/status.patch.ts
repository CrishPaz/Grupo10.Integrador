
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { estado } = body

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID de muestra es requerido' })
    }

    if (!estado) {
        throw createError({ statusCode: 400, message: 'Estado es requerido' })
    }

    // Valid states
    const validStates = ['pendiente', 'procesando', 'completado', 'rechazado']
    if (!validStates.includes(estado)) {
        throw createError({ statusCode: 400, message: 'Estado inválido' })
    }

    try {
        const updatedSample = await prisma.muestrasLaboratorio.update({
            where: { id },
            data: {
                estado,
                updated_at: new Date()
            }
        })

        return updatedSample
    } catch (error: any) {
        console.error('Error updating sample status:', error)
        throw createError({ statusCode: 500, message: 'Error actualizando estado de muestra' })
    }
})
