import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID de caja requerido' })
    }

    // TODO: Obtener usuario real de la sesión cuando esté implementado auth
    // Por ahora hardcoded o simulado si no hay contexto de usuario
    // const user = event.context.auth?.user 

    try {
        const caja = await prisma.cajas.update({
            where: { id },
            data: {
                estado: 'CERRADA',
                hora_cierre: new Date(),
                // cerrado_por: user?.id 
            }
        })

        return {
            success: true,
            data: caja
        }
    } catch (error) {
        console.error('Error cerrando caja:', error)
        throw createError({ statusCode: 500, message: 'Error cerrando la caja' })
    }
})
