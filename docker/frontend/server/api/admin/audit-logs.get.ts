import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event): Promise<any[]> => {
    // En producción usar requireAdmin(event)

    const query = getQuery(event)
    const limit = query.limit ? parseInt(query.limit as string) : 20

    try {
        const logs = await prisma.logsAuditoria.findMany({
            take: limit,
            orderBy: {
                created_at: 'desc'
            },
            include: {
                usuario: {
                    select: {
                        nombres: true,
                        apellidos: true,
                        email: true
                    }
                }
            }
        })

        return logs
    } catch (error) {
        console.error('Error fetching audit logs:', error)
        return []
    }
})
