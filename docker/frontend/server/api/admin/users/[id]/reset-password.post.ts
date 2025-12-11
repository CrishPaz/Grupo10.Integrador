import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const id = getRouterParam(event, 'id')

    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

    const defaultPassword = 'Changed123!'
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(defaultPassword, salt)

    // Transaction
    await prisma.$transaction(async (tx) => {
        // Update password
        const user = await tx.usuarios.update({
            where: { id },
            data: { password_hash: passwordHash }
        })

        // Audit Log
        await tx.logsAuditoria.create({
            data: {
                usuario_id: (event.context.user?.id && !event.context.user.id.startsWith('12345-')) ? event.context.user.id : null,
                accion: 'RESET_PASSWORD',
                modulo: 'admin',
                detalles: `Reseteó contraseña usuario: ${user.email}`,
                ip_address: '127.0.0.1',
                user_agent: 'navegador'
            }
        })
    })

    return { success: true, message: 'Contraseña reseteada a: ' + defaultPassword }
})
