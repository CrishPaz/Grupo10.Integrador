import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Verificación de permisos
    await requireRole(event, ['admin', 'lab'])

    const id = event.context.params?.id
    const body = await readBody(event)
    const user = event.context.user

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID de ítem requerido' })
    }

    try {
        // 1. Verificar existencia
        const existingItem = await prisma.inventarioItems.findUnique({
            where: { id }
        })

        if (!existingItem) {
            throw createError({ statusCode: 404, message: 'Ítem no encontrado' })
        }

        // 2. Preparar datos para actualización
        // Filtramos campos que no deberían actualizarse directamente o transformamos tipos si es necesario
        const dataToUpdate: any = {
            ...body,
            // Asegurar tipos numéricos si vienen como string
            stock_minimo: body.stock_minimo ? parseFloat(body.stock_minimo) : undefined,
            stock_maximo: body.stock_maximo ? parseFloat(body.stock_maximo) : undefined,
            costo_unitario: body.costo_unitario ? parseFloat(body.costo_unitario) : undefined,
            precio_venta: body.precio_venta ? parseFloat(body.precio_venta) : undefined,
            fecha_vencimiento: body.fecha_vencimiento ? new Date(body.fecha_vencimiento) : undefined,
            // Metadata
            updated_at: new Date()
        }

        // Eliminar campos que no existen en el modelo o son read-only
        delete dataToUpdate.id
        delete dataToUpdate.codigo
        delete dataToUpdate.created_at
        delete dataToUpdate.created_by

        // 3. Actualizar
        const updatedItem = await prisma.inventarioItems.update({
            where: { id },
            data: dataToUpdate
        })

        return { success: true, data: updatedItem }

    } catch (error: any) {
        console.error('Error updating item:', error)
        throw createError({ statusCode: 500, message: error.message || 'Error actualizando ítem' })
    }
})
