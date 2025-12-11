
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    const body = await readBody(event)
    const { ruc, razon_social, direccion, telefono, contacto_nombre, contacto_email } = body

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID requerido' })
    }

    try {
        const company = await prisma.empresas.update({
            where: { id },
            data: {
                ruc,
                razon_social,
                direccion,
                telefono,
                contacto_nombre,
                contacto_email
            }
        })

        return company
    } catch (error: any) {
        console.error('Error updating company:', error)
        if (error.code === 'P2002') { // Unique constraint failed
            throw createError({ statusCode: 400, message: 'El RUC ya está en uso por otra empresa' })
        }
        throw createError({ statusCode: 500, message: 'Error actualizando empresa' })
    }
})
