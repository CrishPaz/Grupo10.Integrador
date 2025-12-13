import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        const ayer = new Date(hoy)
        ayer.setDate(ayer.getDate() - 1)

        // Facturas de hoy
        const facturasHoy = await prisma.facturas.count({
            where: {
                created_at: { gte: hoy }
            }
        })

        // Facturas de ayer
        const facturasAyer = await prisma.facturas.count({
            where: {
                created_at: {
                    gte: ayer,
                    lt: hoy
                }
            }
        })

        // Ingresos de hoy
        const ingresosHoyResult = await prisma.facturas.aggregate({
            where: {
                created_at: { gte: hoy },
                estado_pago: 'PAGADO'
            },
            _sum: { total: true }
        })

        // Ingresos de ayer
        const ingresosAyerResult = await prisma.facturas.aggregate({
            where: {
                created_at: {
                    gte: ayer,
                    lt: hoy
                },
                estado_pago: 'PAGADO'
            },
            _sum: { total: true }
        })

        // Monto pendiente
        const montoPendienteResult = await prisma.facturas.aggregate({
            where: {
                estado_pago: 'PENDIENTE'
            },
            _sum: { total: true },
            _count: true
        })

        // Cajas abiertas y cerradas hoy
        const cajasAbiertas = await prisma.cajas.count({
            where: {
                estado: 'ABIERTA'
            }
        })

        const cajasCerradas = await prisma.cajas.count({
            where: {
                fecha_cierre: { gte: hoy },
                estado: 'CERRADA'
            }
        })

        const ingresosHoy = ingresosHoyResult._sum.total || 0
        const ingresosAyer = ingresosAyerResult._sum.total || 0

        // Calcular porcentajes
        const facturasVsAyer = facturasAyer > 0
            ? ((facturasHoy - facturasAyer) / facturasAyer) * 100
            : 0

        const ingresosVsAyer = ingresosAyer > 0
            ? ((ingresosHoy - ingresosAyer) / ingresosAyer) * 100
            : 0

        return {
            facturas_hoy: facturasHoy,
            facturas_vs_ayer: Math.round(facturasVsAyer),
            ingresos_hoy: Number(ingresosHoy),
            ingresos_vs_ayer: Math.round(ingresosVsAyer),
            monto_pendiente: Number(montoPendienteResult._sum.total || 0),
            facturas_pendientes: montoPendienteResult._count,
            cajas_abiertas: cajasAbiertas,
            cajas_cerradas: cajasCerradas
        }
    } catch (error: any) {
        console.error('Error obteniendo estadísticas:', error)

        // Retornar valores por defecto en caso de error
        return {
            facturas_hoy: 0,
            facturas_vs_ayer: 0,
            ingresos_hoy: 0,
            ingresos_vs_ayer: 0,
            monto_pendiente: 0,
            facturas_pendientes: 0,
            cajas_abiertas: 0,
            cajas_cerradas: 0
        }
    }
})
