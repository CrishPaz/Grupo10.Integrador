import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const id = getRouterParam(event, 'id')

    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

    // Transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
        // Get current status
        const current = await tx.usuarios.findUnique({ where: { id } })
        if (!current) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

        // Toggle
        const user = await tx.usuarios.update({
            where: { id },
            data: { activo: !current.activo }
        })

        // Audit Log
        await tx.logsAuditoria.create({
            data: {
                usuario_id: (event.context.user?.id && !event.context.user.id.startsWith('12345-')) ? event.context.user.id : null,
                accion: 'TOGGLE_STATUS',
                modulo: 'admin',
                detalles: `Cambió estado usuario ${user.email} a: ${user.activo ? 'Activo' : 'Inactivo'}`,
                ip_address: '127.0.0.1',
                user_agent: 'navegador'
            }
        })

        return user
    })

    return { success: true, activo: updatedUser.activo }
})
