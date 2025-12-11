import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const id = getRouterParam(event, 'id')

    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

    // Transaction for atomicity
    await prisma.$transaction(async (tx) => {
        // 1. Delete user
        const deletedUser = await tx.usuarios.delete({
            where: { id }
        })

        // 2. Audit Log
        await tx.logsAuditoria.create({
            data: {
                usuario_id: (event.context.user?.id && !event.context.user.id.startsWith('12345-')) ? event.context.user.id : null,
                accion: 'DELETE_USER',
                modulo: 'admin',
                detalles: `Eliminó usuario: ${deletedUser.email}`,
                ip_address: '127.0.0.1',
                user_agent: 'navegador'
            }
        })
    })

    return { success: true }
})
