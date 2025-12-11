import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  // Leemos los datos que envía el guardia
  const body = await readBody(event)

  // Guardamos en la base de datos
  const log = await prisma.logsAuditoria.create({
    data: {
      usuario_id: (body.usuario_id && !body.usuario_id.startsWith('12345-')) ? body.usuario_id : null, // Puede ser null si no hay usuario
      accion: body.accion,
      modulo: body.modulo,
      detalles: body.detalles,
      ip_address: body.ip_address,
      user_agent: body.user_agent,
      created_at: new Date()
    }
  })

  return { success: true, logId: log.id }
})