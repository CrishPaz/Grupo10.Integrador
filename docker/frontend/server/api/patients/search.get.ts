import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = query.q as string

  if (!q || q.length < 2) {
    return []
  }

  try {
    console.log('[Patient Search] Query:', q)

    // Search usuarios with rol='patient' and include their pacientes record
    const usuarios = await prisma.usuarios.findMany({
      where: {
        rol: 'patient',
        OR: [
          { dni: { contains: q } },
          { nombres: { contains: q, mode: 'insensitive' } },
          { apellidos: { contains: q, mode: 'insensitive' } }
        ]
      },
      include: {
        pacientes: {
          include: {
            empresa: {
              select: { razon_social: true }
            }
          }
        }
      },
      take: 10
    })

    console.log('[Patient Search] Found usuarios:', usuarios.length)
    console.log('[Patient Search] Sample usuario:', usuarios[0])

    // Map to format expected by frontend: each result should have pacientes.id and usuarioUsuario structure
    const patients = usuarios
      .filter(u => u.pacientes) // Only include users that have a pacientes record
      .map(u => ({
        id: u.pacientes!.id, // This is the pacientes.id
        usuario_id: u.id,
        usuarioUsuario: {
          id: u.id,
          dni: u.dni,
          nombres: u.nombres,
          apellidos: u.apellidos
        },
        empresa: u.pacientes!.empresa
      }))

    console.log('[Patient Search] Filtered patients:', patients.length)

    return { patients }

  } catch (error) {
    console.error('[Patient Search] Error:', error)
    return { patients: [] }
  }
})