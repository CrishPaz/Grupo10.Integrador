import { prisma } from '~/server/utils/prisma'
import { requireAdmin } from '~/server/utils/auth'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const body = await readBody(event)

  if (!body.dni || body.dni.length !== 8) throw createError({ statusCode: 400, message: 'DNI inválido' })

  // Verificar si existe
  const existingUser = await prisma.usuarios.findFirst({
    where: { OR: [{ dni: body.dni }, { email: body.email }] }
  })

  if (existingUser) throw createError({ statusCode: 409, message: 'Usuario ya existe' })

  // Encriptar pass
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(body.password || '123456', salt)

  // Crear usuario con transacción
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.usuarios.create({
      data: {
        dni: body.dni,
        email: body.email,
        password_hash: passwordHash,
        nombres: body.nombres,
        apellidos: body.apellidos,
        telefono: body.telefono,
        rol: body.rol,
        activo: true
      }
    })

    // Logs de auditoría
    await tx.logsAuditoria.create({
      data: {
        usuario_id: (event.context.user?.id && !event.context.user.id.startsWith('12345-')) ? event.context.user.id : null,
        accion: 'CREATE_USER',
        modulo: 'admin',
        detalles: `Creó usuario: ${newUser.nombres}`,
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return newUser
  })

  const { password_hash, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
})