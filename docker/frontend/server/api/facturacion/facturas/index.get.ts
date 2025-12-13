import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    // Filtros opcionales
    const estado = query.estado as string | undefined
    const fechaDesde = query.fecha_desde as string | undefined
    const fechaHasta = query.fecha_hasta as string | undefined
    const page = parseInt(query.page as string || '1')
    const limit = parseInt(query.limit as string || '20')

    try {
        const where: any = {}

        // Aplicar filtros
        if (estado) {
            where.estado_pago = estado
        }

        if (fechaDesde || fechaHasta) {
            where.created_at = {}
            if (fechaDesde) {
                where.created_at.gte = new Date(fechaDesde)
            }
            if (fechaHasta) {
                where.created_at.lte = new Date(fechaHasta)
            }
        }

        // Obtener total para paginación
        const total = await prisma.facturas.count({ where })

        // Obtener facturas
        const facturas = await prisma.facturas.findMany({
            where,
            include: {
                admision: {
                    include: {
                        paciente: {
                            include: {
                                usuarioUsuario: {
                                    select: {
                                        nombres: true,
                                        apellidos: true,
                                        dni: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        })

        return {
            data: facturas,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        }
    } catch (error: any) {
        console.error('Error listando facturas:', error)
        throw createError({
            statusCode: 500,
            message: 'Error al listar facturas: ' + error.message
        })
    }
})
