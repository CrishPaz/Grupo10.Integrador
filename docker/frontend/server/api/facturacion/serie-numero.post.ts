import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const tipoComprobante = body.tipo_comprobante

    if (!tipoComprobante) {
        throw createError({
            statusCode: 400,
            message: 'Tipo de comprobante es requerido'
        })
    }

    try {
        // Mapeo de tipo de comprobante a serie
        const serieMap: Record<string, string> = {
            '01': 'F001', // Factura
            '03': 'B001', // Boleta
            '07': 'FC01', // Nota de Crédito
            '08': 'FD01'  // Nota de Débito
        }

        const serie = serieMap[tipoComprobante] || 'F001'

        // Obtener el último número de la serie
        const ultimaFactura = await prisma.facturas.findFirst({
            where: {
                serie: serie
            },
            orderBy: {
                numero: 'desc'
            }
        })

        const numero = ultimaFactura ? ultimaFactura.numero + 1 : 1

        return {
            serie,
            numero
        }
    } catch (error: any) {
        console.error('Error obteniendo serie/número:', error)
        throw createError({
            statusCode: 500,
            message: 'Error al obtener serie y número: ' + error.message
        })
    }
})
