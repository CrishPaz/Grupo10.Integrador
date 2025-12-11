import { PrismaClient } from '@prisma/client'
import { enviarComprobanteSUNAT } from '~/server/utils/sunat-client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Simulamos validación de admin
  // await requireRole(event, ['admin'])
  
  const body = await readBody(event)
  const { factura_id } = body

  if (!factura_id) throw createError({ statusCode: 400, message: 'ID requerido' })

  try {
    // 1. Obtener factura
    // CORREGIDO: facturas
    const factura = await prisma.facturas.findUnique({
      where: { id: factura_id }
    })

    if (!factura) throw createError({ statusCode: 404, message: 'Factura no encontrada' })

    // 2. Simular firma si no tiene (para que el flujo no se rompa)
    const xmlFirmado = factura.xml_firmado || '<xml>Factura Simulada</xml>'

    // 3. Enviar a SUNAT (Usando nuestra utilidad simulada)
    const resultado = await enviarComprobanteSUNAT(
        xmlFirmado, 
        factura.tipo_comprobante, 
        factura.serie, 
        factura.numero
    )

    // 4. Actualizar estado
    // CORREGIDO: facturas
    await prisma.facturas.update({
        where: { id: factura_id },
        data: {
            estado_sunat: resultado.aceptado ? 'ACEPTADO' : 'RECHAZADO',
            cdr_respuesta: resultado.cdr,
            fecha_respuesta_sunat: new Date()
        }
    })

    return { 
        success: true, 
        data: { 
            estado: resultado.aceptado ? 'ACEPTADO' : 'RECHAZADO',
            cdr: resultado.cdr 
        } 
    }

  } catch (error: any) {
    console.error('Error SUNAT:', error)
    throw createError({ statusCode: 500, message: error.message })
  }
})