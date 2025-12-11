
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const admissions = await prisma.admisiones.findMany({
            include: {
                paciente: {
                    include: {
                        usuarioUsuario: true,
                        empresa: true
                    }
                },
                empresa: true
            },
            orderBy: {
                fecha_programada: 'desc'
            },
            take: 50
        })

        // Calculate stats
        const today = new Date().toISOString().split('T')[0]
        const hoy = admissions.filter(a => a.fecha_programada.toISOString().startsWith(today)).length
        const programadas = admissions.filter(a => a.estado === 'programado').length
        const completadas = admissions.filter(a => a.estado === 'completado').length
        const canceladas = admissions.filter(a => a.estado === 'cancelado').length

        return {
            admissions: admissions.map(a => ({
                id: a.id,
                paciente: {
                    nombres: a.paciente.usuarioUsuario.nombres,
                    apellidos: a.paciente.usuarioUsuario.apellidos,
                    dni: a.paciente.usuarioUsuario.dni
                },
                empresa: a.empresa ? { razon_social: a.empresa.razon_social } : null,
                tipo_examen: a.tipo_examen,
                estado: a.estado,
                fecha_programada: a.fecha_programada
            })),
            stats: { hoy, programadas, completadas, canceladas }
        }
    } catch (error) {
        console.error('Error fetching admissions:', error)
        return { admissions: [], stats: { hoy: 0, programadas: 0, completadas: 0, canceladas: 0 } }
    }
})
