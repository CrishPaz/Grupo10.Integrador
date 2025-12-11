import { PrismaClient } from '@prisma/client'
import { decryptTemplate, compareTemplates } from '~/server/utils/biometric/matching'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { template_data, device_serial, tipo_biometrico = 'huella_dactilar' } = body

    try {
        // 1. Buscar todos los templates activos de ese tipo
        const templates = await prisma.biometricTemplates.findMany({
            where: { tipo_biometrico, is_active: true },
            include: { usuario: true }
        })

        let bestMatch = null

        // 2. Comparar uno por uno (En producción esto se hace en memoria o con motor especializado)
        for (const tmpl of templates) {
            const decrypted = decryptTemplate(tmpl.template_data, Buffer.from(tmpl.iv, 'hex'))
            const match = compareTemplates(template_data, decrypted, tipo_biometrico)

            if (match.score >= 65) {
                bestMatch = { usuario: tmpl.usuario, score: match.score }
                break // Encontramos al usuario
            }
        }

        if (bestMatch) {
            // Registrar éxito
            await prisma.biometricAuthAttempts.create({
                data: {
                    usuario_id: bestMatch.usuario.id,
                    tipo_biometrico,
                    is_successful: true,
                    match_score: bestMatch.score,
                    device_id: device_serial
                }
            })

            return { success: true, usuario: bestMatch.usuario }
        } else {
            return { success: false, message: 'No coinciden las huellas' }
        }

    } catch (error: any) {
        throw createError({ statusCode: 500, message: error.message })
    }
})