
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID requerido' })
    }

    try {
        // Soft delete
        const company = await prisma.empresas.update({
            where: { id },
            data: { activo: false }
        })

        return { success: true, id: company.id }
    } catch (error: any) {
        console.error('Error deleting company:', error)
        throw createError({ statusCode: 500, message: 'Error eliminando empresa' })
    }
})
