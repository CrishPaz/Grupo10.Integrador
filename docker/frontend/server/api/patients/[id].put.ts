
import { prisma } from '~/server/utils/prisma'
import { requireRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    await requireRole(event, ['admin', 'doctor', 'receptionist'])

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { dni, nombres, apellidos, fecha_nacimiento, genero, empresa_id, telefono, email } = body

    if (!id) throw createError({ statusCode: 400, message: 'ID requerido' })

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Get patient to find user_id
            const patient = await tx.pacientes.findUnique({
                where: { id },
                include: { usuarioUsuario: true }
            })

            if (!patient) throw createError({ statusCode: 404, message: 'Paciente no encontrado' })

            // 2. Update User (names, dni, contact)
            await tx.usuarios.update({
                where: { id: patient.usuario_id },
                data: {
                    dni,
                    nombres,
                    apellidos,
                    telefono,
                    email
                }
            })

            // 3. Update Patient (company, birth date, gender)
            const updatedPatient = await tx.pacientes.update({
                where: { id },
                data: {
                    fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : undefined,
                    genero,
                    empresa_id: empresa_id || null
                },
                include: {
                    empresa: true
                }
            })

            return updatedPatient
        })

        return result
    } catch (error: any) {
        console.error('Error updating patient:', error)
        throw createError({ statusCode: 500, message: 'Error actualizando paciente' })
    }
})
