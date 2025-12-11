
import { prisma } from '~/server/utils/prisma'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { dni, nombres, apellidos, fecha_nacimiento, genero, telefono, email, empresa_id } = body

    if (!dni || !nombres || !apellidos) {
        throw createError({ statusCode: 400, message: 'DNI, nombres y apellidos son obligatorios' })
    }

    try {
        // 1. Check if user already exists
        const existingUser = await prisma.usuarios.findFirst({
            where: {
                OR: [
                    { dni: dni },
                    { email: email || 'dummy_email_check' }
                ]
            }
        })

        if (existingUser) {
            throw createError({ statusCode: 409, message: 'El usuario con este DNI o email ya existe' })
        }

        // 2. Create User + Patient in a transaction
        const passwordHash = await bcrypt.hash(dni, 10) // Default password is DNI

        const result = await prisma.$transaction(async (tx) => {
            // Create User
            const user = await tx.usuarios.create({
                data: {
                    dni,
                    nombres,
                    apellidos,
                    email: email || `${dni}@paciente.com`, // Fallback email if not provided
                    password_hash: passwordHash,
                    rol: 'patient',
                    activo: true,
                    telefono,
                    fecha_creacion: new Date()
                }
            })

            // Create Patient Profile
            const patient = await tx.pacientes.create({
                data: {
                    usuario_id: user.id,
                    fecha_nacimiento: fecha_nacimiento ? new Date(fecha_nacimiento) : null,
                    genero: genero || null,
                    empresa_id: empresa_id || null // Now correctly used
                }
            })
            return { user, patient }
        })

        return { success: true, user: result.user, patient: result.patient }

    } catch (error: any) {
        console.error('Error creating patient:', error)
        throw createError({ statusCode: 500, message: error.message || 'Error al registrar paciente' })
    }
})
