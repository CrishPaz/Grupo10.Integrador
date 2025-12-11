
import { prisma } from '~/server/utils/prisma'
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {
    try {
        const items = await prisma.inventarioItems.findMany({
            orderBy: { created_at: 'desc' }
        })

        // Calculate statistics
        const total_items = items.length

        const stock_critico = items.filter(item =>
            item.stock_actual.toNumber() <= item.stock_minimo.toNumber()
        ).length

        const thirtyDaysFromNow = new Date()
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

        const por_vencer = items.filter(item =>
            item.fecha_vencimiento &&
            new Date(item.fecha_vencimiento) <= thirtyDaysFromNow &&
            new Date(item.fecha_vencimiento) >= new Date() &&
            item.stock_actual.toNumber() > 0
        ).length

        const valor_total = items.reduce((sum, item) => {
            const stock = item.stock_actual.toNumber()
            const cost = item.costo_unitario.toNumber()
            return sum + (stock * cost)
        }, 0)

        console.log('Stats calc:', { total_items, stock_critico, por_vencer, valor_total })

        const safeItems = items.map(i => ({
            id: i.id,
            codigo: i.codigo,
            nombre: i.nombre,
            nombre_comercial: i.nombre_comercial,
            categoria: i.categoria,
            subcategoria: i.subcategoria,
            tipo_unidad: i.tipo_unidad,
            ubicacion: i.ubicacion,
            lote: i.lote,
            fecha_vencimiento: i.fecha_vencimiento ? i.fecha_vencimiento.toISOString() : null,
            stock_actual: i.stock_actual ? i.stock_actual.toNumber() : 0,
            stock_minimo: i.stock_minimo ? i.stock_minimo.toNumber() : 0,
            costo_unitario: i.costo_unitario ? i.costo_unitario.toNumber() : 0,
            precio_venta: i.precio_venta ? i.precio_venta.toNumber() : 0,
            iva_porcentaje: i.iva_porcentaje ? i.iva_porcentaje.toNumber() : 0,
            estado: i.estado
        }))

        return {
            items: safeItems,
            stats: {
                total_items,
                stock_critico,
                por_vencer,
                valor_total
            }
        }
    } catch (error: any) {
        console.error('Error fetching inventory:', error)
        throw createError({ statusCode: 500, message: 'Error cargando inventario' })
    }
})
