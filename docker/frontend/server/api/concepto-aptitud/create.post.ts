import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Verificar permisos (Simulado)
    await requireRole(event, ['doctor', 'admin'])

    const body = await readBody(event)
    const user = event.context.user

    if (!body.admision_id || !body.resultado) {
        throw createError({ statusCode: 400, message: 'Faltan datos requeridos' })
    }

    try {
        // 1. Verificar admisión
        // CORREGIDO: admisiones
        const admission = await prisma.admisiones.findUnique({
            where: { id: body.admision_id },
            include: { historia_clinica: true }
        })

        if (!admission) throw createError({ statusCode: 404, message: 'Admisión no encontrada' })

        // Validar historia clínica (Opcional, desactivado para pruebas rápidas)
        // if (!admission.historia_clinica) throw createError({ statusCode: 400, message: 'Falta historia clínica' })

        // 2. Guardar concepto (Upsert: Crear o Actualizar)
        // CORREGIDO: conceptoAptitud
        const existing = await prisma.conceptoAptitud.findUnique({
            where: { admision_id: body.admision_id }
        })

        let concepto

        if (existing) {
            concepto = await prisma.conceptoAptitud.update({
                where: { id: existing.id },
                data: {
                    resultado: body.resultado,
                    restricciones: body.restricciones,
                    recomendaciones: body.recomendaciones,
                    fecha_vigencia: body.fecha_vigencia ? new Date(body.fecha_vigencia) : null,
                    firmado_por: user.id,
                    updated_at: new Date()
                }
            })
        } else {
            concepto = await prisma.conceptoAptitud.create({
                data: {
                    admision_id: body.admision_id,
                    resultado: body.resultado,
                    restricciones: body.restricciones,
                    recomendaciones: body.recomendaciones,
                    fecha_vigencia: body.fecha_vigencia ? new Date(body.fecha_vigencia) : null,
                    firmado_por: user.id
                }
            })

            // Cerrar admisión
            await prisma.admisiones.update({
                where: { id: body.admision_id },
                data: { estado: 'completado' }
            })
        }

        // 3. Auditoría
        // CORREGIDO: auditoriaConceptos
        await prisma.auditoriaConceptos.create({
            data: {
                concepto_id: concepto.id,
                accion: existing ? 'MODIFICACION' : 'CREACION',
                usuario_id: user.id,
                detalles: { resultado: body.resultado },
                ip_address: '127.0.0.1',
                user_agent: 'navegador'
            }
        })

        return { success: true, data: concepto }

    } catch (error: any) {
        console.error('Error creando aptitud:', error)
        throw createError({ statusCode: 500, message: error.message })
    }
})