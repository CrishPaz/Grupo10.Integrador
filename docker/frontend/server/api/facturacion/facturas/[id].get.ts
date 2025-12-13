import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({
            statusCode: 400,
            message: 'ID de factura es requerido'
        })
    }

    try {
        const factura = await prisma.facturas.findUnique({
            where: { id },
            include: {
                admision: {
                    include: {
                        paciente: {
                            include: {
                                usuarioUsuario: {
                                    select: {
                                        dni: true,
                                        nombres: true,
                                        apellidos: true,
                                        email: true,
                                        telefono: true
                                    }
                                },
                                empresa: {
                                    select: {
                                        ruc: true,
                                        razon_social: true,
                                        direccion: true,
                                        contacto_email: true,
                                        telefono: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if (!factura) {
            throw createError({
                statusCode: 404,
                message: 'Factura no encontrada'
            })
        }

        return { data: factura }
    } catch (error: any) {
        console.error('Error obteniendo factura:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Error al obtener factura: ' + error.message
        })
    }
})
