import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'
// const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Verificar permisos (Simulados)
  await requireRole(event, ['doctor', 'admin'])

  const admissionId = getRouterParam(event, 'admissionId')

  if (!admissionId) throw createError({ statusCode: 400, message: 'Se requiere ID de admisión' })

  try {
    // 1. Obtener admisión
    const admission = await prisma.admisiones.findUnique({
      where: { id: admissionId },
      include: {
        paciente: {
          include: {
            usuarioUsuario: true,
            empresa: true
          }
        },
        medico: true
      }
    })

    if (!admission) throw createError({ statusCode: 404, message: 'Admisión no encontrada' })

    // 2. Obtener o crear historia clínica
    // CORREGIDO: historiaClinica
    let clinicalHistory: any = await prisma.historiaClinica.findUnique({
      where: { admision_id: admissionId },
      include: {
        // CORREGIDO: notasEvolucion, archivosHistoriaClinica (Prisma usa nombres compuestos)
        notas_evolucion: {
          include: { usuario: true },
          orderBy: { fecha: 'desc' },
          take: 10
        },
        archivos: { // En el schema le pusimos "archivos" a la relación
          orderBy: { created_at: 'desc' },
          take: 20
        }
      }
    })

    // Crear si no existe
    if (!clinicalHistory) {
      clinicalHistory = await prisma.historiaClinica.create({
        data: {
          admision_id: admissionId,
          paciente_id: admission.paciente_id,
          created_by: event.context.user.id
        },
        include: {
          notas_evolucion: true,
          archivos: true
        }
      })
    }

    // 3. Obtener exámenes especializados
    // CORREGIDO: examenesEspecializados
    const examenes = await prisma.examenesEspecializados.findMany({
      where: { admision_id: admissionId },
      include: {
        realizador: true,
        revisor: true
      },
      orderBy: { created_at: 'desc' }
    })

    // 4. Obtener antecedentes laborales
    // CORREGIDO: antecedentesLaborales
    const antecedentesLaborales = await prisma.antecedentesLaborales.findMany({
      where: { paciente_id: admission.paciente_id },
      include: { empresa: true },
      orderBy: { fecha_inicio: 'desc' }
    })

    // 5. Registrar Acceso (Auditoría)
    // CORREGIDO: accesosHistoriaClinica
    await prisma.accesosHistoriaClinica.create({
      data: {
        historia_clinica_id: clinicalHistory.id,
        usuario_id: event.context.user.id,
        tipo_acceso: 'consulta',
        detalles: { accion: 'Lectura completa' },
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return {
      clinicalHistory,
      patient: {
        ...admission.paciente.usuarioUsuario,
        id: admission.paciente.usuarioUsuario.id, // Asegurar ID del usuario
        dni: admission.paciente.usuarioUsuario.dni,
        empresa: admission.paciente.empresa,
        tipo_sangre: admission.paciente.tipo_sangre,
        alergias: admission.paciente.alergias,
        medicamentos_actuales: admission.paciente.medicamentos_actuales
      },
      admission: {
        id: admission.id,
        tipo_examen: admission.tipo_examen,
        estado: admission.estado,
        fecha_programada: admission.fecha_programada,
        paciente_id: admission.paciente_id,
        medico: admission.medico
      },
      examenes,
      antecedentesLaborales
    }

  } catch (error: any) {
    console.error('Error historia clínica:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Error interno'
    })
  }
})