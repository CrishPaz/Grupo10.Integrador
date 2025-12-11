import { PrismaClient } from '@prisma/client'
import { encryptTemplate, generateIV, hashTemplate } from '~/server/utils/biometric/crypto'
import { validateBiometricQuality } from '~/server/utils/biometric/quality'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    // Simulación de auth
    // await requireRole(event, ['admin', 'admissions'])

    const body = await readBody(event)
    const { usuario_id, tipo_biometrico, template_data, device_serial, quality_score } = body

    try {
        // 1. Validar usuario
        const usuario = await prisma.usuarios.findUnique({ where: { id: usuario_id } })
        if (!usuario) throw createError({ statusCode: 404, message: 'Usuario no encontrado' })

        // 2. Validar calidad (Simulada)
        const quality = validateBiometricQuality(tipo_biometrico, template_data, quality_score)
        if (!quality.passed) throw createError({ statusCode: 400, message: 'Mala calidad biométrica' })

        // 3. Encriptar
        const iv = generateIV()
        const encrypted = encryptTemplate(template_data, iv)
        const hash = hashTemplate(template_data)

        // 4. Guardar (Upsert: si ya existe para ese usuario/tipo, actualiza)
        // CORREGIDO: biometricTemplates
        // Nota: Como tenemos unique constraint compuesta, usamos deleteMany + create para simplificar reemplazo
        await prisma.biometricTemplates.deleteMany({
            where: { usuario_id, tipo_biometrico }
        })

        const template = await prisma.biometricTemplates.create({
            data: {
                usuario_id,
                tipo_biometrico,
                template_data: encrypted,
                template_hash: hash,
                quality_score: quality.score,
                device_serial: device_serial || 'MANUAL',
                iv: iv.toString('hex'),
                is_active: true
            }
        })

        return { success: true, id: template.id }

    } catch (error: any) {
        console.error('Error biométrico:', error)
        throw createError({ statusCode: 500, message: error.message })
    }
})