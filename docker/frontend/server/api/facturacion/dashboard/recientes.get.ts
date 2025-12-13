import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        // Facturas recientes (últimas 10)
        const facturas = await prisma.facturas.findMany({
            orderBy: {
                created_at: 'desc'
            },
            take: 10,
            select: {
                id: true,
                serie: true,
                numero: true,
                receptor_razon_social: true,
                total: true,
                estado_pago: true,
                fecha_emision: true
            }
        })

        return { data: facturas }
    } catch (error: any) {
        console.error('Error obteniendo facturas recientes:', error)
        return { data: [] }
    }
})
