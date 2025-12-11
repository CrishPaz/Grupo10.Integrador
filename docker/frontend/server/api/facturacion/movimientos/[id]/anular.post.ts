import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID de movimiento requerido' })
    }

    try {
        const movimiento = await prisma.movimientosCaja.update({
            where: { id },
            data: {
                estado: 'ANULADO'
            }
        })

        return {
            success: true,
            data: movimiento
        }
    } catch (error) {
        console.error('Error anulando movimiento:', error)
        throw createError({ statusCode: 500, message: 'Error anulando movimiento' })
    }
})
