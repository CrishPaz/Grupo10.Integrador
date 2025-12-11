import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Función auxiliar para interpretación
function calculateInterpretation(value: number | null, min: number | null, max: number | null): string {
  if (value === null || min === null || max === null) return 'no_aplica'
  if (value < min) return 'bajo'
  if (value > max) return 'alto'
  return 'normal'
}

export default defineEventHandler(async (event) => {
  // Verificar permisos (Simulados)
  await requireRole(event, ['lab', 'admin'])
  
  const testId = getRouterParam(event, 'id')
  
  if (!testId) throw createError({ statusCode: 400, message: 'Se requiere ID de solicitud' })

  const body = await readBody(event)
  const user = event.context.user

  // Validar datos básicos
  if (!body.resultados || !Array.isArray(body.resultados)) {
    throw createError({ statusCode: 400, message: 'Se requieren resultados' })
  }

  try {
    // 1. Verificar solicitud
    // CORREGIDO: solicitudesLaboratorio
    const solicitud = await prisma.solicitudesLaboratorio.findUnique({
      where: { id: testId },
      include: {
        muestra: {
          include: {
            paciente: { include: { usuarioUsuario: true } }
          }
        },
        tipo_examen: true
      }
    })

    if (!solicitud) throw createError({ statusCode: 404, message: 'Solicitud no encontrada' })

    // 2. Registrar resultados (Transacción)
    const results = await prisma.$transaction(async (tx) => {
      // Eliminar anteriores si no es borrador (para evitar duplicados)
      if (!body.es_borrador) {
        // CORREGIDO: resultadosLaboratorio
        await tx.resultadosLaboratorio.deleteMany({
          where: { solicitud_id: testId }
        })
      }

      const resultadosCreados = []

      for (const resultData of body.resultados) {
        // CORREGIDO: tiposExamenLaboratorio
        const tipoExamen = await tx.tiposExamenLaboratorio.findUnique({
          where: { id: solicitud.tipo_examen_id! }
        })

        if (!tipoExamen) continue

        // Buscar configuración del parámetro
        // Nota: En Prisma, JSON se devuelve como 'any', así que casteamos
        const parametros = (tipoExamen.parametros as any[]) || []
        const parametroConfig = parametros.find((p: any) => p.codigo === resultData.parametro_codigo)

        // Si no encontramos config, usamos valores por defecto
        const unidad = resultData.unidad || parametroConfig?.unidad
        const min = resultData.valor_referencia_min || parametroConfig?.valor_minimo
        const max = resultData.valor_referencia_max || parametroConfig?.valor_maximo

        // CORREGIDO: resultadosLaboratorio
        const resultado = await tx.resultadosLaboratorio.create({
          data: {
            solicitud_id: testId,
            parametro_codigo: resultData.parametro_codigo,
            parametro_nombre: parametroConfig?.nombre || resultData.parametro_codigo,
            resultado: resultData.resultado,
            resultado_numerico: resultData.resultado_numerico,
            unidad,
            valor_referencia_min: min,
            valor_referencia_max: max,
            valor_referencia_texto: parametroConfig?.interpretacion,
            interpretacion: calculateInterpretation(resultData.resultado_numerico, min, max),
            flag: resultData.flag,
            metodo_utilizado: resultData.metodo_utilizado,
            equipo_utilizado: body.equipo_utilizado,
            lote_reactivo: body.lote_reactivo,
            realizado_por: user.id,
            observaciones: resultData.observaciones
          }
        })
        resultadosCreados.push(resultado)
      }

      // Actualizar estado de la solicitud
      const nuevoEstado = body.es_borrador ? 'procesando' : 'completado'
      
      await tx.solicitudesLaboratorio.update({
        where: { id: testId },
        data: {
          estado: nuevoEstado,
          fecha_fin_proceso: body.es_borrador ? null : new Date(),
          ...(body.es_borrador ? {} : { fecha_inicio_proceso: new Date() })
        }
      })

      // Actualizar muestra si todo está listo
      if (!body.es_borrador) {
        const pendientes = await tx.solicitudesLaboratorio.count({
          where: {
            muestra_id: solicitud.muestra_id,
            estado: { not: 'completado' }
          }
        })

        if (pendientes === 0) {
          await tx.muestrasLaboratorio.update({
            where: { id: solicitud.muestra_id! },
            data: { estado: 'completada' }
          })
          
          // Actualizar admisión (si existe relación)
          if (solicitud.muestra?.admision_id) {
             await tx.admisiones.update({
                where: { id: solicitud.muestra.admision_id },
                data: { estado: 'completado' }
             })
          }
        }
      }

      return resultadosCreados
    })

    // 3. Notificaciones (Opcional)
    if (!body.es_borrador && process.env.N8N_WEBHOOK_URL) {
      try {
        await $fetch(process.env.N8N_WEBHOOK_URL + '/results-ready', {
            method: 'POST',
            body: {
                solicitud_id: testId,
                paciente: solicitud.muestra?.paciente?.usuarioUsuario?.email
            }
        })
      } catch (e) {}
    }

    // 4. Logs
    await prisma.logsAuditoria.create({
      data: {
        usuario_id: user.id,
        accion: body.es_borrador ? 'SAVE_DRAFT' : 'SAVE_FINAL',
        modulo: 'laboratory',
        detalles: `Resultados para solicitud ${solicitud.codigo_solicitud}`,
        ip_address: '127.0.0.1',
        user_agent: 'navegador'
      }
    })

    return { success: true, count: results.length }

  } catch (error: any) {
    console.error('Error guardando resultados:', error)
    throw createError({
      statusCode: 500,
      message: 'Error interno: ' + error.message
    })
  }
})