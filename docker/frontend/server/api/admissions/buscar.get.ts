import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const searchTerm = query.q as string

    console.log('🔍 Búsqueda de admisiones:', searchTerm)

    if (!searchTerm || searchTerm.length < 3) {
        console.log('⚠️ Término de búsqueda muy corto')
        return { data: [] }
    }

    try {
        // Buscar admisiones por DNI o nombre del paciente
        const admisiones = await prisma.admisiones.findMany({
            where: {
                paciente: {
                    usuarioUsuario: {
                        OR: [
                            {
                                dni: {
                                    contains: searchTerm
                                }
                            },
                            {
                                nombres: {
                                    contains: searchTerm,
                                    mode: 'insensitive'
                                }
                            },
                            {
                                apellidos: {
                                    contains: searchTerm,
                                    mode: 'insensitive'
                                }
                            }
                        ]
                    }
                }
            },
            include: {
                paciente: {
                    include: {
                        usuarioUsuario: true,
                        empresa: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            },
            take: 20
        })

        console.log(`✅ Encontradas ${admisiones.length} admisiones`)

        // Formatear respuesta para que coincida con lo que espera el componente
        const formattedData = admisiones.map(adm => ({
            id: adm.id,
            fecha_programada: adm.fecha_programada,
            tipo_examen: adm.tipo_examen || 'No especificado',
            paciente: {
                usuario: {
                    dni: adm.paciente?.usuarioUsuario?.dni || '',
                    nombres: adm.paciente?.usuarioUsuario?.nombres || '',
                    apellidos: adm.paciente?.usuarioUsuario?.apellidos || '',
                    email: adm.paciente?.usuarioUsuario?.email || '',
                    telefono: adm.paciente?.usuarioUsuario?.telefono || ''
                },
                empresa: adm.paciente?.empresa ? {
                    ruc: adm.paciente.empresa.ruc || '',
                    razon_social: adm.paciente.empresa.razon_social || '',
                    direccion: adm.paciente.empresa.direccion || '',
                    contacto_email: adm.paciente.empresa.contacto_email || '',
                    telefono: adm.paciente.empresa.telefono || ''
                } : undefined
            }
        }))

        console.log('📋 Datos formateados:', JSON.stringify(formattedData, null, 2))

        return { data: formattedData }
    } catch (error: any) {
        console.error('❌ Error buscando admisiones:', error)
        console.error('Error details:', error.message)

        // Retornar array vacío en lugar de error
        return { data: [] }
    }
})
