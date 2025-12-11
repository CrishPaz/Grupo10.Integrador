
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const {
        codigo, nombre, nombre_comercial, categoria,
        tipo_unidad, stock_minimo, costo_unitario,
        stock_actual, ubicacion, precio_venta,
        iva_porcentaje, lote, fecha_vencimiento
    } = body

    if (!codigo || !nombre || !categoria) {
        throw createError({ statusCode: 400, message: 'Código, Nombre y Categoría son obligatorios' })
    }

    try {
        const existing = await prisma.inventarioItems.findUnique({
            where: { codigo }
        })

        if (existing) {
            throw createError({ statusCode: 400, message: 'Ya existe un ítem con este código' })
        }

        const newItem = await prisma.inventarioItems.create({
            data: {
                codigo,
                nombre,
                nombre_comercial,
                categoria,
                tipo_unidad: tipo_unidad || 'UNIDAD',
                stock_minimo: stock_minimo || 5,
                costo_unitario: costo_unitario || 0,
                stock_actual: stock_actual || 0,
                ubicacion,
                precio_venta: precio_venta || null,
                iva_porcentaje: iva_porcentaje || 18.00,
                lote: lote || null,
                fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
                estado: 'ACTIVO'
            }
        })

        return newItem
    } catch (error: any) {
        console.error('Error creating inventory item:', error)
        throw createError({ statusCode: 500, message: error.message || 'Error guardando ítem' })
    }
})
