import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID de caja requerido' })
    }

    try {
        const movimientos = await prisma.movimientosCaja.findMany({
            where: { caja_id: id },
            include: {
                factura: true,
                creador: {
                    select: {
                        nombres: true,
                        apellidos: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        })

        return {
            success: true,
            data: movimientos
        }
    } catch (error) {
        console.error('Error obteniendo movimientos:', error)
        throw createError({ statusCode: 500, message: 'Error obteniendo movimientos de caja' })
    }
})
