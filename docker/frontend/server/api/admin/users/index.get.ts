import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // Simulamos admin por ahora
  await requireAdmin(event)

  const query = getQuery(event)
  const page = parseInt(query.page as string) || 1
  const limit = parseInt(query.limit as string) || 20
  const skip = (page - 1) * limit

  // Construir filtros
  const where: any = {}

  if (query.search) {
    where.OR = [
      { dni: { contains: query.search as string } },
      { email: { contains: query.search as string } },
      { nombres: { contains: query.search as string } },
      { apellidos: { contains: query.search as string } }
    ]
  }

  try {
    // Obtener usuarios
    const [users, total] = await Promise.all([
      prisma.usuarios.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fecha_creacion: 'desc' },
        select: {
          id: true,
          dni: true,
          email: true,
          nombres: true,
          apellidos: true,
          telefono: true,
          rol: true,
          activo: true,
          especialidad: true,
          colegiatura: true,
          fecha_creacion: true
        }
      }),
      prisma.usuarios.count({ where })
    ])

    // CORRECCIÓN AQUÍ: logsAuditoria en lugar de logs_auditoria
    await prisma.logsAuditoria.create({
      data: {
        usuario_id: (event.context.user?.id && !event.context.user.id.startsWith('12345-')) ? event.context.user.id : null,
        accion: 'VIEW_USERS',
        modulo: 'admin',
        detalles: { message: `Consultó lista de usuarios (${users.length} resultados)` },
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    }
  } catch (error) {
    console.error('Error API /api/admin/users:', error)
    // Devolvemos lista vacía si falla para que no rompa la página
    return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } }
  }
})