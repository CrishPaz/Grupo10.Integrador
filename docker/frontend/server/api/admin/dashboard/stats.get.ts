import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    // En producción usar requireAdmin(event)

    try {
        const [
            totalPatients,
            pendingAdmissions,
            completedAdmissions,
            activeUsers,
            registeredCompanies
        ] = await Promise.all([
            prisma.pacientes.count(),
            prisma.admisiones.count({ where: { estado: 'programado' } }),
            prisma.admisiones.count({ where: { estado: 'finalizado' } }),
            prisma.usuarios.count({ where: { activo: true } }),
            prisma.empresas.count({ where: { activo: true } })
        ])

        return {
            usuariosActivos: activeUsers,
            empresasRegistradas: registeredCompanies,
            conceptosEmitidos: completedAdmissions
        }
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        return {
            usuariosActivos: 0,
            empresasRegistradas: 0,
            conceptosEmitidos: 0
        }
    }
})
