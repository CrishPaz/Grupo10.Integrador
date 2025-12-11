
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event): Promise<any[]> => {
    try {
        const companies = await prisma.empresas.findMany({
            where: {
                activo: true
            },
            orderBy: {
                razon_social: 'asc'
            }
        })
        return companies
    } catch (error: any) {
        console.error('Error fetching companies:', error)
        throw createError({ statusCode: 500, message: 'Error cargando empresas' })
    }
})
