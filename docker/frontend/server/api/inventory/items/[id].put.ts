
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

    const body = await readBody(event)

    try {
        const updated = await prisma.inventarioItems.update({
            where: { id },
            data: {
                ...body,
                updated_at: new Date()
            }
        })
        return updated
    } catch (error: any) {
        console.error('Error updating inventory item:', error)
        throw createError({ statusCode: 500, message: 'Error actualizando ítem' })
    }
})
