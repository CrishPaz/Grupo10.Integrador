import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

    // Prepare update data
    const updateData: any = {
        nombres: body.nombres,
        apellidos: body.apellidos,
        email: body.email,
        dni: body.dni,
        telefono: body.telefono,
        rol: body.rol,
        especialidad: body.especialidad,
        colegiatura: body.colegiatura
    }

    // Handle password update if provided
    if (body.password) {
        const salt = await bcrypt.genSalt(10)
        updateData.password_hash = await bcrypt.hash(body.password, salt)
    }

    // Transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
        const user = await tx.usuarios.update({
            where: { id },
            data: updateData
        })

        // Audit Log
        await tx.logsAuditoria.create({
            data: {
                usuario_id: (event.context.user?.id && !event.context.user.id.startsWith('12345-')) ? event.context.user.id : null,
                accion: 'UPDATE_USER',
                modulo: 'admin',
                detalles: `Actualizó usuario: ${user.email}`,
                ip_address: '127.0.0.1',
                user_agent: 'navegador'
            }
        })

        return user
    })

    // Remove sensitive data
    const { password_hash, ...safeUser } = updatedUser
    return { success: true, user: safeUser }
})
