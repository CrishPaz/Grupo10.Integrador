
import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id

    if (!id) {
        throw createError({ statusCode: 400, message: 'ID requerido' })
    }

    try {
        const sample = await prisma.muestrasLaboratorio.findUnique({
            where: { id },
            include: {
                paciente: {
                    include: { usuarioUsuario: true } // For names
                },
                admision: true // To know what exam was ordered
            }
        })

        if (!sample) {
            throw createError({ statusCode: 404, message: 'Muestra no encontrada' })
        }

        // Determine pending tests based on Admission
        // In a real system, we'd query SolicitudesLaboratorio.
        // Here we simulate a "pending test" derived from the Admission's exam type.
        const pendingTests = []
        if (sample.admision?.tipo_examen) {
            pendingTests.push({
                id: sample.admision.id, // Use admission ID as test ID for now
                examen_nombre: sample.admision.tipo_examen,
                categoria: 'General'
            })
        } else {
            // Fallback or multiple tests logic
            pendingTests.push({ id: 'custom', examen_nombre: 'Análisis General', categoria: 'General' })
        }

        return {
            sample: {
                id: sample.id,
                codigo_muestra: sample.codigo_muestra,
                paciente: {
                    nombres: sample.paciente?.usuarioUsuario.nombres || '',
                    apellidos: sample.paciente?.usuarioUsuario.apellidos || ''
                },
                tipo_muestra: sample.tipo_muestra
            },
            pendingTests
        }

    } catch (error: any) {
        console.error('Error fetching sample details:', error)
        throw createError({ statusCode: 500, message: error.message })
    }
})
