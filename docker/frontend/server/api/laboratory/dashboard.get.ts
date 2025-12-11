
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Parallel queries
        const [
            muestrasHoy,
            pendientes,
            completados,
            recentSamples,
            equipment
        ] = await Promise.all([
            prisma.muestrasLaboratorio.count({
                where: { fecha_recepcion: { gte: today } }
            }),
            prisma.solicitudesLaboratorio.count({
                where: { estado: 'pendiente' }
            }),
            prisma.solicitudesLaboratorio.count({
                where: { estado: 'completado' }
            }),
            prisma.muestrasLaboratorio.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: { paciente: { include: { usuarioUsuario: true } } }
            }),
            prisma.equiposLaboratorio.findMany({
                select: { id: true, nombre: true, estado: true }
            })
        ])

        // Mock calculation for average time (placeholder)
        const tiempo_promedio = 45

        return {
            stats: {
                muestras_hoy: muestrasHoy,
                pendientes,
                completados,
                tiempo_promedio
            },
            recentSamples: recentSamples.map(m => ({
                id: m.id,
                codigo_muestra: m.codigo_muestra,
                paciente: m.paciente
                    ? `${m.paciente.usuarioUsuario.nombres} ${m.paciente.usuarioUsuario.apellidos}`
                    : 'Desconocido',
                estado: m.estado,
                tipo_muestra: m.tipo_muestra,
                fecha: m.created_at
            })),
            equipmentStatus: equipment.map(e => ({
                id: e.id,
                nombre: e.nombre,
                estado: e.estado,
                pruebas_hoy: 0 // Placeholder logic
            }))
        }

    } catch (error) {
        console.error('Error fetching lab dashboard:', error)
        return {
            stats: { muestras_hoy: 0, pendientes: 0, completados: 0, tiempo_promedio: 0 },
            recentSamples: [],
            equipmentStatus: []
        }
    }
})
