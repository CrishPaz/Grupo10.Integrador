import { prisma } from '~/server/utils/prisma'
// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const historyId = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    // CORREGIDO: historiaClinica
    const updatedHistory = await prisma.historiaClinica.update({
      where: { id: historyId },
      data: {
        // Actualizamos los campos JSONB
        antecedentes_personales: body.antecedentes_personales,
        antecedentes_familiares: body.antecedentes_familiares,
        habitos: body.habitos,
        alergias: body.alergias,
        medicamentos_actuales: body.medicamentos_actuales,
        examen_fisico: body.examen_fisico,
        signos_vitales: body.signos_vitales,
        updated_at: new Date(),
        updated_by: event.context.user.id
      }
    })

    return updatedHistory
  } catch (error) {
    throw createError({ statusCode: 500, message: 'Error al actualizar historia' })
  }
})