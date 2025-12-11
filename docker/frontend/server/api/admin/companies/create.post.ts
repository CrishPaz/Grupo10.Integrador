
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { ruc, razon_social, direccion, telefono, contacto_nombre, contacto_email } = body

    if (!ruc || !razon_social) {
        throw createError({ statusCode: 400, message: 'RUC y Razón Social son obligatorios' })
    }

    try {
        const existing = await prisma.empresas.findUnique({
            where: { ruc }
        })

        if (existing) {
            throw createError({ statusCode: 400, message: 'Ya existe una empresa con este RUC' })
        }

        const company = await prisma.empresas.create({
            data: {
                ruc,
                razon_social,
                direccion,
                telefono,
                contacto_nombre,
                contacto_email,
                activo: true
            }
        })

        return company
    } catch (error: any) {
        console.error('Error creating company:', error)
        throw createError({ statusCode: 500, message: error.message || 'Error creando empresa' })
    }
})
